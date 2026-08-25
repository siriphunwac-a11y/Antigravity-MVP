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

  // 2. User Accounts System (ระบบบัญชีผู้ใช้งานส่วนบุคคลตามโครงสร้างร้าน)
  users: [
    // Supervisors (5 คน)
    { username: 'SPV-1', password: '8750', name: 'นายสมศักดิ์ (หัวหน้างาน 1 / ผู้จัดการ)', role: 'supervisor', avatar: '👨‍💼' },
    { username: 'SPV-2', password: '6117', name: 'หัวหน้างาน 2', role: 'supervisor', avatar: '👨‍💼' },
    { username: 'SPV-3', password: '5688', name: 'หัวหน้างาน 3', role: 'supervisor', avatar: '👨‍💼' },
    { username: 'SPV-4', password: '2975', name: 'หัวหน้างาน 4', role: 'supervisor', avatar: '👨‍💼' },
    { username: 'SPV-5', password: '9597', name: 'หัวหน้างาน 5', role: 'supervisor', avatar: '👨‍💼' },

    // Cashiers (4 คน)
    { username: 'CSR-1', password: '7857', name: 'นายสมชาย (พนักงานขาย 1 / POS 1)', role: 'cashier', avatar: '🧑‍💻' },
    { username: 'CSR-2', password: '4935', name: 'พนักงานขาย 2 (POS 2)', role: 'cashier', avatar: '🧑‍💻' },
    { username: 'CSR-3', password: '1639', name: 'พนักงานขาย 3 (POS 3)', role: 'cashier', avatar: '👩‍💻' },
    { username: 'CSR-4', password: '8263', name: 'พนักงานขาย 4 (POS 4)', role: 'cashier', avatar: '👩‍💻' }
  ],
  currentUser: null,

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

  // 4. Products Master Database (Default Clean Empty Array)
  products: [],

  // 5. Cashiers List (เฉพาะ 4 Cashiers: CSR-1, CSR-2, CSR-3, CSR-4)
  cashiers: [
    { id: "CSR-1", name: "นายสมชาย (พนักงานขาย 1)", terminal: "POS-01 (เคาน์เตอร์ 1)", totalToday: 0 },
    { id: "CSR-2", name: "พนักงานขาย 2", terminal: "POS-02 (เคาน์เตอร์ 2)", totalToday: 0 },
    { id: "CSR-3", name: "พนักงานขาย 3", terminal: "POS-03 (เคาน์เตอร์ 3)", totalToday: 0 },
    { id: "CSR-4", name: "พนักงานขาย 4", terminal: "POS-04 (เคาน์เตอร์ 4)", totalToday: 0 }
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
  trucks: [],

  // 9. Purchase Orders
  purchaseOrders: [],

  // 10. AR Bills
  arBills: []
};
