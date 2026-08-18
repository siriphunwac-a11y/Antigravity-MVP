// ==========================================
// Finance, Accounting & AR Payment Due Alert System
// ==========================================

window.Modules = window.Modules || {};

window.Modules.accounting = function() {
  const store = window.AppStore.data;
  const bills = store.arBills || [];

  return `
    <div class="accounting-module">
      <!-- Highlighted Feature: AR Payment Reminders Banner -->
      <div class="card mb-4" style="background: linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(245, 158, 11, 0.15)); border: 1px solid rgba(244, 63, 94, 0.3);">
        <div class="card-header">
          <div class="card-title" style="color: #fecdd3;">
            <span>🔔</span> ระบบแจ้งเตือนกำหนดชำระเงินลูกหนี้การค้า (AR Payment Due Reminder)
          </div>
          <span class="badge badge-danger">แจ้งเตือนอัตโนมัติ</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
          ระบบจะทำการแจ้งเตือนล่วงหน้า <strong>1 วัน ก่อนถึงกำหนดชำระ</strong> และส่งการแจ้งเตือนด่วนใน <strong>เวลา 08:00 น. ของวันที่ต้องชำระจริง</strong>
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <div style="background: rgba(244, 63, 94, 0.2); border: 1px solid #f43f5e; padding: 10px 15px; border-radius: 8px; flex: 1;">
            <div style="font-weight: 700; color: #f43f5e; font-size: 0.85rem;">🔔 แจ้งเตือนวันชำระจริง (เวลา 08:00 น. วันนี้):</div>
            <div style="font-size: 0.88rem; font-weight: 600; margin-top: 4px;">คุณอนันต์ - บิล INV-2026-0805 (ยอดคงเหลือ ฿220,000)</div>
          </div>

          <div style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; padding: 10px 15px; border-radius: 8px; flex: 1;">
            <div style="font-weight: 700; color: #f59e0b; font-size: 0.85rem;">⚠️ แจ้งเตือนก่อนถึงวันจ่าย 1 วัน (ครบกำหนดพรุ่งนี้):</div>
            <div style="font-size: 0.88rem; font-weight: 600; margin-top: 4px;">หจก. ศิริการช่าง - บิล INV-2026-0801 (ยอดคงเหลือ ฿135,000)</div>
          </div>
        </div>
      </div>

      <!-- AR Bills Management Table -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">💰 ตารางลูกหนี้การค้า & การรับชำระเงิน (AR Settlement Table)</div>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>เลขที่เอกสาร</th>
                <th>ชื่อลูกค้า / โครงการ</th>
                <th>เบอร์โทร</th>
                <th>มูลค่าบิลรวม</th>
                <th>เงินมัดจำรับแล้ว</th>
                <th>ยอดคงเหลือ</th>
                <th>วันครบกำหนดชำระ</th>
                <th>สถานะแจ้งเตือน</th>
                <th>การรับชำระ</th>
              </tr>
            </thead>
            <tbody>
              ${bills.map(b => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${b.billNo}</td>
                  <td style="font-weight: 600;">${b.customerName}</td>
                  <td>${b.contactTel}</td>
                  <td>฿${AppEngine.formatCurrency(b.totalAmount)}</td>
                  <td style="color: #f59e0b;">฿${AppEngine.formatCurrency(b.depositAmount)}</td>
                  <td style="font-weight: 700; color: ${b.remainingAmount > 0 ? '#f43f5e' : '#10b981'};">
                    ฿${AppEngine.formatCurrency(b.remainingAmount)}
                  </td>
                  <td><strong>${b.dueDateFormatted}</strong></td>
                  <td>
                    ${b.status === 'DUE_TODAY' ? '<span class="badge badge-danger">🔔 ครบวันนี้ 08:00 น.</span>' :
                      b.status === 'DUE_SOON' ? '<span class="badge badge-warning">⚠️ ครบพรุ่งนี้ (1 วัน)</span>' :
                      '<span class="badge badge-success">✅ ชำระครบแล้ว</span>'}
                  </td>
                  <td>
                    ${b.remainingAmount > 0 ? `
                      <button class="btn btn-sm btn-success" onclick="Modules.accounting_payBill('${b.billNo}')">💵 รับชำระเงินตัดบิล</button>
                    ` : `
                      <span style="font-size: 0.78rem; color: #10b981;">ตัดบิลเรียบร้อย</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financial Summary & Cash Flow -->
      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">💵 สรุปงบกระแสเงินสด & ภาษี VAT 7% (PP.30)</div>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>ภาษีขาย (VAT Output 7%):</span>
              <span style="color: #67e8f9; font-weight: 700;">฿74,500</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>ภาษีซื้อ (VAT Input 7%):</span>
              <span style="color: #10b981; font-weight: 700;">-฿42,100</span>
            </div>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.05rem;">
              <span>ภาษีที่ต้องนำส่ง ภ.พ.30 สุทธิ:</span>
              <span style="color: #f59e0b;">฿32,400</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">📊 AR Aging Analysis (อายุหนี้คงค้าง)</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>0 - 30 วัน (ปกติ):</span>
              <span style="color: #10b981; font-weight: 700;">฿355,000 (100%)</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>31 - 60 วัน (ติดตามใกล้ชิด):</span>
              <span>฿0 (0%)</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>61 - 90+ วัน (หนี้เสีย/เกินกำหนด):</span>
              <span style="color: #f43f5e; font-weight: 700;">฿0 (0%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Modules.accounting_payBill = function(billNo) {
  const b = window.AppStore.data.arBills.find(x => x.billNo === billNo);
  if (!b) return;

  b.paidAmount = b.totalAmount;
  b.remainingAmount = 0;
  b.status = 'PAID';
  b.alertText = '✅ ชำระครบถ้วนเรียบร้อยแล้ว';

  window.AppStore.save();
  AppEngine.showToast(`รับชำระเงินบิล ${billNo} ครบถ้วน! ตัดหนี้สำเร็จ`, 'success');
  AppEngine.checkARPaymentAlerts();
  AppEngine.loadModule('accounting');
};
