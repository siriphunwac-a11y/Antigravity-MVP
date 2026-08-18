// ==========================================
// One Stop Construction Material - Main App Engine
// ==========================================

window.AppEngine = {
  currentModule: 'dashboard',
  cart: [],

  init() {
    this.bindEvents();
    this.renderHeaderInfo();
    this.checkARPaymentAlerts();
    this.loadModule(this.currentModule);
  },

  bindEvents() {
    // Navigation click handler
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const module = item.dataset.module;
        if (module) {
          this.loadModule(module);
        }
      });
    });

    // Mobile Sidebar toggle
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
      });
    }

    // Role switcher button
    const roleBtn = document.getElementById('role-switcher-btn');
    if (roleBtn) {
      roleBtn.addEventListener('click', () => {
        this.toggleUserRole();
      });
    }
  },

  // Switch Role between Supervisor & Cashier
  toggleUserRole() {
    const user = window.AppStore.data.currentUser;
    if (user.role === 'supervisor') {
      user.role = 'cashier';
      user.name = 'คุณสมชาย (พนักงาน POS / Cashier)';
      user.id = 'CS-001';
      user.avatar = '🧑‍💻';
      this.showToast('สลับบทบาทเป็น พนักงานหน้าร้าน (Cashier)', 'warning');
    } else {
      user.role = 'supervisor';
      user.name = 'คุณสมศักดิ์ (หัวหน้างาน / Supervisor)';
      user.id = 'SUP-001';
      user.avatar = '👨‍💼';
      this.showToast('สลับบทบาทเป็น หัวหน้างาน (Supervisor)', 'success');
    }
    window.AppStore.save();
    this.renderHeaderInfo();
    // Reload active module to reflect permission change
    this.loadModule(this.currentModule);
  },

  renderHeaderInfo() {
    const user = window.AppStore.data.currentUser;
    const badgeEl = document.getElementById('user-role-display');
    if (badgeEl) {
      badgeEl.className = `role-badge ${user.role}`;
      badgeEl.innerHTML = `${user.avatar} ${user.name}`;
    }
  },

  // Check Payment Due Alerts (AR Payment Reminders)
  checkARPaymentAlerts() {
    const bills = window.AppStore.data.arBills || [];
    const dueToday = bills.filter(b => b.status === 'DUE_TODAY');
    const dueSoon = bills.filter(b => b.status === 'DUE_SOON');

    const alertBanner = document.getElementById('payment-alert-banner');
    if (!alertBanner) return;

    if (dueToday.length > 0 || dueSoon.length > 0) {
      let html = '';
      if (dueToday.length > 0) {
        html += `<div class="payment-alert due-today" style="background: rgba(244, 63, 94, 0.2); border: 1px solid #f43f5e; color: #fecdd3; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between;">
          <div><strong>🔔 แจ้งเตือนเงินลูกหนี้ครบกำหนดชำระวันนี้ (เวลา 08:00 น.):</strong> ${dueToday.map(b => `${b.customerName} (บิล ${b.billNo}) ยอดคงเหลือ ${this.formatCurrency(b.remainingAmount)} บาท`).join(' | ')}</div>
          <button class="btn btn-sm btn-danger" onclick="AppEngine.loadModule('accounting')">ดูรายละเอียดการเงิน</button>
        </div>`;
      }
      if (dueSoon.length > 0) {
        html += `<div class="payment-alert due-soon" style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #fef3c7; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between;">
          <div><strong>⚠️ แจ้งเตือนล่วงหน้า 1 วันก่อนถึงกำหนดชำระ:</strong> ${dueSoon.map(b => `${b.customerName} (บิล ${b.billNo}) ครบกำหนด ${b.dueDateFormatted}`).join(' | ')}</div>
          <button class="btn btn-sm btn-warning" onclick="AppEngine.loadModule('accounting')">ตรวจสอบ</button>
        </div>`;
      }
      alertBanner.innerHTML = html;
    } else {
      alertBanner.innerHTML = '';
    }
  },

  // Load target Module dynamically
  loadModule(moduleName) {
    this.currentModule = moduleName;

    // Update Nav Active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.module === moduleName);
    });

    // Update Title
    const titleEl = document.getElementById('page-module-title');
    const titles = {
      dashboard: '📊 Dashboard ผู้บริหาร & KPI เปรียบเทียบยี่ห้อสินค้า',
      product: '📦 ระบบจัดการสินค้า & Real-time Stock Matrix',
      procurement: '📝 ระบบจัดซื้อ & ใบสั่งซื้อ Supplier (PO)',
      warehouse: '🏭 ระบบสต๊อก & คลังสินค้า (Supervisor Lot Control)',
      sales_pos: '🛒 ระบบขาย & POS หน้าร้าน (เลือก Cashier ID)',
      ecommerce: '🌐 E-Commerce, Mobile App & Chat Commerce (LINE OA)',
      boq_calculator: '🧮 เครื่องคำนวณวัสดุ & Auto-BOQ จากขนาดบ้าน',
      logistics: '🚚 ระบบจัดคิวรถขนส่ง & Photo POD หน้างาน',
      crm: '👑 ระบบ CRM ลูกค้า & Member Tiers',
      accounting: '💰 ระบบการเงิน บัญชี & แจ้งเตือนชำระเงิน AR',
      one_stop_scenario: '🏠 ตัวอย่างกระบวนการจริง (ลูกค้าสร้างบ้าน 1 หลัง)'
    };
    if (titleEl) {
      titleEl.innerText = titles[moduleName] || 'One Stop Service Platform';
    }

    // Call Module Render Function if registered
    const container = document.getElementById('module-content-container');
    if (!container) return;

    if (window.Modules && typeof window.Modules[moduleName] === 'function') {
      container.innerHTML = window.Modules[moduleName]();
      // Execute post render scripts if any
      if (window.Modules[`${moduleName}_bind`]) {
        window.Modules[`${moduleName}_bind`]();
      }
    } else {
      container.innerHTML = `<div class="card"><p>กำลังโหลดโมดูล ${moduleName}...</p></div>`;
    }
  },

  // Global Toast Notifications
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'danger' ? '#f43f5e' : '#06b6d4'};
      color: #fff;
      padding: 12px 18px;
      border-radius: 8px;
      margin-top: 10px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.5);
      font-size: 0.9rem;
      animation: fadeIn 0.3s ease;
    `;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  },

  // Global Modal Dialog Helper
  openModal(title, bodyHtml, footerButtons = '') {
    const modalEl = document.getElementById('global-modal');
    if (!modalEl) return;

    document.getElementById('modal-title-text').innerText = title;
    document.getElementById('modal-body-container').innerHTML = bodyHtml;
    document.getElementById('modal-footer-container').innerHTML = footerButtons;

    modalEl.classList.add('active');
  },

  closeModal() {
    const modalEl = document.getElementById('global-modal');
    if (modalEl) modalEl.classList.remove('active');
  },

  // Currency & Weight formatters
  formatCurrency(num) {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num || 0);
  },

  formatNumber(num) {
    return new Intl.NumberFormat('th-TH').format(num || 0);
  }
};

// Initialize App on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.AppEngine.init();
});
