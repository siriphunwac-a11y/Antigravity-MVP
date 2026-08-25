// ==========================================
// Procurement & Supplier Management Module (Formal PO Document Layout)
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.Modules.procurement = function() {
  const store = window.AppStore.data;
  const pos = store.purchaseOrders || [];
  const products = store.products || [];

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
              ${pos.length === 0 ? '<tr><td colspan="8" style="text-align: center; color: var(--text-dim); padding: 35px;">ยังไม่มีใบสั่งซื้อ (PO) ในระบบ (0 รายการ)</td></tr>' : ''}
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
                ${pos.length === 0 ? '<tr><td colspan="4" style="text-align: center; color: var(--text-dim); padding: 20px;">ยังไม่มีประวัติการประเมิน Supplier</td></tr>' : ''}
                ${Array.from(new Set(pos.map(p => p.supplier))).map(sup => `
                  <tr>
                    <td style="font-weight: 600;">${sup}</td>
                    <td>30 วัน</td>
                    <td style="color: #10b981;">100.0%</td>
                    <td><span class="badge badge-success">Grade A+</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 ประวัติราคาปูนและไม้แปรรูปย้อนหลัง 6 เดือน</div>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; font-size: 0.85rem;">
            ${products.length === 0 ? `
              <p style="color: var(--text-dim); text-align: center; margin: 0;">ยังไม่มีข้อมูลประวัติราคาวัสดุในระบบ</p>
            ` : `
              ${products.slice(0, 3).map(p => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>${p.name} (ต่อ${p.unit}):</span>
                  <span style="color: #10b981; font-weight: 700;">฿${p.price}</span>
                </div>
              `).join('')}
            `}
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Modules.procurement_openNewPOModal = function() {
  const products = window.AppStore.data.products || [];

  const html = `
    <div>
      <div class="form-group">
        <label class="form-label">ระบุชื่อซัพพลายเออร์ (Supplier): <span style="color: red;">*</span></label>
        <input type="text" id="po-supplier-input" class="form-control" placeholder="เช่น บจก. เอสซีจี ซิเมนต์, บมจ. ทีโอเอ เพ้นท์">
      </div>

      <div class="form-group">
        <label class="form-label">รายการสินค้าสั่งซื้อ (SKU):</label>
        ${products.length === 0 ? `
          <div style="background: rgba(245, 158, 11, 0.15); padding: 10px; border-radius: 6px; font-size: 0.82rem; color: #f59e0b; margin-bottom: 8px;">
            ⚠️ คลังสินค้ายังไม่มี SKU สินค้า คุณสามารถพิมพ์ชื่อสินค้าสั่งซื้อด้านล่างได้โดยตรง
          </div>
          <input type="text" id="po-custom-item" class="form-control" placeholder="ระบุชื่อรายการวัสดุก่อสร้างที่ต้องการสั่งซื้อ">
        ` : `
          <select class="form-select" id="po-sku-select">
            ${products.map(p => `<option value="${p.sku}">${p.name} (SKU: ${p.sku})</option>`).join('')}
          </select>
        `}
      </div>

      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div class="form-group">
          <label class="form-label">จำนวนที่สั่งซื้อ:</label>
          <input type="number" id="po-qty" class="form-control" placeholder="กรอกจำนวน">
        </div>
        <div class="form-group">
          <label class="form-label">ราคาต้นทุน (บาท/หน่วย):</label>
          <input type="number" id="po-cost" class="form-control" placeholder="กรอกราคาต้นทุนต่อหน่วย">
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
          <input type="text" id="po-bank-acc" class="form-control" placeholder="ระบุเลขที่บัญชีธนาคาร">
        </div>
        <div id="po-field-cheque">
          <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label class="form-label">ระบุเลขที่เช็ค:</label>
              <input type="text" id="po-cheque-no" class="form-control" placeholder="เช่น CHQ-887799">
            </div>
            <div>
              <label class="form-label">วันที่ลงในเช็ค:</label>
              <input type="date" id="po-cheque-date" class="form-control">
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">กำหนดวันส่งมอบสินค้า:</label>
        <input type="date" id="po-delivery-date" class="form-control">
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
  const supplier = document.getElementById('po-supplier-input')?.value || 'ซัพพลายเออร์';
  const qty = parseInt(document.getElementById('po-qty')?.value || 0);
  const cost = parseFloat(document.getElementById('po-cost')?.value || 0);
  const delDate = document.getElementById('po-delivery-date')?.value || new Date().toISOString().slice(0,10);
  const payMethod = document.getElementById('po-payment-method')?.value || 'CASH';

  if (!supplier.trim()) {
    AppEngine.showToast('กรุณาระบุชื่อซัพพลายเออร์ Supplier', 'danger');
    return;
  }

  if (qty <= 0 || cost <= 0) {
    AppEngine.showToast('กรุณาระบุจำนวนและราคาต้นทุนให้ถูกต้อง', 'danger');
    return;
  }

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
  if (!po) return;

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
            <td style="padding: 6px;">รายการวัสดุก่อสร้างตาม PO</td>
            <td style="padding: 6px; text-align: center;">1 รายการ</td>
            <td style="padding: 6px; text-align: right;">฿${AppEngine.formatCurrency(po.totalAmount)}</td>
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
