// ==========================================
// Master Data & User Account Database
// บริษัท น้ำเพชรค้าไม้ จำกัด (One Stop Service Platform)
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

  // 4. Products Master Database (SKU Master)
  products: [
    {
      sku: "WOD-001",
      name: "ไม้ฝาเฌอร่า/SCG ลายชัยพฤกษ์ 15x300 ซม.",
      category: "wood",
      brand: "เฌอร่า/SCG",
      price: 95,
      unit: "แผ่น",
      stock: 1200,
      minStock: 200,
      weightKg: 4.5,
      binLocation: "W-01-01",
      image: "🪵",
      unitsSoldMonth: 4200,
      totalSalesMonth: 399000,
      marginPercent: 28.0,
      description: "ไม้ฝาสังเคราะห์ คุณภาพสูง ไม่หดตัว ไม่โก่งงอ ปลวกไม่กิน หน้ากว้าง 15 ซม. ยาว 300 ซม.",
      lots: [
        { lotNo: "LOT-20260801-01", costPrice: 68, qty: 800, receiveDate: "2026-08-01" },
        { lotNo: "LOT-20260810-02", costPrice: 70, qty: 400, receiveDate: "2026-08-10" }
      ]
    },
    {
      sku: "WOD-002",
      name: "ไม้พื้นสังเคราะห์ SPC/SCG 20x300 ซม.",
      category: "wood",
      brand: "SCG",
      price: 240,
      unit: "แผ่น",
      stock: 800,
      minStock: 150,
      weightKg: 8.0,
      binLocation: "W-02-05",
      image: "🪵",
      unitsSoldMonth: 1500,
      totalSalesMonth: 360000,
      marginPercent: 26.5,
      description: "ไม้พื้นสังเคราะห์หน้ากว้าง 20 ซม. ยาว 300 ซม. ทนแดด ทนฝน ไม่เปื่อยพอง",
      lots: [
        { lotNo: "LOT-20260805-01", costPrice: 175, qty: 800, receiveDate: "2026-08-05" }
      ]
    },
    {
      sku: "BRD-001",
      name: "แผ่นยิปซั่ม ตราช้าง ขอบเรียบ 120x240 ซม. หนา 9 มม.",
      category: "board",
      brand: "ตราช้าง",
      price: 165,
      unit: "แผ่น",
      stock: 950,
      minStock: 200,
      weightKg: 14.0,
      binLocation: "G-01-02",
      image: "🧱",
      unitsSoldMonth: 3100,
      totalSalesMonth: 511500,
      marginPercent: 22.0,
      description: "แผ่นยิปซั่มสำหรับฝ้าเพดานและผนังเบา ผิวเรียบเนียน ติดตั้งง่าย",
      lots: [
        { lotNo: "LOT-20260802-01", costPrice: 128, qty: 950, receiveDate: "2026-08-02" }
      ]
    },
    {
      sku: "BRD-002",
      name: "แผ่นสมาร์ทบอร์ด SCG ขอบเรียบ 120x240 ซม. หนา 6 มม.",
      category: "board",
      brand: "SCG",
      price: 210,
      unit: "แผ่น",
      stock: 650,
      minStock: 100,
      weightKg: 25.0,
      binLocation: "G-02-04",
      image: "🏗️",
      unitsSoldMonth: 1900,
      totalSalesMonth: 399000,
      marginPercent: 21.0,
      description: "แผ่นไฟเบอร์ซีเมนต์บอร์ด แข็งแกร่ง ทนน้ำ ทนความชื้น เหมาะกับงานผนังภายนอกและภายใน",
      lots: [
        { lotNo: "LOT-20260803-01", costPrice: 165, qty: 650, receiveDate: "2026-08-03" }
      ]
    },
    {
      sku: "CEM-001",
      name: "ปูนซีเมนต์ผสม SCG ซูเปอร์เสือ 50 กก.",
      category: "cement",
      brand: "SCG",
      price: 145,
      unit: "ถุง",
      stock: 1050,
      minStock: 300,
      weightKg: 50.0,
      binLocation: "C-01-01",
      image: "🧱",
      unitsSoldMonth: 8500,
      totalSalesMonth: 1232500,
      marginPercent: 20.0,
      description: "ปูนซีเมนต์ตราเสือสำหรับงานก่อ ฉาบ เท ปูนเหนียว ก่อง่าย งานเสร็จไว",
      lots: [
        { lotNo: "LOT-20260804-01", costPrice: 115, qty: 1050, receiveDate: "2026-08-04" }
      ]
    },
    {
      sku: "FNC-001",
      name: "เสารั้วคอนกรีตอัดแรง 3x3 นิ้ว ยาว 2.0 เมตร (เจาะรู)",
      category: "steel",
      brand: "น้ำเพชร",
      price: 120,
      unit: "ต้น",
      stock: 500,
      minStock: 100,
      weightKg: 22.0,
      binLocation: "F-01-01",
      image: "🏛️",
      unitsSoldMonth: 1200,
      totalSalesMonth: 144000,
      marginPercent: 30.0,
      description: "เสารั้วคอนกรีตอัดแรง เจาะรูสำหรับขึงลวดหนาม แข็งแรงทนทาน",
      lots: [
        { lotNo: "LOT-20260808-01", costPrice: 84, qty: 500, receiveDate: "2026-08-08" }
      ]
    },
    {
      sku: "FNC-002",
      name: "ลวดหนามชุบกัลวาไนซ์ตราน้ำเพชร #14 (ยาว 100 เมตร/ม้วน)",
      category: "steel",
      brand: "น้ำเพชร",
      price: 650,
      unit: "ม้วน",
      stock: 250,
      minStock: 50,
      weightKg: 10.0,
      binLocation: "F-02-03",
      image: "⛓️",
      unitsSoldMonth: 480,
      totalSalesMonth: 312000,
      marginPercent: 28.5,
      description: "ลวดหนามชุบกัลวาไนซ์อย่างหนา กันสนิม หนามแหลมคม ยาวเต็ม 100 เมตร",
      lots: [
        { lotNo: "LOT-20260809-01", costPrice: 465, qty: 250, receiveDate: "2026-08-09" }
      ]
    },
    {
      sku: "TIL-001",
      name: "กระเบื้องปูพื้น แกรนิตโต้ SCG 60x60 ซม. (กล่องละ 4 แผ่น/1.44 ตร.ม.)",
      category: "tile",
      brand: "SCG",
      price: 320,
      unit: "กล่อง",
      stock: 400,
      minStock: 80,
      weightKg: 28.0,
      binLocation: "T-01-02",
      image: "🔲",
      unitsSoldMonth: 890,
      totalSalesMonth: 284800,
      marginPercent: 25.0,
      description: "กระเบื้องแกรนิตโต้ปูพื้นลายนาโน ขัดเงา ทนทาน ไม่เป็นรอยขีดข่วนง่าย",
      lots: [
        { lotNo: "LOT-20260806-01", costPrice: 240, qty: 400, receiveDate: "2026-08-06" }
      ]
    }
  ],

  // 5. Cashiers List
  cashiers: [
    { id: "CS-001", name: "สมชาย สายเปย์", terminal: "POS-01 (เคาน์เตอร์ 1)", totalToday: 145200 },
    { id: "CS-002", name: "วิภาดา ขยันขาย", terminal: "POS-02 (เคาน์เตอร์ 2)", totalToday: 98400 },
    { id: "SUP-001", name: "สมศักดิ์ ผู้จัดการ", terminal: "POS-00 (ADMIN)", totalToday: 210000 }
  ],

  // 6. Bank Accounts
  storeBankAccounts: [
    { id: 'KBANK', bankName: 'ธนาคารกสิกรไทย (K-Bank)', accountNo: '076-2-99881-1', accountName: 'บจก. น้ำเพชรค้าไม้' },
    { id: 'SCB', bankName: 'ธนาคารไทยพาณิชย์ (SCB)', accountNo: '408-5-12345-6', accountName: 'บจก. น้ำเพชรค้าไม้' },
    { id: 'BBL', bankName: 'ธนาคารกรุงเทพ (BBL)', accountNo: '123-4-56789-0', accountName: 'บจก. น้ำเพชรค้าไม้' }
  ],

  // 7. Stock Audit Logs
  stockLogs: [
    {
      id: "LOG-101",
      timestamp: "18/8/2569 14:20:00",
      sku: "WOD-001",
      productName: "ไม้ฝาเฌอร่า/SCG 15x300 ซม.",
      type: "OUT_SALE",
      qty: -50,
      balanceAfter: 1200,
      actor: "CS-001 (POS)",
      note: "ขายหน้าร้าน (ใบเสนอราคา QO-2026-0801)"
    },
    {
      id: "LOG-102",
      timestamp: "18/8/2569 11:15:00",
      sku: "CEM-001",
      productName: "ปูนซีเมนต์ผสม SCG ซูเปอร์เสือ 50 กก.",
      type: "IN_MANUAL",
      qty: +500,
      balanceAfter: 1050,
      actor: "SUP-001 (Supervisor)",
      note: "คีย์รับปูนเข้าคลังจาก PO-2026-0801"
    }
  ],

  // 8. Trucks Fleet
  trucks: [
    { id: "TRK-01", plate: "82-1234 เพชรบุรี", type: "รถ 6 ล้อขนส่งไม้ (8 ตัน)", driver: "นายสมศักดิ์ ขยันขับ", helpers: ["นายสมชาย ดีงาม", "นายสมศักดิ์ ขยันงาน"], status: "Available", currentLocation: "คลังสินค้า อ.เขาย้อย" },
    { id: "TRK-02", plate: "82-5678 เพชรบุรี", type: "รถ 10 ล้อ พร้อมเครนยก (15 ตัน)", driver: "นายวิชัย ใจดี", helpers: ["นายสุรชัย แข็งแรง", "นายสายชล ช่วยยก", "นายเดชา ปลอดภัย"], status: "En Route", currentLocation: "ส่งไม้ฝา อ.เมืองเพชรบุรี" }
  ],

  // 9. Purchase Orders
  purchaseOrders: [
    { poNo: "PO-2026-0801", supplier: "บริษัท เอสซีจี ซิเมนต์-ผลิตภัณฑ์ก่อสร้าง จำกัด", date: "10/08/2569", totalItems: 2, totalAmount: 145000, status: "Approved", deliveryDate: "15/08/2569", paymentMethod: "โอนเงินผ่านธนาคาร" }
  ],

  // 10. AR Bills
  arBills: [
    { billNo: "INV-2026-0805", customerName: "คุณอนันต์ (โครงการบ้านสวนเพชรบุรี)", contactTel: "081-998-7766", totalAmount: 350000, paidAmount: 130000, depositAmount: 20000, remainingAmount: 200000, dueDate: "18/08/2569", status: "DUE_TODAY" }
  ]
};
