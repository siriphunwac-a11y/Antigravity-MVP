-- ==========================================
-- Cloudflare D1 Database Schema
-- บริษัท น้ำเพชรค้าไม้ จำกัด (One Stop Service Platform)
-- ==========================================

-- 1. Products Master SKU Table
CREATE TABLE IF NOT EXISTS products (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    price REAL NOT NULL,
    unit TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 50,
    weight_kg REAL NOT NULL DEFAULT 0.0,
    bin_location TEXT,
    image TEXT,
    units_sold_month INTEGER DEFAULT 0,
    total_sales_month REAL DEFAULT 0.0,
    margin_percent REAL DEFAULT 20.0,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Product Batches & Lots Table
CREATE TABLE IF NOT EXISTS product_lots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL,
    lot_no TEXT NOT NULL,
    cost_price REAL NOT NULL,
    qty INTEGER NOT NULL,
    receive_date TEXT NOT NULL,
    FOREIGN KEY (sku) REFERENCES products(sku)
);

-- 3. Cashiers & POS Terminals Table
CREATE TABLE IF NOT EXISTS cashiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    terminal TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    total_today REAL DEFAULT 0.0
);

-- 4. Sales Transactions Table (Tax Invoice, Quotation, Cash Sale)
CREATE TABLE IF NOT EXISTS sales_transactions (
    doc_no TEXT PRIMARY KEY,
    doc_type TEXT NOT NULL, -- 'QUOTATION', 'FULL_TAX_INVOICE', 'CASH_SALE_WITH_HEADER', 'CASH_SALE_NO_HEADER', 'DELIVERY_NOTE', 'BILLING_NOTE'
    customer_name TEXT NOT NULL,
    customer_address TEXT,
    customer_tax_id TEXT,
    vat_type TEXT NOT NULL DEFAULT 'INCLUDE_VAT',
    subtotal REAL NOT NULL,
    vat_amount REAL NOT NULL,
    delivery_fee REAL DEFAULT 0.0,
    deposit_amount REAL DEFAULT 0.0,
    grand_total REAL NOT NULL,
    remaining_amount REAL NOT NULL,
    payment_method TEXT NOT NULL, -- 'CASH', 'BANK_TRANSFER'
    bank_account TEXT,
    cashier_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Sales Transaction Line Items Table
CREATE TABLE IF NOT EXISTS transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_no TEXT NOT NULL,
    sku TEXT NOT NULL,
    item_name TEXT NOT NULL,
    unit_price REAL NOT NULL,
    qty INTEGER NOT NULL,
    total_price REAL NOT NULL,
    FOREIGN KEY (doc_no) REFERENCES sales_transactions(doc_no)
);

-- 6. Stock Audit Movement Logs Table
CREATE TABLE IF NOT EXISTS stock_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    sku TEXT NOT NULL,
    product_name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'OUT_SALE', 'IN_RETURN', 'IN_MANUAL'
    qty INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    actor TEXT NOT NULL,
    note TEXT
);

-- 7. Accounts Receivable (AR) Bills Table
CREATE TABLE IF NOT EXISTS ar_bills (
    bill_no TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_tel TEXT,
    total_amount REAL NOT NULL,
    paid_amount REAL DEFAULT 0.0,
    deposit_amount REAL DEFAULT 0.0,
    remaining_amount REAL NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DUE_SOON'
);

-- Initial Data Population
INSERT OR IGNORE INTO products (sku, name, category, brand, price, unit, stock, min_stock, weight_kg, bin_location, image, units_sold_month, total_sales_month, margin_percent, description) VALUES
('WOD-001', 'ไม้ฝาเฌอร่า/SCG ลายชัยพฤกษ์ 15x300 ซม.', 'wood', 'NAMPHET', 95.0, 'แผ่น', 1200, 200, 4.5, 'W-01-01', '🪵', 4200, 399000.0, 28.0, 'ไม้ฝาสังเคราะห์ คุณภาพสูง ไม่หดตัว ไม่โก่งงอ ปลวกไม่กิน หน้ากว้าง 15 ซม. ยาว 300 ซม.'),
('WOD-002', 'ไม้พื้นสังเคราะห์ SPC/SCG 20x300 ซม.', 'wood', 'NAMPHET', 240.0, 'แผ่น', 800, 150, 8.0, 'W-02-05', '🪵', 1500, 360000.0, 26.5, 'ไม้พื้นสังเคราะห์หน้ากว้าง 20 ซม. ยาว 300 ซม. ทนแดด ทนฝน'),
('BRD-001', 'แผ่นยิปซั่ม ตราช้าง ขอบเรียบ 120x240 ซม. หนา 9 มม.', 'board', 'GYPROC', 165.0, 'แผ่น', 950, 200, 14.0, 'G-01-02', '🧱', 3100, 511500.0, 22.0, 'แผ่นยิปซั่มสำหรับฝ้าเพดานและผนังเบา ผิวเรียบเนียน ติดตั้งง่าย'),
('BRD-002', 'แผ่นสมาร์ทบอร์ด SCG ขอบเรียบ 120x240 ซม. หนา 6 มม.', 'board', 'SCG', 210.0, 'แผ่น', 650, 100, 25.0, 'G-02-04', '🏗️', 1900, 399000.0, 21.0, 'แผ่นไฟเบอร์ซีเมนต์บอร์ด แข็งแกร่ง ทนน้ำ ทนความชื้น'),
('FNC-001', 'เสารั้วคอนกรีตอัดแรง 3x3 นิ้ว ยาว 2.0 เมตร (เจาะรู)', 'fence', 'NAMPHET', 120.0, 'ต้น', 500, 100, 22.0, 'F-01-01', '🏛️', 1200, 144000.0, 30.0, 'เสารั้วคอนกรีตอัดแรง เจาะรูสำหรับขึงลวดหนาม แข็งแรงทนทาน'),
('FNC-002', 'ลวดหนามชุบกัลวาไนซ์ตราน้ำเพชร #14 (ยาว 100 เมตร/ม้วน)', 'fence', 'NAMPHET', 650.0, 'ม้วน', 250, 50, 10.0, 'F-02-03', '⛓️', 480, 312000.0, 28.5, 'ลวดหนามชุบกัลวาไนซ์อย่างหนา กันสนิม หนามแหลมคม ยาวเต็ม 100 เมตร');

INSERT OR IGNORE INTO cashiers (id, name, terminal, status, total_today) VALUES
('CS-001', 'สมชาย สายเปย์', 'POS-01 (เคาน์เตอร์ 1)', 'Active', 145200.0),
('CS-002', 'วิภาดา ขยันขาย', 'POS-02 (เคาน์เตอร์ 2)', 'Active', 98400.0),
('SUP-001', 'สมศักดิ์ ผู้จัดการ', 'POS-00 (ADMIN)', 'Active', 210000.0);
