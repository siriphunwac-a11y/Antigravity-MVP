// ==========================================
// Procurement & Supplier Management Module (Formal PO Document Layout)
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.Modules.procurement = function() {
  const store = window.AppStore.data;
  const pos = store.purchaseOrders || [];

  return `
    <div class="procurement-module">
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">📝 ระบบขอราคา (RFQ) & ใบสั่งซื้อวัสดุ (Purchase Order - PO)</div>
          <button class="btn btn-primary" onclick="Modules.procurement_openNewPOModal()">+ ออกใบสั่งซื้อสินค้าใหม่ (Create PO)</button>
        </div>
        
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>เลขที่ PO</th>
                <th>ซัพพลายเออร์ (Supplier)</th>
                <th>วันที่สั่งซื้อ</th>
                <th>วันที่กำหนดส่ง</th>
                <th>มูลค่ารวม (บาท)</th>
                <th>วิธีการชำระเงินค่าของ</th>
                <th>สถานะ PO</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${pos.map(po => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${po.poNo}</td>
                  <td style="font-weight: 600;">${po.supplier}</td>
                  <td>${po.date}</td>
                  <td>${po.deliveryDate}</td>
                  <td style="font-weight: 700;">฿${AppEngine.formatCurrency(po.totalAmount)}</td>
                  <td><span class="badge badge-info">${po.paymentMethod || 'โอนเงินผ่านธนาคาร'}</span></td>
                  <td>
                    <span class="badge ${po.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${po.status}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="Modules.procurement_printPO('${po.poNo}')">🖨️ พิมพ์ PO</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Supplier Matrix -->
      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📊 ตารางเปรียบเทียบซัพพลายเออร์ (Supplier Matrix)</div>
          </div>
          <div class="table-responsive">
            <table class="custom-table" style="font-size: 0.82rem;">
              <thead>
                <tr>
                  <th>ชื่อ Supplier</th>
                  <th>เครดิตเทอม</th>
                  <th>คะแนนจัดส่งตรงเวลา</th>
                  <th>เกรดประเมิน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>บจก. เอสซีจี ซิเมนต์ฯ</td>
                  <td>60 วัน</td>
                  <td style="color: #10b981;">98.5%</td>
                  <td><span class="badge badge-success">Grade A+</span></td>
                </tr>
                <tr>
                  <td>บมจ. ทีโอเอ เพ้นท์</td>
                  <td>45 วัน</td>
                  <td style="color: #10b981;">96.0%</td>
                  <td><span class="badge badge-success">Grade A</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 ประวัติราคาปูนและไม้แปรรูปย้อนหลัง 6 เดือน</div>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>ไม้ฝาเฌอร่า 15x300 ซม. (ต่อแผ่น):</span>
              <span style="color: #10b981; font-weight: 700;">฿65 ➔ ฿68 ➔ ฿68</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>ปูนเสือ 50 กก. (ต่อถุง):</span>
              <span style="color: #67e8f9; font-weight: 700;">฿110 ➔ ฿112 ➔ ฿115</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Modules.procurement_openNewPOModal = function() {
  const html = `
    <div>
      <div class="form-group">
        <label class="form-label">เลือกซัพพลายเออร์ (Supplier):</label>
        <select class="form-select" id="po-supplier-select">
          <option>บริษัท เอสซีจี ซิเมนต์-ผลิตภัณฑ์ก่อสร้าง จำกัด</option>
          <option>บริษัท ทีโอเอ เพ้นท์ (ประเทศไทย) จำกัด (มหาชน)</option>
          <option>บริษัท ทีพีไอ โพลีน จำกัด (มหาชน)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">รายการสินค้าสั่งซื้อ:</label>
        <select class="form-select" id="po-sku-select">
          <option value="WOD-001">ไม้ฝาเฌอร่า/SCG 15x300 ซม. (ต้นทุน ฿68/แผ่น)</option>
          <option value="CEM-001">ปูนซีเมนต์ผสม SCG ซูเปอร์เสือ 50 กก. (ต้นทุน ฿115/ถุง)</option>
        </select>
      </div>

      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div class="form-group">
          <label class="form-label">จำนวนที่สั่งซื้อ:</label>
          <input type="number" id="po-qty" class="form-control" value="200">
        </div>
        <div class="form-group">
          <label class="form-label">ราคาต้นทุน (บาท/หน่วย):</label>
          <input type="number" id="po-cost" class="form-control" value="68">
        </div>
      </div>

      <!-- SUPPLIER PAYMENT METHOD OPTIONS -->
      <div class="form-group mb-3">
        <label class="form-label" style="color: #67e8f9; font-weight: 700;">💳 วิธีการจ่ายเงินค่าของให้ Supplier:</label>
        <select class="form-select" id="po-payment-method" onchange="Modules.procurement_togglePayFields(this.value)">
          <option value="CASH">💵 เงินสด (Cash)</option>
          <option value="BANK_TRANSFER">📲 โอนเงินเข้าบัญชี (Bank Transfer)</option>
          <option value="CHEQUE" selected>📜 ตีเช็คสั่งจ่าย (Cheque)</option>
        </select>
      </div>

      <div id="po-pay-details-box" style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
        <div id="po-field-bank" style="display: none;">
          <label class="form-label">ระบุเลขที่บัญชี / ชื่อบัญชี Supplier ที่โอนเข้า:</label>
          <input type="text" id="po-bank-acc" class="form-control" value="ธ.กสิกรไทย 012-3-45678-9 (บจก. เอสซีจี)">
        </div>
        <div id="po-field-cheque">
          <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label class="form-label">ระบุเลขที่เช็ค:</label>
              <input type="text" id="po-cheque-no" class="form-control" value="CHQ-887799">
            </div>
            <div>
              <label class="form-label">วันที่ลงในเช็ค:</label>
              <input type="date" id="po-cheque-date" class="form-control" value="2026-08-30">
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">กำหนดวันส่งมอบสินค้า:</label>
        <input type="date" id="po-delivery-date" class="form-control" value="2026-08-22">
      </div>
    </div>
  `;

  AppEngine.openModal('📝 ออกใบสั่งซื้อสินค้าใหม่ (Create PO)', html, `
    <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ยกเลิก</button>
    <button class="btn btn-primary" onclick="Modules.procurement_submitPO()">อนุมัติและส่ง PO ให้ Supplier</button>
  `);
};

window.Modules.procurement_togglePayFields = function(val) {
  const bankField = document.getElementById('po-field-bank');
  const chequeField = document.getElementById('po-field-cheque');

  if (bankField) bankField.style.display = val === 'BANK_TRANSFER' ? 'block' : 'none';
  if (chequeField) chequeField.style.display = val === 'CHEQUE' ? 'block' : 'none';
};

window.Modules.procurement_submitPO = function() {
  const supplier = document.getElementById('po-supplier-select')?.value;
  const qty = parseInt(document.getElementById('po-qty')?.value || 100);
  const cost = parseFloat(document.getElementById('po-cost')?.value || 100);
  const delDate = document.getElementById('po-delivery-date')?.value || '2026-08-22';
  const payMethod = document.getElementById('po-payment-method')?.value || 'CASH';

  let payLabel = 'เงินสด';
  if (payMethod === 'BANK_TRANSFER') {
    payLabel = `โอนเงินเข้าบัญชี (${document.getElementById('po-bank-acc')?.value || ''})`;
  } else if (payMethod === 'CHEQUE') {
    payLabel = `ตีเช็ค เลขที่ ${document.getElementById('po-cheque-no')?.value || ''} ลงวันที่ ${document.getElementById('po-cheque-date')?.value || ''}`;
  }

  const newPO = {
    poNo: `PO-2026-08${Math.floor(Math.random()*90 + 10)}`,
    supplier: supplier,
    date: new Date().toLocaleDateString('th-TH'),
    totalItems: 1,
    totalAmount: qty * cost,
    status: 'Approved',
    deliveryDate: delDate,
    paymentMethod: payLabel
  };

  window.AppStore.data.purchaseOrders.unshift(newPO);
  window.AppStore.save();
  AppEngine.closeModal();
  AppEngine.showToast(`สร้างใบสั่งซื้อ ${newPO.poNo} สำเร็จ!`, 'success');
  AppEngine.loadModule('procurement');
};

// FORMAL PO PRINT TEMPLATE MATCHING TAX INVOICE FORMAT
window.Modules.procurement_printPO = function(poNo) {
  const store = window.AppStore.data;
  const company = store.companyInfo;
  const po = store.purchaseOrders.find(x => x.poNo === poNo) || store.purchaseOrders[0];

  const html = `
    <div class="printable-document" style="background: #fff; color: #000; padding: 25px; font-family: 'Prompt', sans-serif; font-size: 0.82rem; border: 1px solid #ccc;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #06b6d4; padding-bottom: 8px; margin-bottom: 12px;">
        <div>
          <h2 style="margin: 0; color: #06b6d4; font-size: 1.4rem;">${company.name}</h2>
          <div style="font-size: 0.78rem; color: #444;">${company.address}</div>
          <div style="font-size: 0.78rem; color: #444;">เลขประจำตัวผู้เสียภาษี: <strong>${company.taxId}</strong></div>
          <div style="font-size: 0.78rem; color: #444;">โทรศัพท์: <strong>${company.phones}</strong></div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #111; font-size: 1.3rem; white-space: nowrap;">ใบสั่งซื้อ / Purchase Order</h2>
          <div style="font-size: 0.85rem; color: #666;">( ต้นฉบับ / Original )</div>
        </div>
      </div>

      <!-- Supplier Meta -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-bottom: 12px; background: #f8fafc; padding: 8px; border-radius: 6px;">
        <div>
          <div><strong>ผู้ขาย (Supplier):</strong> ${po.supplier}</div>
          <div><strong>เงื่อนไขการชำระเงิน:</strong> ${po.paymentMethod}</div>
        </div>
        <div>
          <div><strong>เลขที่ใบสั่งซื้อ (PO No.):</strong> ${po.poNo}</div>
          <div><strong>วันที่สั่งซื้อ:</strong> ${po.date}</div>
          <div><strong>กำหนดส่งมอบ:</strong> ${po.deliveryDate}</div>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;" border="1" borderColor="#ddd">
        <thead>
          <tr style="background: #e2e8f0; text-align: left;">
            <th style="padding: 6px; text-align: center;">#</th>
            <th style="padding: 6px;">รายการสินค้าที่สั่งซื้อ</th>
            <th style="padding: 6px; text-align: center;">จำนวน</th>
            <th style="padding: 6px; text-align: right;">ราคาต้นทุน/หน่วย</th>
            <th style="padding: 6px; text-align: right;">จำนวนเงินรวม</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px; text-align: center;">1</td>
            <td style="padding: 6px;">[WOD-001] ไม้ฝาเฌอร่า/SCG 15x300 ซม. (เกรด A)</td>
            <td style="padding: 6px; text-align: center;">200 แผ่น</td>
            <td style="padding: 6px; text-align: right;">฿68.00</td>
            <td style="padding: 6px; text-align: right;">฿${AppEngine.formatCurrency(po.totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Summary -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-bottom: 15px;">
        <div style="border: 1px solid #ddd; padding: 8px; border-radius: 6px; font-size: 0.78rem;">
          <strong>ข้อกำหนดเพิ่มเติม:</strong> สินค้าต้องได้มาตรฐาน มอก. ไม่ชำรุดเสียหายจากการขนส่ง
        </div>
        <div style="font-size: 0.82rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; border-top: 1px solid #000; padding-top: 4px;">
            <span>มูลค่าสั่งซื้อรวมสุทธิ:</span>
            <span>฿${AppEngine.formatCurrency(po.totalAmount)}</span>
          </div>
        </div>
      </div>

      <!-- Signatures -->
      <div style="display: flex; justify-content: space-between; margin-top: 30px; text-align: center; font-size: 0.78rem;">
        <div>
          <div>......................................................</div>
          <div>ผู้สั่งซื้อ / Prepared by</div>
          <div>วันที่ ..... / ..... / .......</div>
        </div>
        <div>
          <div>......................................................</div>
          <div>ผู้อนุมัติสั่งซื้อ / Approved by (${company.name})</div>
          <div>วันที่ ..... / ..... / .......</div>
        </div>
      </div>
    </div>
  `;

  AppEngine.openModal(`📝 ใบสั่งซื้อ - ${po.poNo}`, html, `
    <button class="btn btn-secondary" onclick="window.print()">🖨️ พิมพ์ใบสั่งซื้อ PO (Print PDF)</button>
    <button class="btn btn-primary" onclick="AppEngine.closeModal()">ปิดหน้าต่าง</button>
  `);
};
