-- Create Database
CREATE DATABASE IF NOT EXISTS welfare_db;

-- Connect to the database
\c welfare_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'treasurer', 'secretary', 'member')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_code VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(20),
    id_number VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10),
    address VARCHAR(500),
    occupation VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    membership_status VARCHAR(50) DEFAULT 'active' CHECK (membership_status IN ('active', 'inactive', 'suspended')),
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    registration_fee_paid DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Payment Types table
CREATE TABLE IF NOT EXISTS payment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    amount DECIMAL(10, 2),
    frequency VARCHAR(50) CHECK (frequency IN ('one-time', 'monthly', 'quarterly', 'annual')),
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL,
    payment_type_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_month VARCHAR(20),
    payment_year INT,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'check', 'bank_transfer', 'mobile_money')),
    transaction_reference VARCHAR(100),
    notes TEXT,
    recorded_by UUID,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_type_id) REFERENCES payment_types(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_member_id (member_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_month_year (payment_month, payment_year)
);

-- Payment Receipts table
CREATE TABLE IF NOT EXISTS payment_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL UNIQUE,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued_by UUID NOT NULL,
    receipt_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (issued_by) REFERENCES users(id)
);

-- Member Monthly Balances (for quick calculations)
CREATE TABLE IF NOT EXISTS member_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL UNIQUE,
    total_paid DECIMAL(10, 2) DEFAULT 0.00,
    total_due DECIMAL(10, 2) DEFAULT 0.00,
    last_payment_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_entity (entity_type, entity_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    member_id UUID,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    data_type VARCHAR(50),
    updated_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_members_status ON members(membership_status);
CREATE INDEX idx_members_registration_date ON members(registration_date);
CREATE INDEX idx_payments_status ON payments(is_verified);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Create views for reporting

-- Member Payment Summary View
CREATE VIEW IF NOT EXISTS v_member_payment_summary AS
SELECT 
    m.id,
    m.member_code,
    m.first_name,
    m.last_name,
    m.email,
    m.phone_number,
    m.membership_status,
    COUNT(p.id) as total_payments,
    COALESCE(SUM(p.amount), 0) as total_paid,
    MAX(p.payment_date) as last_payment_date,
    m.registration_date
FROM members m
LEFT JOIN payments p ON m.id = p.member_id AND p.is_verified = true
GROUP BY m.id, m.member_code, m.first_name, m.last_name, m.email, m.phone_number, m.membership_status, m.registration_date;

-- Monthly Payment Report View
CREATE VIEW IF NOT EXISTS v_monthly_payment_report AS
SELECT 
    p.payment_month,
    p.payment_year,
    pt.name as payment_type,
    COUNT(DISTINCT p.member_id) as members_paid,
    COUNT(p.id) as payment_count,
    COALESCE(SUM(p.amount), 0) as total_amount,
    COUNT(CASE WHEN p.is_verified = true THEN 1 END) as verified_payments
FROM payments p
JOIN payment_types pt ON p.payment_type_id = pt.id
GROUP BY p.payment_month, p.payment_year, pt.name
ORDER BY p.payment_year DESC, p.payment_month DESC;

-- Outstanding Payments View
CREATE VIEW IF NOT EXISTS v_outstanding_payments AS
SELECT 
    m.id,
    m.member_code,
    m.first_name,
    m.last_name,
    pt.name as payment_type,
    pt.amount as expected_amount,
    COALESCE(SUM(p.amount), 0) as paid_amount,
    (pt.amount - COALESCE(SUM(p.amount), 0)) as outstanding_amount,
    m.membership_status
FROM members m
CROSS JOIN payment_types pt
LEFT JOIN payments p ON m.id = p.member_id AND p.payment_type_id = pt.id
WHERE m.membership_status = 'active'
GROUP BY m.id, m.member_code, m.first_name, m.last_name, pt.id, pt.name, pt.amount, m.membership_status
HAVING outstanding_amount > 0;

-- Insert default payment types
INSERT INTO payment_types (name, description, amount, frequency, is_mandatory) VALUES
('Registration Fee', 'One-time registration fee for new members', 500.00, 'one-time', true),
('Monthly Contribution', 'Regular monthly membership contribution', 200.00, 'monthly', true),
('Welfare Fund', 'Monthly welfare contribution for member assistance', 150.00, 'monthly', true),
('Annual Fee', 'Annual membership renewal fee', 1000.00, 'annual', true)
ON CONFLICT (name) DO NOTHING;
