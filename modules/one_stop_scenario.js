// ==========================================
// End-to-End One Stop Service Scenario Simulator ("ลูกค้าสร้างบ้าน 1 หลัง")
// ==========================================

window.Modules = window.Modules || {};

window.ScenarioState = {
  step: 1,
  width: 10,
  length: 12,
  height: 3.5,
  floors: 2,
  sides: 4,
  boqTotal: 0,
  vatType: 'INCLUDE_VAT',
  deliveryMode: 'DELIVERY', // 'DELIVERY' or 'SELF_PICKUP'
  distanceKm: 15,
  depositAmount: 5000,
  paymentMethod: 'BANK_TRANSFER',
  docNo: 'INV-2026-SIM01',
  truckPlate: '70-1234 กทม.',
  driverName: 'นายสมนึก ขยันขับ',
  helpers: ['นายสมชาย ดีงาม', 'นายสมศักดิ์ ขยันงาน', 'นายประเสริฐ ชำนาญ']
};

window.Modules.one_stop_scenario = function() {
  const state = window.ScenarioState;

  return `
    <div class="scenario-module">
      <div class="card mb-4" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2)); border: 1px solid #06b6d4;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--accent-cyan-light);">
              🌟 ตัวอย่างกระบวนการจริง (Interactive End-to-End Walkthrough)
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted);">
              จำลองบริการลูกค้าสร้างบ้าน 1 หลัง: กรอกขนาด/ความสูง/ด้าน ➔ Auto BOQ ➔ ใบเสนอราคา (รับเอง/ส่ง, VAT, เงินสด/โอน) ➔ คลัง ➔ คิวรถ ➔ Photo POD ➔ เตือนชำระเงิน
            </p>
          </div>
          <button class="btn btn-warning" onclick="Modules.scenario_reset()">🔄 เริ่มต้นจำลองใหม่</button>
        </div>

        <!-- Wizard Step Stepper Navigation -->
        <div style="display: flex; justify-content: space-between; margin-top: 20px; overflow-x: auto; padding-bottom: 10px;">
          ${[
            '1. ขนาด/ความสูง/ด้าน',
            '2. Auto BOQ',
            '3. แนะนำวัสดุ',
            '4. ใบเสนอราคา & วิธีชำระ',
            '5. ตัดสต๊อกคลัง',
            '6. จัดคิวรถส่งของ',
            '7. Photo POD ยืนยัน',
            '8. แจ้งเตือนเงิน & ประกัน'
          ].map((s, idx) => `
            <div style="text-align: center; flex: 1; min-width: 100px; padding: 5px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: ${state.step > idx ? '#10b981' : state.step === idx + 1 ? '#06b6d4' : 'rgba(255,255,255,0.1)'}; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px;">
                ${state.step > idx ? '✓' : idx + 1}
              </div>
              <div style="font-size: 0.75rem; color: ${state.step === idx + 1 ? '#67e8f9' : 'var(--text-muted)'}; font-weight: ${state.step === idx + 1 ? '700' : '400'};">
                ${s}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Active Step Content Panel -->
      <div class="card mb-4" id="scenario-step-panel">
        ${Modules.scenario_renderStepContent()}
      </div>
    </div>
  `;
};

window.Modules.scenario_renderStepContent = function() {
  const state = window.ScenarioState;

  if (state.step === 1) {
    return `
      <div>
        <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">ขั้นตอนที่ 1: กรอกขนาดตัวบ้าน ความสูง และจำนวนด้านผนัง</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 15px;">
          ระบุความกว้าง ความยาว ความสูงของบ้าน จำนวนชั้น และจำนวนด้านผนังเพื่อคำนวณพื้นที่อย่างแม่นยำ
        </p>

        <div class="grid-4 mb-3" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
          <div class="form-group">
            <label class="form-label">ความกว้าง (ม.):</label>
            <input type="number" class="form-control" value="${state.width}" id="sim-w">
          </div>
          <div class="form-group">
            <label class="form-label">ความยาว (ม.):</label>
            <input type="number" class="form-control" value="${state.length}" id="sim-l">
          </div>
          <div class="form-group">
            <label class="form-label">ความสูง (ม.):</label>
            <input type="number" class="form-control" value="${state.height}" id="sim-h" step="0.1">
          </div>
          <div class="form-group">
            <label class="form-label">จำนวนชั้น:</label>
            <input type="number" class="form-control" value="${state.floors}" id="sim-f">
          </div>
          <div class="form-group">
            <label class="form-label">จำนวนด้านผนัง:</label>
            <select class="form-select" id="sim-s">
              <option value="4" ${state.sides === 4 ? 'selected' : ''}>4 ด้าน (มาตรฐาน)</option>
              <option value="6" ${state.sides === 6 ? 'selected' : ''}>6 ด้าน (L-Shape)</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary" onclick="Modules.scenario_nextStep(2)">ถัดไป: คำนวณ Auto BOQ ➔</button>
      </div>
    `;
  }

  if (state.step === 2) {
    const area = state.width * state.length * state.floors;
    const wallArea = (state.width + state.length) * (state.sides / 4) * state.height * state.floors * 0.85;
    state.boqTotal = area * 3500;
    return `
      <div>
        <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">ขั้นตอนที่ 2: ระบบถอด BOQ อัตโนมัติ (Auto-BOQ Calculation)</h4>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <div>บ้านขนาด <strong>${state.width} x ${state.length} ม. สูง ${state.height} ม. (${state.sides} ด้าน, ${state.floors} ชั้น)</strong></div>
          <div>พื้นที่ตัวบ้านรวม: <strong>${area} ตร.ม.</strong> | พื้นที่ผนังรวม: <strong>${wallArea.toFixed(1)} ตร.ม.</strong></div>
          <div style="font-size: 1.2rem; font-weight: 700; color: #10b981; margin-top: 5px;">ประมาณการราคาสินค้าวัสดุรวม: ฿${AppEngine.formatCurrency(state.boqTotal)}</div>
        </div>

        <button class="btn btn-primary" onclick="Modules.scenario_nextStep(3)">ถัดไป: แนะนำรายการวัสดุมาตรฐาน ➔</button>
      </div>
    `;
  }

  if (state.step === 3) {
    return `
      <div>
        <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">ขั้นตอนที่ 3: ระบบจับคู่และแนะนำวัสดุก่อสร้าง (Recommended Materials)</h4>
        <ul style="font-size: 0.88rem; line-height: 1.8; margin-bottom: 20px; color: var(--text-main);">
          <li>🧱 ปูนโครงสร้าง TPI 199 + ปูนผสม SCG ซูเปอร์เสือ (รวม 200 ถุง)</li>
          <li>⚙️ เหล็กเส้นข้ออ้อย DB12 มอก. SD40 (รวม 300 เส้น)</li>
          <li>🟫 อิฐมวลเบา คิวคอน Q-CON 7.5 ซม. (รวม 2,000 ก้อน)</li>
          <li>🏠 กระเบื้องหลังคาลอนคู่ SCG (รวม 450 แผ่น)</li>
        </ul>

        <button class="btn btn-primary" onclick="Modules.scenario_nextStep(4)">ถัดไป: ออกใบเสนอราคา (เลือก VAT / รับเองหรือส่ง / มัดจำ / วิธีชำระ) ➔</button>
      </div>
    `;
  }

  if (state.step === 4) {
    const deliveryFee = state.deliveryMode === 'SELF_PICKUP' ? 0 : (state.distanceKm - 5) * 15;
    const vat = state.boqTotal * 0.07;
    const grand = state.boqTotal + vat + deliveryFee;
    const remaining = grand - state.depositAmount;

    return `
      <div>
        <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">ขั้นตอนที่ 4: ใบเสนอราคา & วิธีการชำระเงินของลูกค้า</h4>
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>รูปแบบจัดส่ง:</span>
            <span style="color: #10b981; font-weight: 600;">${state.deliveryMode === 'SELF_PICKUP' ? '🏪 รับเองหน้าร้าน (Store Self-Pickup)' : '🚚 จัดส่งถึงไซต์งาน (' + state.distanceKm + ' กม.)'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>ภาษี VAT 7%:</span>
            <span>฿${AppEngine.formatCurrency(vat)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>ค่าขนส่ง:</span>
            <span>฿${AppEngine.formatCurrency(deliveryFee)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #f59e0b; font-weight: 600;">
            <span>เงินมัดจำล่วงหน้า:</span>
            <span>-฿${AppEngine.formatCurrency(state.depositAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #67e8f9; font-weight: 600; margin-top: 4px;">
            <span>วิธีชำระเงินมัดจำ/ของ:</span>
            <span>📲 โอนเงินผ่านธนาคารกสิกรไทย 012-3-45678-9</span>
          </div>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; color: #10b981;">
            <span>คงเหลือชำระวันส่งมอบ:</span>
            <span>฿${AppEngine.formatCurrency(remaining)}</span>
          </div>
        </div>

        <button class="btn btn-primary" onclick="Modules.scenario_nextStep(5)">ถัดไป: ตัดสต๊อกคลังอัตโนมัติ ➔</button>
      </div>
    `;
  }

  if (state.step === 5) {
    return `
      <div>
        <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">ขั้นตอนที่ 5: ตัดสต๊อกคลังสินค้า (Auto Stock Deduction)</h4>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="color: #10b981; font-weight: 700;">✅ ตัดสต๊อกคลังสำเร็จ! (ดำเนินรายการโดย Cashier/Supervisor)</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px;">
            ระบบตัดยอดปูน เหล็ก อิฐ และหลังคาออกจาก Bin Location A-01 และบันทึก Audit Log เรียบร้อย
          </div>
        </div>

        <button class="btn btn-primary" onclick="Modules.scenario_nextStep(6)">ถัดไป: จัดคิวรถส่งของ (คนขับ + พนักงานติดตาม 3 คน) ➔</button>
      </div>
    `;
  }

  if (state.step === 6) {
    return `
      <div>
        <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">ขั้นตอนที่ 6: จัดคิวรถส่งของ (Fleet Queue Dispatch)</h4>
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div>🚛 ทะเบียนรถ: <strong>${state.truckPlate}</strong></div>
          <div>👨‍✈️ พนักงานขับรถ: <strong>${state.driverName}</strong></div>
          <div>👷 พนักงานติดตามจัดส่ง: <strong>${state.helpers.join(', ')}</strong> (3 คน)</div>
        </div>

        <button class="btn btn-primary" onclick="Modules.scenario_nextStep(7)">ถัดไป: ยืนยันการส่งของด้วยรูปถ่าย Photo POD ➔</button>
      </div>
    `;
  }

  if (state.step === 7) {
    return `
      <div>
        <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">ขั้นตอนที่ 7: ยืนยันการส่งมอบสินค้า ณ หน้างาน (Photo POD)</h4>
        <div class="photo-pod-container" style="margin-bottom: 20px;">
          <div style="font-size: 3rem;">📸</div>
          <div style="color: #10b981; font-weight: 700; margin-top: 5px;">[รูปถ่ายยืนยันสินค้าวาง ณ ไซต์งานสำเร็จ]</div>
          <p style="font-size: 0.8rem; color: var(--text-muted);">พนักงานจัดส่งถ่ายรูปสินค้าคู่กับสถานที่จัดส่งและแนบเข้าระบบเรียบร้อย</p>
        </div>

        <button class="btn btn-primary" onclick="Modules.scenario_nextStep(8)">ถัดไป: ระบบแจ้งเตือนเงิน & การรับประกัน ➔</button>
      </div>
    `;
  }

  if (state.step === 8) {
    return `
      <div>
        <h4 style="font-weight: 700; color: #10b981; margin-bottom: 10px;">🎉 ขั้นตอนที่ 8: บริการหลังการขาย, ใบรับประกัน & ระบบแจ้งเตือนชำระเงิน</h4>
        <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid #f43f5e; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="font-weight: 700; color: #f43f5e;">🔔 ตั้งระบบแจ้งเตือนการจ่ายเงินชำระหนี้อัตโนมัติ:</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            • แจ้งเตือนล่วงหน้า 1 วันก่อนถึงกำหนดชำระ<br>
            • แจ้งเตือนเวลา 08:00 น. ในวันที่ต้องชำระจริง
          </div>
        </div>

        <button class="btn btn-success" onclick="Modules.scenario_reset()">🎉 เสร็จสิ้นสมบูรณ์ (เริ่มต้นจำลองใหม่)</button>
      </div>
    `;
  }
};

window.Modules.scenario_nextStep = function(targetStep) {
  if (targetStep === 2) {
    const w = parseFloat(document.getElementById('sim-w')?.value || 10);
    const l = parseFloat(document.getElementById('sim-l')?.value || 12);
    const h = parseFloat(document.getElementById('sim-h')?.value || 3.5);
    const f = parseInt(document.getElementById('sim-f')?.value || 2);
    const s = parseInt(document.getElementById('sim-s')?.value || 4);
    window.ScenarioState.width = w;
    window.ScenarioState.length = l;
    window.ScenarioState.height = h;
    window.ScenarioState.floors = f;
    window.ScenarioState.sides = s;
  }

  window.ScenarioState.step = targetStep;
  AppEngine.loadModule('one_stop_scenario');
};

window.Modules.scenario_reset = function() {
  window.ScenarioState.step = 1;
  AppEngine.loadModule('one_stop_scenario');
};
