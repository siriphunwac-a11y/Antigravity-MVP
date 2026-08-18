// ==========================================
// Customer CRM & Loyalty Module
// ==========================================

window.Modules = window.Modules || {};

window.Modules.crm = function() {
  const store = window.AppStore.data;
  const customers = store.customers || [];

  return `
    <div class="crm-module">
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">👑 ระบบ CRM ลูกค้า & ระดับสมาชิก (Member Tiers & Points)</div>
          <button class="btn btn-primary" onclick="AppEngine.showToast('ลงทะเบียนสมาชิกลูกค้าใหม่สำเร็จ', 'success')">+ ลงทะเบียนลูกค้าใหม่</button>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>รหัส / ชื่อลูกค้า</th>
                <th>เบอร์โทรศัพท์</th>
                <th>ระดับสมาชิก (Tier)</th>
                <th>ส่วนลดพิเศษ</th>
                <th>แต้มสะสม</th>
                <th>ยอดซื้อสะสมรวม</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td style="font-weight: 700;">${c.id} - ${c.name}</td>
                  <td>${c.phone}</td>
                  <td><span class="badge badge-info">${c.tier}</span></td>
                  <td style="font-weight: 700; color: #10b981;">-${c.discountPercent}%</td>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${AppEngine.formatNumber(c.points)} แต้ม</td>
                  <td>฿${AppEngine.formatCurrency(c.totalSpend)}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="AppEngine.showToast('ส่งคูปองส่วนลดทาง SMS/LINE ให้ ${c.name}', 'info')">🎁 ส่งคูปองส่วนลด</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Automated Marketing Triggers Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📢 ระบบการตลาดและแจ้งเตือนอัตโนมัติ (Automated Marketing Triggers)</div>
        </div>

        <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border-left: 3px solid #06b6d4;">
            <div style="font-weight: 600;">🏗️ แคมเปญ: สั่งปูนเสร็จแล้ว แนะนำเหล็กเส้นต่อทันที</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">ส่ง SMS เสนอส่วนลดเหล็กเส้น 3% แก่ลูกค้าที่ซื้อปูนโครงสร้างเกิน 100 ถุง</div>
            <button class="btn btn-sm btn-primary" style="margin-top: 10px;" onclick="AppEngine.showToast('ส่งข้อความโปรโมชันไปยัง 18 รายชื่อสำเร็จ', 'success')">🚀 รันแคมเปญทันที</button>
          </div>

          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border-left: 3px solid #10b981;">
            <div style="font-weight: 600;">🏠 แคมเปญ: ต้อนรับฤดูมุงหลังคา (ส่วนลดกระเบื้อง 5%)</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">ส่งข้อความ LINE OA แจ้งเตือนผู้รับเหมา VIP Pro</div>
            <button class="btn btn-sm btn-success" style="margin-top: 10px;" onclick="AppEngine.showToast('ส่งข้อความบรอดแคสต์ LINE OA สำเร็จ', 'success')">📲 ส่ง LINE Broadcast</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
