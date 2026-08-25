// ==========================================
// Master Data & User Account Database
// บริษัท น้ำเพชรค้าไม้ จำกัด (One Stop Service Platform)
// Initial Production Blank Slate State (ค่าตั้งต้นสำหรับใช้งานจริง)
// ==========================================

window.InitialAppData = {
  // 1. Company Profile
  companyInfo: {
    name: "บริษัท น้ำเพชรค้าไม้ จำกัด",
    address: "8 หมู่ที่ 1 ตำบลหนองปรง อำเภอเขาย้อย จ.เพชรบุรี 76140",
    taxId: "0765565001234",
    phones: "080-995-7811, 086-339-1833, 081-526-2975",
    branch: "สำนักงานใหญ่ (00000)"
  },

  // 2. User Accounts System (ระบบบัญชีผู้ใช้งานแยกตามสิทธิ์)
  users: [
    { username: 'admin', password: '123', name: 'นายสมศักดิ์ (หัวหน้างาน / ผู้จัดการ)', role: 'supervisor', avatar: '👨‍💼' },
    { username: 'cashier1', password: '123', name: 'นายสมชาย (พนักงานขาย / POS 1)', role: 'cashier', avatar: '🧑‍💻' },
    { username: 'cashier2', password: '123', name: 'นางสาววิภาดา (พนักงานขาย / POS 2)', role: 'cashier', avatar: '👩‍💻' }
  ],
  currentUser: {
    username: 'admin',
    name: 'นายสมศักดิ์ (หัวหน้างาน / ผู้จัดการ)',
    role: 'supervisor',
    avatar: '👨‍💼',
    isLoggedIn: true
  },

  // 3. Product Categories List
  categories: [
    { id: 'all', name: 'ทั้งหมด (All Categories)', icon: '📦' },
    { id: 'wood', name: 'ไม้ฝา & ไม้พื้น', icon: '🪵' },
    { id: 'board', name: 'แผ่นยิปซั่ม & สมาร์ทบอร์ด', icon: '🧱' },
    { id: 'cement', name: 'ปูนซีเมนต์ & โครงสร้าง', icon: '🏗️' },
    { id: 'steel', name: 'เหล็ก & ลวดหนาม', icon: '⛓️' },
    { id: 'brick', name: 'อิฐมวลเบา & อิฐมอญ', icon: '🧱' },
    { id: 'roof', name: 'หลังคา & ครอบหลังคา', icon: '🏠' },
    { id: 'tile', name: 'กระเบื้องปูพื้น & ผนัง', icon: '🔲' },
    { id: 'pipe', name: 'งานประปา & ท่อ PVC', icon: '🚰' },
    { id: 'electric', name: 'งานไฟฟ้า & อุปกรณ์', icon: '⚡' }
  ],

  // 4. Products Master Database (Default Clean Empty Array for Production Launch)
  products: [],

  // 5. Cashiers List
  cashiers: [
    { id: "CS-001", name: "สมชาย สายเปย์", terminal: "POS-01 (เคาน์เตอร์ 1)", totalToday: 0 },
    { id: "CS-002", name: "วิภาดา ขยันขาย", terminal: "POS-02 (เคาน์เตอร์ 2)", totalToday: 0 },
    { id: "SUP-001", name: "สมศักดิ์ ผู้จัดการ", terminal: "POS-00 (ADMIN)", totalToday: 0 }
  ],

  // 6. Bank Accounts
  storeBankAccounts: [
    { id: 'KBANK', bankName: 'ธนาคารกสิกรไทย (K-Bank)', accountNo: '076-2-99881-1', accountName: 'บจก. น้ำเพชรค้าไม้' },
    { id: 'SCB', bankName: 'ธนาคารไทยพาณิชย์ (SCB)', accountNo: '408-5-12345-6', accountName: 'บจก. น้ำเพชรค้าไม้' },
    { id: 'BBL', bankName: 'ธนาคารกรุงเทพ (BBL)', accountNo: '123-4-56789-0', accountName: 'บจก. น้ำเพชรค้าไม้' }
  ],

  // 7. Stock Audit Logs
  stockLogs: [],

  // 8. Trucks Fleet
  trucks: [
    { id: "TRK-01", plate: "82-1234 เพชรบุรี", type: "รถ 6 ล้อขนส่งไม้ (8 ตัน)", driver: "นายสมศักดิ์ ขยันขับ", helpers: ["นายสมชาย ดีงาม", "นายสมศักดิ์ ขยันงาน"], status: "Available", currentLocation: "คลังสินค้า อ.เขาย้อย" },
    { id: "TRK-02", plate: "82-5678 เพชรบุรี", type: "รถ 10 ล้อ พร้อมเครนยก (15 ตัน)", driver: "นายวิชัย ใจดี", helpers: ["นายสุรชัย แข็งแรง", "นายสายชล ช่วยยก", "นายเดชา ปลอดภัย"], status: "Available", currentLocation: "คลังสินค้า อ.เขาย้อย" }
  ],

  // 9. Purchase Orders
  purchaseOrders: [],

  // 10. AR Bills
  arBills: []
};
