// ==========================================
// Main Application Engine & Auth Manager
// (บริษัท น้ำเพชรค้าไม้ จำกัด - Strict Auth & Staff User Management)
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

    // Ensure default users list exists
    if (!this.data.users || this.data.users.length === 0) {
      this.data.users = [
        { username: 'admin', password: '123', name: 'นายสมศักดิ์ (หัวหน้างาน / ผู้จัดการ)', role: 'supervisor', avatar: '👨‍💼' },
        { username: 'cashier1', password: '123', name: 'นายสมชาย (พนักงานขาย / POS 1)', role: 'cashier', avatar: '🧑‍💻' },
        { username: 'cashier2', password: '123', name: 'นางสาววิภาดา (พนักงานขาย / POS 2)', role: 'cashier', avatar: '👩‍💻' }
      ];
    }

    this.save();
  },

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.data));
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
    const manageUsersBtn = document.getElementById('btn-manage-users');

    if (!user || !user.isLoggedIn) {
      this.showLoginModal();
      return;
    }

    if (roleDisplay) {
      const isSuper = user.role === 'supervisor';
      roleDisplay.className = `role-badge ${isSuper ? 'supervisor' : 'cashier'}`;
      roleDisplay.innerHTML = `
        ${user.avatar || (isSuper ? '👨‍💼' : '🧑‍💻')} <strong>${user.name}</strong> 
        <span class="badge ${isSuper ? 'badge-success' : 'badge-warning'}" style="margin-left: 6px;">${isSuper ? 'หัวหน้างาน / Admin (สิทธิ์สูงสุด)' : 'พนักงานขาย (Cashier)'}</span>
      `;
    }

    if (manageUsersBtn) {
      manageUsersBtn.style.display = (user.role === 'supervisor') ? 'inline-flex' : 'none';
    }

    this.loadModule(this.currentModule);
  },

  // Strict Login Modal (No Quick Select, Only Username & Password)
  showLoginModal() {
    const html = `
      <div style="text-align: center; padding: 15px;">
        <div style="font-size: 3.2rem; margin-bottom: 8px;">🪵</div>
        <h3 style="color: var(--accent-cyan-light); font-weight: 700; margin-bottom: 4px;">บริษัท น้ำเพชรค้าไม้ จำกัด</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 25px;">
          กรอกชื่อผู้ใช้และรหัสผ่านส่วนบุคคลเพื่อเข้าสู่ระบบ
        </p>

        <!-- Username/Password Strict Login Form -->
        <div style="text-align: left; background: rgba(0,0,0,0.25); padding: 22px; border-radius: 12px; border: 1px solid var(--border-color); max-width: 440px; margin: 0 auto;">
          <div class="form-group mb-3">
            <label class="form-label" style="font-weight: 600;">ชื่อผู้ใช้ (Username): <span style="color: red;">*</span></label>
            <input type="text" id="login-username-input" class="form-control" placeholder="ระบุ username (เช่น admin หรือ cashier1)" onkeyup="if(event.key==='Enter') AppEngine.submitLogin()">
          </div>

          <div class="form-group mb-4">
            <label class="form-label" style="font-weight: 600;">รหัสผ่าน (Password): <span style="color: red;">*</span></label>
            <input type="password" id="login-password-input" class="form-control" placeholder="ระบุรหัสผ่านส่วนตัว" onkeyup="if(event.key==='Enter') AppEngine.submitLogin()">
          </div>

          <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem;" onclick="AppEngine.submitLogin()">🔑 ล็อกอินเข้าสู่ระบบ (Sign In)</button>

          <div style="margin-top: 15px; background: rgba(6, 182, 212, 0.1); border: 1px dashed rgba(6, 182, 212, 0.3); padding: 10px; border-radius: 8px; font-size: 0.78rem; color: var(--text-muted);">
            💡 <strong>สำหรับพนักงาน:</strong> หากยังไม่มีชื่อผู้ใช้และรหัสผ่าน กรุณาแจ้งหัวหน้างาน (Admin) เพื่อทำการสร้างบัญชีให้ท่าน<br>
            👨‍💼 <em>หัวหน้างาน (Admin):</em> admin / 123<br>
            🧑‍💻 <em>พนักงานขาย (Cashier):</em> cashier1 / 123
          </div>
        </div>
      </div>
    `;

    this.openModal('🔑 เข้าสู่ระบบ - บริษัท น้ำเพชรค้าไม้ จำกัด', html, '');
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.style.display = 'none';
  },

  submitLogin() {
    const userIn = document.getElementById('login-username-input')?.value?.trim();
    const passIn = document.getElementById('login-password-input')?.value?.trim();

    if (!userIn || !passIn) {
      this.showToast('กรุณาระบุชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน', 'warning');
      return;
    }

    const u = window.AppStore.data.users.find(x => x.username.toLowerCase() === userIn.toLowerCase() && x.password === passIn);
    if (u) {
      window.AppStore.data.currentUser = {
        username: u.username,
        name: u.name,
        role: u.role,
        avatar: u.avatar || (u.role === 'supervisor' ? '👨‍💼' : '🧑‍💻'),
        isLoggedIn: true
      };

      window.AppStore.save();
      this.closeModal();
      const closeBtn = document.querySelector('.modal-close');
      if (closeBtn) closeBtn.style.display = 'block';

      this.showToast(`ยินดีต้อนรับ ${u.name} เข้าสู่ระบบ!`, 'success');
      this.checkAuthStatus();
    } else {
      this.showToast('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง! กรุณาตรวจสอบอีกครั้ง', 'danger');
    }
  },

  logout() {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      window.AppStore.data.currentUser = { isLoggedIn: false };
      window.AppStore.save();
      this.showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
      this.checkAuthStatus();
    }
  },

  // SUPERVISOR ONLY: Staff User Account Management Modal
  openUserManagementModal() {
    const store = window.AppStore.data;
    const currentUser = store.currentUser;

    if (!currentUser || currentUser.role !== 'supervisor') {
      this.showToast('สิทธิ์ไม่เพียงพอ! เฉพาะหัวหน้างาน (Supervisor) เท่านั้นที่จัดการบัญชีผู้ใช้ได้', 'danger');
      return;
    }

    const users = store.users || [];

    const html = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: #67e8f9; margin-bottom: 2px;">👥 รายชื่อบัญชีผู้ใช้พนักงานในระบบ (${users.length} บัญชี)</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted);">หัวหน้างานสามารถสร้างบัญชีผู้ใช้ใหม่ กำหนดสิทธิ์ และรีเซ็ตรหัสผ่านให้พนักงานได้ที่นี่</p>
          </div>

          <button class="btn btn-success btn-sm" onclick="AppEngine.openSignUpStaffModal()">+ สร้างบัญชีพนักงานใหม่ (Sign Up Staff)</button>
        </div>

        <div class="table-responsive mb-3">
          <table class="custom-table" style="font-size: 0.85rem;">
            <thead>
              <tr>
                <th>รูป</th>
                <th>ชื่อผู้ใช้ (Username)</th>
                <th>ชื่อ-นามสกุล พนักงาน</th>
                <th>สิทธิ์หน้าที่ (Role)</th>
                <th>รหัสผ่าน (Password)</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td style="font-size: 1.5rem; text-align: center;">${u.avatar || '👤'}</td>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${u.username}</td>
                  <td style="font-weight: 600;">${u.name}</td>
                  <td>
                    <span class="badge ${u.role === 'supervisor' ? 'badge-success' : 'badge-warning'}">
                      ${u.role === 'supervisor' ? '👨‍💼 หัวหน้างาน / Admin' : '🧑‍💻 พนักงานขาย / Cashier'}
                    </span>
                  </td>
                  <td><code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; color: #f59e0b;">${u.password}</code></td>
                  <td>
                    <div style="display: flex; gap: 5px;">
                      <button class="btn btn-sm btn-secondary" onclick="AppEngine.openEditStaffPasswordModal('${u.username}')">✏️ แก้รหัส</button>
                      ${u.username !== 'admin' ? `
                        <button class="btn btn-sm btn-danger" onclick="AppEngine.deleteStaffUser('${u.username}')">🗑️</button>
                      ` : '<span style="font-size: 0.72rem; color: var(--text-dim);">หลัก</span>'}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.openModal('👥 จัดการบัญชีผู้ใช้พนักงาน (Staff User Accounts)', html, `
      <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ปิดหน้าต่าง</button>
    `);
  },

  // Supervisor Registering New Employee Account
  openSignUpStaffModal() {
    const html = `
      <div>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 0.85rem;">
          ➕ <strong>สร้างบัญชีผู้ใช้ใหม่สำหรับพนักงาน:</strong> กรุณากำหนด Username, รหัสผ่าน และสิทธิ์หน้าที่
        </div>

        <div class="form-group mb-3">
          <label class="form-label">ชื่อผู้ใช้ (Username สำหรับใช้ล็อกอิน): <span style="color: red;">*</span></label>
          <input type="text" id="signup-username" class="form-control" placeholder="เช่น cashier3, sale_somchai (ภาษาอังกฤษ อักษรตัวเล็ก)">
        </div>

        <div class="form-group mb-3">
          <label class="form-label">รหัสผ่าน (Password): <span style="color: red;">*</span></label>
          <input type="password" id="signup-password" class="form-control" placeholder="กำหนดรหัสผ่าน (เช่น 123456)">
        </div>

        <div class="form-group mb-3">
          <label class="form-label">ชื่อ-นามสกุล พนักงาน: <span style="color: red;">*</span></label>
          <input type="text" id="signup-name" class="form-control" placeholder="เช่น นายสมชาย สายเปย์ (พนักงานขาย POS 3)">
        </div>

        <div class="form-group mb-3">
          <label class="form-label">สิทธิ์ตำแหน่งหน้าที่ (Role): <span style="color: red;">*</span></label>
          <select id="signup-role" class="form-select">
            <option value="cashier">🧑‍💻 พนักงานขาย / แคชเชียร์ (Cashier - ขายหน้าร้าน POS, รับเข้า/คืนสินค้า)</option>
            <option value="supervisor">👨‍💼 หัวหน้างาน / ผู้จัดการ (Supervisor Admin - สิทธิ์เพิ่ม SKU, แก้ต้นทุน, จัดการผู้ใช้)</option>
          </select>
        </div>
      </div>
    `;

    this.openModal('➕ สร้างบัญชีผู้ใช้พนักงานใหม่ (Sign Up Staff)', html, `
      <button class="btn btn-secondary" onclick="AppEngine.openUserManagementModal()">ยกเลิก</button>
      <button class="btn btn-success" onclick="AppEngine.saveNewStaffUser()">+ บันทึกสร้างบัญชีผู้ใช้</button>
    `);
  },

  saveNewStaffUser() {
    const store = window.AppStore.data;
    const username = document.getElementById('signup-username')?.value?.trim();
    const password = document.getElementById('signup-password')?.value?.trim();
    const name = document.getElementById('signup-name')?.value?.trim();
    const role = document.getElementById('signup-role')?.value || 'cashier';

    if (!username || !password || !name) {
      this.showToast('กรุณาระบุ Username, รหัสผ่าน และชื่อพนักงานให้ครบถ้วน', 'danger');
      return;
    }

    if (store.users.find(x => x.username.toLowerCase() === username.toLowerCase())) {
      this.showToast(`ชื่อผู้ใช้ [${username}] มีอยู่ในระบบแล้ว! กรุณาใช้ชื่ออื่น`, 'warning');
      return;
    }

    const newUser = {
      username: username,
      password: password,
      name: name,
      role: role,
      avatar: role === 'supervisor' ? '👨‍💼' : '🧑‍💻'
    };

    store.users.push(newUser);
    window.AppStore.save();
    this.showToast(`สร้างบัญชีผู้ใช้ [${username}] สำหรับ ${name} สำเร็จ!`, 'success');
    this.openUserManagementModal();
  },

  openEditStaffPasswordModal(username) {
    const store = window.AppStore.data;
    const u = store.users.find(x => x.username === username);
    if (!u) return;

    const html = `
      <div>
        <div class="form-group mb-3">
          <label class="form-label">ชื่อผู้ใช้ (Username):</label>
          <input type="text" class="form-control" value="${u.username}" disabled style="background: rgba(255,255,255,0.05);">
        </div>
        <div class="form-group mb-3">
          <label class="form-label">ชื่อพนักงาน:</label>
          <input type="text" id="edit-staff-name" class="form-control" value="${u.name}">
        </div>
        <div class="form-group mb-3">
          <label class="form-label">รหัสผ่านใหม่ (New Password): <span style="color: red;">*</span></label>
          <input type="text" id="edit-staff-pass" class="form-control" value="${u.password}">
        </div>
      </div>
    `;

    this.openModal(`✏️ แก้ไขข้อมูลบัญชี - ${u.username}`, html, `
      <button class="btn btn-secondary" onclick="AppEngine.openUserManagementModal()">ยกเลิก</button>
      <button class="btn btn-primary" onclick="AppEngine.saveEditStaffPassword('${u.username}')">บันทึกการเปลี่ยนรหัส</button>
    `);
  },

  saveEditStaffPassword(username) {
    const store = window.AppStore.data;
    const u = store.users.find(x => x.username === username);
    if (!u) return;

    const newName = document.getElementById('edit-staff-name')?.value?.trim();
    const newPass = document.getElementById('edit-staff-pass')?.value?.trim();

    if (!newPass || !newName) {
      this.showToast('กรุณาระบุชื่อพนักงานและรหัสผ่านใหม่', 'danger');
      return;
    }

    u.name = newName;
    u.password = newPass;

    window.AppStore.save();
    this.showToast(`อัปเดตรหัสผ่านของบัญชี [${username}] สำเร็จ!`, 'success');
    this.openUserManagementModal();
  },

  deleteStaffUser(username) {
    const store = window.AppStore.data;
    const idx = store.users.findIndex(x => x.username === username);
    if (idx === -1) return;

    if (confirm(`คุณต้องการลบบัญชีผู้ใช้ [${username}] ออกจากระบบใช่หรือไม่?`)) {
      store.users.splice(idx, 1);
      window.AppStore.save();
      this.showToast(`ลบบัญชีผู้ใช้ [${username}] เรียบร้อยแล้ว`, 'info');
      this.openUserManagementModal();
    }
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
      logistics: '🚚 จัดคิวรถจัดส่ง (ผู้ติดตาม 0-10 คน) & POD',
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
