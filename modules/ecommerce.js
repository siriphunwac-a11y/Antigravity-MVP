// ==========================================
// E-Commerce, Mobile App & Chat Commerce (LINE OA) Module
// ==========================================

window.Modules = window.Modules || {};

window.Modules.ecommerce = function() {
  return `
    <div class="ecommerce-module">
      <!-- Tabs: Web Storefront vs Mobile App Mode vs LINE OA Chat Commerce -->
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button class="btn btn-primary" id="ecom-tab-web" onclick="Modules.ecom_switchTab('web')">🌐 Web Storefront (หน้าร้านออนไลน์)</button>
        <button class="btn btn-secondary" id="ecom-tab-mobile" onclick="Modules.ecom_switchTab('mobile')">📱 Mobile App Simulator (มุมมองมือถือ)</button>
        <button class="btn btn-secondary" id="ecom-tab-line" onclick="Modules.ecom_switchTab('line')">💬 Chat Commerce (LINE OA Assistant)</button>
      </div>

      <!-- Web Store Container -->
      <div id="ecom-container-web" class="card mb-4">
        <div class="card-header">
          <div class="card-title">🌐 ร้านค้าวัสดุก่อสร้างออนไลน์ (One Stop Online Store)</div>
          <span class="badge badge-success">🟢 เปิดให้บริการ 24 ชม.</span>
        </div>

        <div class="grid-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div style="font-size: 2.5rem;">🧱</div>
            <h4 style="font-size: 1rem; font-weight: 600;">ปูนซีเมนต์ผสม SCG ซูเปอร์เสือ</h4>
            <p style="color: var(--accent-cyan-light); font-weight: 700;">฿145 / ถุง</p>
            <button class="btn btn-sm btn-primary" style="margin-top: 10px; width: 100%;" onclick="AppEngine.showToast('เพิ่มใส่ตะกร้าออนไลน์แล้ว', 'success')">🛒 สั่งซื้อออนไลน์</button>
          </div>

          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div style="font-size: 2.5rem;">🟫</div>
            <h4 style="font-size: 1rem; font-weight: 600;">อิฐมวลเบา คิวคอน Q-CON 7.5 ซม.</h4>
            <p style="color: var(--accent-cyan-light); font-weight: 700;">฿22 / ก้อน</p>
            <button class="btn btn-sm btn-primary" style="margin-top: 10px; width: 100%;" onclick="AppEngine.showToast('เพิ่มใส่ตะกร้าออนไลน์แล้ว', 'success')">🛒 สั่งซื้อออนไลน์</button>
          </div>

          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div style="font-size: 2.5rem;">🎨</div>
            <h4 style="font-size: 1rem; font-weight: 600;">สีทาภายนอก TOA SuperShield 5G</h4>
            <p style="color: var(--accent-cyan-light); font-weight: 700;">฿3,450 / ถัง</p>
            <button class="btn btn-sm btn-primary" style="margin-top: 10px; width: 100%;" onclick="AppEngine.showToast('เพิ่มใส่ตะกร้าออนไลน์แล้ว', 'success')">🛒 สั่งซื้อออนไลน์</button>
          </div>
        </div>
      </div>

      <!-- Mobile App View Simulator Container -->
      <div id="ecom-container-mobile" class="card mb-4" style="display: none; max-width: 420px; margin: 0 auto; border: 12px solid #1e293b; border-radius: 35px; padding: 20px;">
        <div style="text-align: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 15px;">
          <div style="width: 50px; height: 5px; background: #64748b; border-radius: 10px; margin: 0 auto 10px;"></div>
          <h4 style="font-weight: 700; font-size: 0.95rem;">📲 One Stop Construction App</h4>
          <span style="font-size: 0.75rem; color: var(--text-muted);">โหมดใช้งานผ่านแอปพลิเคชันมือถือ</span>
        </div>

        <div style="background: rgba(6,182,212,0.1); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-weight: 600; font-size: 0.85rem;">📦 สถานะการจัดส่งเรียลไทม์ (Live Order)</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">คำสั่งซื้อ #ORD-2026-0099 (รถทะเบียน 82-5678)</div>
          <div style="margin-top: 8px; font-weight: 700; color: #10b981; font-size: 0.82rem;">🚚 สินค้าอยู่ระหว่างการจัดส่ง (ใกล้ถึงแล้ว)</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="AppEngine.loadModule('boq_calculator')">🧮 คำนวณ BOQ บ้าน</button>
          <button class="btn btn-secondary btn-sm" onclick="AppEngine.loadModule('logistics')">📍 ติดตามตำแหน่งรถ GPS</button>
        </div>
      </div>

      <!-- LINE OA Chat Commerce Simulator Container -->
      <div id="ecom-container-line" class="card mb-4" style="display: none; max-width: 500px; margin: 0 auto;">
        <div class="card-header" style="background: #06c755; color: #fff; border-radius: 8px 8px 0 0;">
          <div class="card-title" style="color: #fff;">💬 LINE Official Account Assistant</div>
          <span style="font-size: 0.8rem;">@onestop_construction</span>
        </div>

        <div style="background: #111b21; padding: 15px; min-height: 250px; display: flex; flex-direction: column; gap: 10px;">
          <div style="background: #202c33; color: #fff; padding: 10px; border-radius: 10px; max-width: 80%; align-self: flex-start; font-size: 0.85rem;">
            🤖 สวัสดีครับ! ยินดีต้อนรับสู่บริการสั่งซื้อวัสดุก่อสร้างผ่าน LINE OA พิมพ์ส่งรายการวัสดุที่ต้องการได้เลยครับ
          </div>

          <div style="background: #005c4b; color: #fff; padding: 10px; border-radius: 10px; max-width: 80%; align-self: flex-end; font-size: 0.85rem;">
            ขอปูนซีเมนต์ SCG เสือ 50 ถุง และ อิฐมวลเบา 500 ก้อน จัดส่งไซต์งานบางใหญ่ครับ
          </div>

          <div style="background: #202c33; color: #fff; padding: 10px; border-radius: 10px; max-width: 80%; align-self: flex-start; font-size: 0.85rem;">
            ✅ สรุปยอดสั่งซื้อ:<br>
            • ปูนซีเมนต์ SCG เสือ 50 ถุง = ฿7,250<br>
            • อิฐมวลเบา Q-CON 500 ก้อน = ฿11,000<br>
            • ค่าจัดส่ง (12 กม.) = ฿105<br>
            <strong>รวมสุทธิ: ฿18,355</strong><br>
            <button class="btn btn-sm btn-success" style="margin-top: 8px;" onclick="AppEngine.showToast('สร้างใบเสนอราคาจาก LINE OA สำเร็จ!', 'success')">📲 กดชำระเงินมัดจำผ่าน PromptPay QR</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Modules.ecom_switchTab = function(tab) {
  document.getElementById('ecom-container-web').style.display = tab === 'web' ? 'block' : 'none';
  document.getElementById('ecom-container-mobile').style.display = tab === 'mobile' ? 'block' : 'none';
  document.getElementById('ecom-container-line').style.display = tab === 'line' ? 'block' : 'none';

  document.getElementById('ecom-tab-web').className = tab === 'web' ? 'btn btn-primary' : 'btn btn-secondary';
  document.getElementById('ecom-tab-mobile').className = tab === 'mobile' ? 'btn btn-primary' : 'btn btn-secondary';
  document.getElementById('ecom-tab-line').className = tab === 'line' ? 'btn btn-primary' : 'btn btn-secondary';
};
