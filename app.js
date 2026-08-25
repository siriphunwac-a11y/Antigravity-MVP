// ==========================================
// Main Application Engine & Auth Manager
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.AppStore = {
  key: 'namphet_construction_store_v2',
  data: null,

  init() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage', e);
        this.data = window.InitialAppData;
      }
    } else {
      this.data = window.InitialAppData;
    }
    this.save();
  },

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.data));
  },

  reset() {
    localStorage.removeItem(this.key);
    this.data = window.InitialAppData;
    this.save();
    window.location.reload();
  }
};

window.AppEngine = {
  currentModule: 'dashboard',

  init() {
    window.AppStore.init();
    this.checkAuthStatus();
    this.bindEvents();
  },

  // User Auth Status & Account Guard
  checkAuthStatus() {
    const user = window.AppStore.data.currentUser;
    const roleDisplay = document.getElementById('user-role-display');

    if (!user || !user.isLoggedIn) {
      this.showLoginModal();
      return;
    }

    if (roleDisplay) {
      const isSuper = user.role === 'supervisor';
      roleDisplay.className = `role-badge ${isSuper ? 'supervisor' : 'cashier'}`;
      roleDisplay.innerHTML = `
        ${user.avatar || '👤'} <strong>${user.name}</strong> 
        <span class="badge ${isSuper ? 'badge-success' : 'badge-warning'}" style="margin-left: 6px;">${isSuper ? 'หัวหน้างาน (Supervisor)' : 'แคชเชียร์ (Cashier)'}</span>
        <button class="btn btn-sm btn-secondary" style="margin-left: 10px; padding: 2px 8px; font-size: 0.75rem;" onclick="AppEngine.logout()">🚪 ออกจากระบบ</button>
      `;
    }

    this.loadModule(this.currentModule);
  },

  showLoginModal() {
    const users = window.AppStore.data.users || [];
    const html = `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 3rem; margin-bottom: 10px;">🪵</div>
        <h3 style="color: var(--accent-cyan-light); font-weight: 700; margin-bottom: 5px;">บริษัท น้ำเพชรค้าไม้ จำกัด</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
          กรุณาเข้าสู่ระบบเลือกบัญชีผู้ใช้งานตามตำแหน่งสิทธิ์หน้าที่
        </p>

        <!-- Quick 1-Click Select Account -->
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
          <label class="form-label" style="color: #67e8f9; font-weight: 700;">👤 เลือกบัญชีผู้ใช้งานที่ต้องการเข้าสู่ระบบ:</label>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
            ${users.map(u => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 10px 15px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick="AppEngine.loginAs('${u.username}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.5rem;">${u.avatar}</span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem;">${u.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">Username: <strong>${u.username}</strong> | สิทธิ์: <span class="badge ${u.role === 'supervisor' ? 'badge-success' : 'badge-warning'}">${u.role === 'supervisor' ? 'หัวหน้างาน / Admin (สิทธิ์สูงสุด)' : 'พนักงานขาย / Cashier'}</span></div>
                  </div>
                </div>
                <button class="btn btn-sm btn-primary">เข้าสู่ระบบ ➔</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Username/Password Login Form -->
        <div style="text-align: left; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
          <div class="form-group mb-2">
            <label class="form-label">ชื่อผู้ใช้ (Username):</label>
            <input type="text" id="login-username-input" class="form-control" placeholder="ระบุ username (เช่น admin หรือ cashier1)">
          </div>
          <div class="form-group mb-3">
            <label class="form-label">รหัสผ่าน (Password):</label>
            <input type="password" id="login-password-input" class="form-control" placeholder="ระบุรหัสผ่าน (เช่น 123)">
          </div>
          <button class="btn btn-primary" style="width: 100%;" onclick="AppEngine.submitLogin()">🔑 ล็อกอินเข้าสู่ระบบ</button>
        </div>
      </div>
    `;

    this.openModal('🔑 เข้าสู่ระบบ - บริษัท น้ำเพชรค้าไม้ จำกัด', html, '');
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.style.display = 'none';
  },

  loginAs(username) {
    const u = window.AppStore.data.users.find(x => x.username === username);
    if (!u) return;

    window.AppStore.data.currentUser = {
      username: u.username,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      isLoggedIn: true
    };

    window.AppStore.save();
    this.closeModal();
    this.showToast(`ยินดีต้อนรับ ${u.name} เข้าสู่ระบบ!`, 'success');
    this.checkAuthStatus();
  },

  submitLogin() {
    const userIn = document.getElementById('login-username-input')?.value;
    const passIn = document.getElementById('login-password-input')?.value;

    const u = window.AppStore.data.users.find(x => x.username === userIn && x.password === passIn);
    if (u) {
      this.loginAs(u.username);
    } else {
      this.showToast('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง! (ทดลองใช้ admin/123 หรือ cashier1/123)', 'danger');
    }
  },

  logout() {
    window.AppStore.data.currentUser = { isLoggedIn: false };
    window.AppStore.save();
    this.showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
    this.checkAuthStatus();
  },

  bindEvents() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const modName = item.getAttribute('data-module');
        if (modName) {
          document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          this.loadModule(modName);
        }
      });
    });
  },

  loadModule(name) {
    this.currentModule = name;
    const container = document.getElementById('module-content-container');
    const titleEl = document.getElementById('page-module-title');

    const titles = {
      dashboard: '📊 Dashboard ผู้บริหาร & KPI - บริษัท น้ำเพชรค้าไม้ จำกัด',
      one_stop_scenario: '🌟 จำลองสถานการณ์ One Stop Service (สร้างบ้าน 1 หลัง)',
      boq_calculator: '🧮 คำนวณ Auto-BOQ ไม้ฝา ไม้พื้น ยิปซั่ม & รั้วลวดหนาม',
      sales_pos: '🛒 ระบบขายหน้าร้าน & POS (ออกบิล 6 รูปแบบ)',
      ecommerce: '🌐 E-Commerce & ระบบแชทสั่งวัสดุออนไลน์',
      product: '📦 คลังข้อมูลสินค้า & จัดการ SKU Master',
      warehouse: '🏭 คลังสินค้า & สต๊อก Lot ต้นทุน',
      procurement: '📝 ระบบจัดซื้อ & ใบสั่งซื้อ PO',
      logistics: '🚚 จัดคิวรถจัดส่ง (ผู้ติดตาม 0-10 คน) & Photo POD',
      crm: '👑 CRM ระบบสมาชิก & ยอดซื้อสะสม',
      accounting: '💰 ระบบการเงิน บัญชี & แจ้งเตือนลูกหนี้ AR'
    };

    if (titleEl && titles[name]) {
      titleEl.innerText = titles[name];
    }

    if (window.Modules && window.Modules[name]) {
      container.innerHTML = window.Modules[name]();
      if (window.Modules[`${name}_bind`]) {
        window.Modules[`${name}_bind`]();
      }
    } else {
      container.innerHTML = `<div class="card"><p>ไม่พบโมดูล ${name}</p></div>`;
    }
  },

  openModal(title, bodyHtml, footerHtml) {
    const modal = document.getElementById('global-modal');
    const titleEl = document.getElementById('modal-title-text');
    const bodyEl = document.getElementById('modal-body-container');
    const footerEl = document.getElementById('modal-footer-container');

    titleEl.innerText = title;
    bodyEl.innerHTML = bodyHtml;
    footerEl.innerHTML = footerHtml || '<button class="btn btn-secondary" onclick="AppEngine.closeModal()">ปิด</button>';

    modal.classList.add('active');
  },

  closeModal() {
    const modal = document.getElementById('global-modal');
    modal.classList.remove('active');
  },

  showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `badge badge-${type}`;
    toast.style.cssText = 'padding: 12px 18px; margin-top: 10px; font-size: 0.9rem; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: block; border-radius: 8px; color: #fff; background: ' + (type === 'success' ? '#10b981' : type === 'danger' ? '#f43f5e' : type === 'warning' ? '#f59e0b' : '#06b6d4');
    toast.innerText = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  },

  formatCurrency(num) {
    return (num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  formatNumber(num) {
    return (num || 0).toLocaleString('th-TH');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AppEngine.init();
});
