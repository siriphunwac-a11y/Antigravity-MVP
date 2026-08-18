// ==========================================
// บริษัท น้ำเพชรค้าไม้ จำกัด - Mock Database
// ==========================================

const INITIAL_DATA = {
  // Company Information
  companyInfo: {
    name: 'บริษัท น้ำเพชรค้าไม้ จำกัด',
    taxId: '0765565001234',
    address: '8 หมู่ที่ 1 ตำบลหนองปรง อำเภอเขาย้อย จ.เพชรบุรี 76140',
    phones: '080-995-7811, 086-339-1833, 081-526-2975',
    email: 'namphet.woodtrade@gmail.com',
    branch: 'สำนักงานใหญ่ (00000)'
  },

  // Current User Role: 'supervisor' or 'cashier'
  currentUser: {
    id: 'CS-001',
    name: 'คุณสมชาย (พนักงาน POS / Cashier)',
    role: 'cashier',
    avatar: '🧑‍💻'
  },

  // Bank Accounts for Store Payments (บริษัท น้ำเพชรค้าไม้ จำกัด)
  storeBankAccounts: [
    { id: 'KBANK', bankName: 'ธนาคารกสิกรไทย (KBANK)', accountNo: '012-3-45678-9', accountName: 'บจก. น้ำเพชรค้าไม้' },
    { id: 'SCB', bankName: 'ธนาคารไทยพาณิชย์ (SCB)', accountNo: '987-6-54321-0', accountName: 'บจก. น้ำเพชรค้าไม้' },
    { id: 'BBL', bankName: 'ธนาคารกรุงเทพ (BBL)', accountNo: '111-2-33344-5', accountName: 'บจก. น้ำเพชรค้าไม้' }
  ],

  // Cashiers List for POS Tracking
  cashiers: [
    { id: 'CS-001', name: 'สมชาย สายเปย์', terminal: 'POS-01 (เคาน์เตอร์ 1)', status: 'Active', totalToday: 145200 },
    { id: 'CS-002', name: 'วิภาดา ขยันขาย', terminal: 'POS-02 (เคาน์เตอร์ 2)', status: 'Active', totalToday: 98400 },
    { id: 'SUP-001', name: 'สมศักดิ์ ผู้จัดการ', terminal: 'POS-00 (ADMIN)', status: 'Active', totalToday: 210000 }
  ],

  // Brands Matrix
  brands: [
    { id: 'NAMPHET', name: 'น้ำเพชรไม้แปรรูป', logo: '🪵', category: 'ไม้ฝา/ไม้พื้น/ไม้โครงสร้าง', salesThisMonth: 1450000, profitMargin: 25.0, marketShare: 40 },
    { id: 'SCG', name: 'SCG (เอสซีจี)', logo: '🏗️', category: 'สมาร์ทบอร์ด/ปูน/หลังคา', salesThisMonth: 1250000, profitMargin: 18.5, marketShare: 30 },
    { id: 'TOA', name: 'TOA (ทีโอเอ)', logo: '🎨', category: 'สีและเคมีภัณฑ์', salesThisMonth: 680000, profitMargin: 24.0, marketShare: 15 },
    { id: 'GYPROC', name: 'แผ่นยิปซั่ม ตราช้าง/Gyproc', logo: '🧱', category: 'ยิปซั่ม/ฝ้าเพดาน', salesThisMonth: 520000, profitMargin: 22.0, marketShare: 15 }
  ],

  // Categories
  categories: [
    { id: 'wood', name: 'ไม้ฝา ไม้พื้น & ไม้สังเคราะห์', icon: '🪵' },
    { id: 'board', name: 'แผ่นยิปซั่ม & สมาร์ทบอร์ด', icon: '🧱' },
    { id: 'fence', name: 'เสารั้ว & ลวดหนาม', icon: '⛓️' },
    { id: 'cement', name: 'ปูนซีเมนต์ & คอนกรีต', icon: '🏗️' },
    { id: 'steel', name: 'เหล็กรูปพรรณ & เหล็กเส้น', icon: '⚙️' },
    { id: 'tile', name: 'กระเบื้องปูพื้น & ผนัง', icon: '🔳' },
    { id: 'roof', name: 'กระเบื้องหลังคา & อุปกรณ์', icon: '🏠' },
    { id: 'paint', name: 'สี & เคมีภัณฑ์', icon: '🎨' }
  ],

  // Products Master catalog (SKU)
  products: [
    {
      sku: 'WOD-001',
      name: 'ไม้ฝาเฌอร่า/SCG ลายชัยพฤกษ์ 15x300 ซม.',
      category: 'wood',
      brand: 'NAMPHET',
      price: 95,
      unit: 'แผ่น',
      stock: 1200,
      minStock: 200,
      weightKg: 4.5,
      binLocation: 'W-01-01',
      image: '🪵',
      unitsSoldMonth: 4200,
      totalSalesMonth: 399000,
      marginPercent: 28.0,
      description: 'ไม้ฝาสังเคราะห์ คุณภาพสูง ไม่หดตัว ไม่โก่งงอ ปลวกไม่กิน หน้ากว้าง 15 ซม. ยาว 300 ซม.',
      lots: [{ lotNo: 'LOT-20260801-A', costPrice: 68, qty: 1200, receiveDate: '2026-08-01' }]
    },
    {
      sku: 'WOD-002',
      name: 'ไม้พื้นสังเคราะห์ SPC/SCG 20x300 ซม.',
      category: 'wood',
      brand: 'NAMPHET',
      price: 240,
      unit: 'แผ่น',
      stock: 800,
      minStock: 150,
      weightKg: 8.0,
      binLocation: 'W-02-05',
      image: '🪵',
      unitsSoldMonth: 1500,
      totalSalesMonth: 360000,
      marginPercent: 26.5,
      description: 'ไม้พื้นสังเคราะห์หน้ากว้าง 20 ซม. ยาว 300 ซม. ทนแดด ทนฝน รองรับน้ำหนักสูง',
      lots: [{ lotNo: 'LOT-20260720-B', costPrice: 175, qty: 800, receiveDate: '2026-07-20' }]
    },
    {
      sku: 'BRD-001',
      name: 'แผ่นยิปซั่ม ตราช้าง ขอบเรียบ 120x240 ซม. หนา 9 มม.',
      category: 'board',
      brand: 'GYPROC',
      price: 165,
      unit: 'แผ่น',
      stock: 950,
      minStock: 200,
      weightKg: 14.0,
      binLocation: 'G-01-02',
      image: '🧱',
      unitsSoldMonth: 3100,
      totalSalesMonth: 511500,
      marginPercent: 22.0,
      description: 'แผ่นยิปซั่มสำหรับฝ้าเพดานและผนังเบา ผิวเรียบเนียน ติดตั้งง่าย ขนาด 120x240 ซม.',
      lots: [{ lotNo: 'LOT-20260805-A', costPrice: 125, qty: 950, receiveDate: '2026-08-05' }]
    },
    {
      sku: 'BRD-002',
      name: 'แผ่นสมาร์ทบอร์ด SCG ขอบเรียบ 120x240 ซม. หนา 6 มม.',
      category: 'board',
      brand: 'SCG',
      price: 210,
      unit: 'แผ่น',
      stock: 650,
      minStock: 100,
      weightKg: 25.0,
      binLocation: 'G-02-04',
      image: '🏗️',
      unitsSoldMonth: 1900,
      totalSalesMonth: 399000,
      marginPercent: 21.0,
      description: 'แผ่นไฟเบอร์ซีเมนต์บอร์ด แข็งแกร่ง ทนน้ำ ทนความชื้น ขนาด 120x240 ซม.',
      lots: [{ lotNo: 'LOT-20260715-A', costPrice: 160, qty: 650, receiveDate: '2026-07-15' }]
    },
    {
      sku: 'FNC-001',
      name: 'เสารั้วคอนกรีตอัดแรง 3x3 นิ้ว ยาว 2.0 เมตร (เจาะรู)',
      category: 'fence',
      brand: 'NAMPHET',
      price: 120,
      unit: 'ต้น',
      stock: 500,
      minStock: 100,
      weightKg: 22.0,
      binLocation: 'F-01-01',
      image: '🏛️',
      unitsSoldMonth: 1200,
      totalSalesMonth: 144000,
      marginPercent: 30.0,
      description: 'เสารั้วคอนกรีตอัดแรง เจาะรูสำหรับขึงลวดหนาม แข็งแรงทนทาน ทนแดดทนฝน',
      lots: [{ lotNo: 'LOT-20260802-A', costPrice: 82, qty: 500, receiveDate: '2026-08-02' }]
    },
    {
      sku: 'FNC-002',
      name: 'ลวดหนามชุบกัลวาไนซ์ตราน้ำเพชร #14 (ยาว 100 เมตร/ม้วน)',
      category: 'fence',
      brand: 'NAMPHET',
      price: 650,
      unit: 'ม้วน',
      stock: 250,
      minStock: 50,
      weightKg: 10.0,
      binLocation: 'F-02-03',
      image: '⛓️',
      unitsSoldMonth: 480,
      totalSalesMonth: 312000,
      marginPercent: 28.5,
      description: 'ลวดหนามชุบกัลวาไนซ์อย่างหนา กันสนิม หนามแหลมคม ยาวเต็ม 100 เมตร',
      lots: [{ lotNo: 'LOT-20260728-A', costPrice: 460, qty: 250, receiveDate: '2026-07-28' }]
    },
    {
      sku: 'TIL-001',
      name: 'กระเบื้องปูพื้นแกรนิตโต้ SCG 60x60 ซม. (กล่องละ 4 แผ่น/1.44 ตร.ม.)',
      category: 'tile',
      brand: 'SCG',
      price: 320,
      unit: 'กล่อง',
      stock: 400,
      minStock: 80,
      weightKg: 30.0,
      binLocation: 'T-01-02',
      image: '🔳',
      unitsSoldMonth: 1100,
      totalSalesMonth: 352000,
      marginPercent: 24.0,
      description: 'กระเบื้องปูพื้นแกรนิตโต้ นาโน ป้องกันคราบ ทำความสะอาดง่าย ขนาด 60x60 ซม.',
      lots: [{ lotNo: 'LOT-20260803-A', costPrice: 240, qty: 400, receiveDate: '2026-08-03' }]
    },
    {
      sku: 'CEM-001',
      name: 'ปูนซีเมนต์ผสม SCG ซูเปอร์เสือ 50 กก.',
      category: 'cement',
      brand: 'SCG',
      price: 145,
      unit: 'ถุง',
      stock: 450,
      minStock: 100,
      weightKg: 50.0,
      binLocation: 'A-01-12',
      image: '🧱',
      unitsSoldMonth: 3200,
      totalSalesMonth: 464000,
      marginPercent: 24.1,
      description: 'ปูนซีเมนต์ผสมสูตรพิเศษ สำหรับงานก่อ ฉาบ เท เหนียวลื่น ฉาบง่าย',
      lots: [{ lotNo: 'LOT-20260715-A', costPrice: 110, qty: 450, receiveDate: '2026-07-15' }]
    }
  ],

  // Fleet & Logistics Trucks (0 - 10 Assistants/Helpers)
  trucks: [
    {
      id: 'TRK-01',
      plate: '70-1234 กทม.',
      type: 'รถกระบะตู้ข้าง (1.5 ตัน)',
      driver: 'นายสมนึก ขยันขับ',
      helpers: ['นายสมชาย ดีงาม', 'นายสมศักดิ์ ขยันงาน'],
      status: 'Available',
      currentLocation: 'คลังสินค้าหลัก (สำนักงานใหญ่)'
    },
    {
      id: 'TRK-02',
      plate: '82-5678 เพชรบุรี',
      type: 'รถ 6 ล้อคันใหญ่ (8 ตัน)',
      driver: 'นายวิเชียร ทางไกล',
      helpers: ['นายวิชัย ใจดี', 'นายประเสริฐ ชำนาญ', 'นายสุรชัย แข็งแรง', 'นายสายชล ช่วยยก', 'นายเดชา ปลอดภัย'],
      status: 'En Route',
      currentLocation: 'มุ่งหน้าไซต์งาน อ.เขาย้อย'
    }
  ],

  // AR Accounts Receivable & Bills
  arBills: [
    {
      billNo: 'INV-2026-0801',
      customerName: 'หจก. เขาย้อยการช่าง & รับเหมา',
      contactTel: '081-234-5678',
      totalAmount: 185000,
      paidAmount: 50000,
      depositAmount: 50000,
      remainingAmount: 135000,
      dueDate: '2026-08-19',
      dueDateFormatted: '19 ส.ค. 2026',
      status: 'DUE_SOON',
      alertText: '⚠️ แจ้งเตือน: เหลือเวลาอีก 1 วัน จะถึงกำหนดชำระเงิน'
    },
    {
      billNo: 'INV-2026-0805',
      customerName: 'คุณอนันต์ (โครงการบ้านสวนเพชรบุรี)',
      contactTel: '089-987-6543',
      totalAmount: 320000,
      paidAmount: 100000,
      depositAmount: 100000,
      remainingAmount: 220000,
      dueDate: '2026-08-18',
      dueDateFormatted: '18 ส.ค. 2026',
      status: 'DUE_TODAY',
      alertText: '🔔 แจ้งเตือนด่วน: กำหนดชำระเงินวันนี้ เวลา 08:00 น.'
    }
  ],

  // Stock Movement Log
  stockLogs: [
    {
      id: 'LOG-101',
      timestamp: '2026-08-18 14:30',
      sku: 'WOD-001',
      productName: 'ไม้ฝาเฌอร่า/SCG 15x300 ซม.',
      type: 'IN_MANUAL',
      qty: +100,
      balanceAfter: 1200,
      actor: 'CS-001 (สมชาย - Cashier POS-01)',
      note: 'คีย์รับสินค้าเข้าสต๊อกจากการสแกน Barcode หน้าร้าน'
    }
  ],

  // Purchase Orders
  purchaseOrders: [
    {
      poNo: 'PO-2026-0801',
      supplier: 'บริษัท เอสซีจี ซิเมนต์-ผลิตภัณฑ์ก่อสร้าง จำกัด',
      date: '2026-08-10',
      totalItems: 2,
      totalAmount: 245000,
      status: 'Approved',
      deliveryDate: '2026-08-22',
      paymentMethod: 'ตีเช็คสั่งจ่าย',
      paymentDetails: 'เช็คเลขที่ CHQ-887799 ลงวันที่ 2026-08-30 (ธ.กสิกรไทย)'
    }
  ],

  // Customers
  customers: [
    {
      id: 'CUST-001',
      name: 'ช่างสมพงษ์ ไม้สวย (ผู้รับเหมาเพชรบุรี)',
      phone: '081-444-5555',
      tier: 'VIP Pro Contractor',
      points: 14500,
      totalSpend: 1250000,
      discountPercent: 5
    }
  ]
};

window.AppStore = {
  data: INITIAL_DATA,
  init() {
    const saved = localStorage.getItem('ONE_STOP_CONSTRUCTION_DB');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored DB, resetting.', e);
      }
    }
  },
  save() {
    localStorage.setItem('ONE_STOP_CONSTRUCTION_DB', JSON.stringify(this.data));
  },
  reset() {
    this.data = INITIAL_DATA;
    localStorage.removeItem('ONE_STOP_CONSTRUCTION_DB');
    window.location.reload();
  }
};

window.AppStore.init();
