// ==========================================
// Sales & POS Engine (Formal Documents, A4 Print, Multi-Billing Options)
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.PosCart = {
  items: [],
  vatType: 'INCLUDE_VAT',
  deliveryMode: 'DELIVERY',
  distanceKm: 5,
  depositAmount: 0,
  selectedCashierId: 'CS-001',
  paymentMethod: 'CASH',
  selectedBankId: 'KBANK',
  customerName: '',
  customerAddress: '',
  customerTaxId: ''
};

window.Modules.sales_pos = function() {
  const store = window.AppStore.data;
  const company = store.companyInfo;
  const products = store.products || [];
  const cashiers = store.cashiers || [];
  const banks = store.storeBankAccounts || [];
  const cart = window.PosCart;

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = cart.deliveryMode === 'SELF_PICKUP' ? 0 : (cart.distanceKm <= 5 ? 0 : (cart.distanceKm - 5) * 15);

  let vatAmount = 0;
  let totalWithVat = subtotal;

  if (cart.vatType === 'INCLUDE_VAT') {
    vatAmount = subtotal * 7 / 107;
    totalWithVat = subtotal;
  } else if (cart.vatType === 'EXCLUDE_VAT') {
    vatAmount = subtotal * 0.07;
    totalWithVat = subtotal + vatAmount;
  } else {
    vatAmount = 0;
    totalWithVat = subtotal;
  }

  const grandTotal = totalWithVat + deliveryFee;
  const remainingAfterDeposit = Math.max(0, grandTotal - cart.depositAmount);

  return `
    <div class="sales-pos-module">
      <!-- Company Header Banner -->
      <div class="card mb-4" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.15)); border: 1px solid #06b6d4;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--accent-cyan-light);">🪵 ${company.name}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${company.address}</p>
            <p style="font-size: 0.82rem; color: var(--accent-amber);">เลขประจำตัวผู้เสียภาษี: ${company.taxId} | โทร. ${company.phones}</p>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <label class="form-label" style="margin: 0; font-weight: 600;">เลือกรหัส Cashier:</label>
            <select class="form-select" id="pos-cashier-select" style="max-width: 220px;" onchange="Modules.sales_changeCashier(this.value)">
              ${cashiers.map(c => `
                <option value="${c.id}" ${cart.selectedCashierId === c.id ? 'selected' : ''}>
                  ${c.id} - ${c.name} (${c.terminal})
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="grid-2" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
        <!-- Product Picker -->
        <div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">📦 เลือกสินค้าใส่บิล (Quick Product Selector)</div>
            </div>
            
            <div class="table-responsive">
              <table class="custom-table" style="font-size: 0.85rem;">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>รายการสินค้า</th>
                    <th>ราคา</th>
                    <th>คงเหลือ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  ${products.map(p => `
                    <tr>
                      <td style="font-weight: 600;">${p.sku}</td>
                      <td>${p.name}</td>
                      <td style="color: var(--accent-cyan-light); font-weight: 700;">฿${p.price}</td>
                      <td>${p.stock} ${p.unit}</td>
                      <td>
                        <button class="btn btn-sm btn-primary" onclick="Modules.sales_addItem('${p.sku}')">+ เลือก</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Cart & Document Generation Controls -->
        <div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">📑 สรุปรายการสินค้า & เลือกรูปแบบการออกเอกสาร</div>
              <button class="btn btn-sm btn-secondary" onclick="Modules.sales_clearCart()">ล้างรายการ</button>
            </div>

            <!-- Items List -->
            <div style="max-height: 180px; overflow-y: auto; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              ${cart.items.length === 0 ? '<p style="color: var(--text-dim); text-align: center; padding: 20px;">ไม่มีรายการสินค้า</p>' : ''}
              ${cart.items.map((item, idx) => `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.88rem;">${item.name}</div>
                    <div style="font-size: 0.78rem; color: var(--accent-cyan-light);">฿${item.price} x ${item.qty} ${item.unit} = ฿${AppEngine.formatCurrency(item.price * item.qty)}</div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="number" value="${item.qty}" min="1" style="width: 50px; text-align: center;" class="form-control" onchange="Modules.sales_updateQty(${idx}, this.value)">
                    <button style="background: none; border: none; color: red; cursor: pointer;" onclick="Modules.sales_removeItem(${idx})">❌</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Customer Details Form -->
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 12px;">
              <div class="form-group mb-2">
                <label class="form-label" style="font-size: 0.8rem;">ชื่อลูกค้า / โครงการ:</label>
                <input type="text" class="form-control" value="${cart.customerName}" onchange="PosCart.customerName=this.value">
              </div>
              <div class="form-group mb-0">
                <label class="form-label" style="font-size: 0.8rem;">ที่อยู่ & เลขผู้เสียภาษี:</label>
                <input type="text" class="form-control" value="${cart.customerAddress}" onchange="PosCart.customerAddress=this.value">
              </div>
            </div>

            <!-- CONTROLS -->
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 12px;">
              <div class="form-group mb-2">
                <label class="form-label" style="font-size: 0.8rem;">รูปแบบภาษี VAT:</label>
                <select class="form-select" onchange="Modules.sales_setVatType(this.value)">
                  <option value="INCLUDE_VAT" ${cart.vatType === 'INCLUDE_VAT' ? 'selected' : ''}>รวม VAT 7% แล้ว (Include VAT)</option>
                  <option value="EXCLUDE_VAT" ${cart.vatType === 'EXCLUDE_VAT' ? 'selected' : ''}>ยังไม่รวม VAT 7% (Exclude VAT +7%)</option>
                  <option value="NO_VAT" ${cart.vatType === 'NO_VAT' ? 'selected' : ''}>ไม่มี VAT / บิลเงินสด (Non-VAT)</option>
                </select>
              </div>

              <div class="form-group mb-2">
                <label class="form-label" style="font-size: 0.8rem;">รูปแบบการจัดส่ง:</label>
                <select class="form-select" onchange="Modules.sales_setDeliveryMode(this.value)">
                  <option value="DELIVERY" ${cart.deliveryMode === 'DELIVERY' ? 'selected' : ''}>🚚 บริการจัดส่งไซต์งาน (คิดตามระยะทาง)</option>
                  <option value="SELF_PICKUP" ${cart.deliveryMode === 'SELF_PICKUP' ? 'selected' : ''}>🏪 รับเองหน้าร้าน (Store Self-Pickup - ฟรีค่าจัดส่ง)</option>
                </select>
              </div>

              ${cart.deliveryMode === 'DELIVERY' ? `
                <div class="form-group mb-2">
                  <label class="form-label" style="font-size: 0.8rem;">ระยะทางจัดส่ง (กม.):</label>
                  <input type="number" class="form-control" value="${cart.distanceKm}" min="0" onchange="Modules.sales_setDistance(this.value)">
                </div>
              ` : ''}

              <!-- Customer Payment Method -->
              <div class="form-group mb-0">
                <label class="form-label" style="font-size: 0.8rem; color: #67e8f9; font-weight: 700;">💳 วิธีการชำระเงินของลูกค้า:</label>
                <select class="form-select" onchange="Modules.sales_setPaymentMethod(this.value)">
                  <option value="CASH" ${cart.paymentMethod === 'CASH' ? 'selected' : ''}>💵 เงินสด (Cash)</option>
                  <option value="BANK_TRANSFER" ${cart.paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}>📲 โอนเงินผ่านธนาคาร (Bank Transfer)</option>
                </select>
              </div>
            </div>

            <!-- Grand Totals Summary Box -->
            <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid #06b6d4; padding: 10px; border-radius: 8px; margin-bottom: 12px; font-size: 0.88rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>ราคาสินค้ารวม:</span>
                <span>฿${AppEngine.formatCurrency(subtotal)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>ภาษี VAT (7%):</span>
                <span>฿${AppEngine.formatCurrency(vatAmount)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>ค่าจัดส่ง:</span>
                <span>฿${AppEngine.formatCurrency(deliveryFee)}</span>
              </div>
              <hr style="border-color: rgba(255,255,255,0.1); margin: 6px 0;">
              <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 700; color: #67e8f9;">
                <span>ราคารวมทั้งสิ้น:</span>
                <span>฿${AppEngine.formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <!-- 6 EXPANDED DOCUMENT OUTPUT OPTIONS -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <button class="btn btn-primary" onclick="Modules.sales_checkout('QUOTATION')">📄 1. พิมพ์ใบเสนอราคา (Quotation)</button>
              <button class="btn btn-success" onclick="Modules.sales_checkout('FULL_TAX_INVOICE')">🧾 2. พิมพ์ใบกำกับภาษีเต็มรูป (Tax Invoice)</button>
              <button class="btn btn-warning" onclick="Modules.sales_checkout('CASH_SALE_WITH_HEADER')">📝 3. พิมพ์บิลเงินสด (แบบมีหัวบิล 25 แถว)</button>
              <button class="btn btn-secondary" onclick="Modules.sales_checkout('CASH_SALE_NO_HEADER')">📋 4. พิมพ์บิลเงินสด (แบบไม่มีหัวบิล - หัวบิลสำเร็จรูป)</button>
              <button class="btn btn-primary" style="background: #3b82f6;" onclick="Modules.sales_checkout('DELIVERY_NOTE')">🚚 5. พิมพ์บิลใบส่งของ (เชื่อมเลขใบวางบิล & บิลอ้างอิง)</button>
              <button class="btn btn-secondary" style="background: #8b5cf6; color: #fff;" onclick="Modules.sales_checkout('BILLING_NOTE')">📑 6. พิมพ์ใบวางบิล (เชื่อมเลขบิลใบส่งของ & ใบแจ้งหนี้)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Modules.sales_changeCashier = function(id) { window.PosCart.selectedCashierId = id; };
window.Modules.sales_addItem = function(sku) {
  const p = window.AppStore.data.products.find(x => x.sku === sku);
  if (!p) return;
  const existing = window.PosCart.items.find(x => x.sku === sku);
  if (existing) existing.qty++;
  else window.PosCart.items.push({ sku: p.sku, name: p.name, price: p.price, unit: p.unit, qty: 1, weightKg: p.weightKg });
  AppEngine.loadModule('sales_pos');
};
window.Modules.sales_removeItem = function(idx) { window.PosCart.items.splice(idx, 1); AppEngine.loadModule('sales_pos'); };
window.Modules.sales_updateQty = function(idx, val) { const q = parseInt(val || 1); if (q > 0) window.PosCart.items[idx].qty = q; AppEngine.loadModule('sales_pos'); };
window.Modules.sales_setVatType = function(type) { window.PosCart.vatType = type; AppEngine.loadModule('sales_pos'); };
window.Modules.sales_setDeliveryMode = function(mode) { window.PosCart.deliveryMode = mode; AppEngine.loadModule('sales_pos'); };
window.Modules.sales_setDistance = function(km) { window.PosCart.distanceKm = parseFloat(km || 0); AppEngine.loadModule('sales_pos'); };
window.Modules.sales_setDeposit = function(amt) { window.PosCart.depositAmount = parseFloat(amt || 0); AppEngine.loadModule('sales_pos'); };
window.Modules.sales_setPaymentMethod = function(m) { window.PosCart.paymentMethod = m; AppEngine.loadModule('sales_pos'); };
window.Modules.sales_setBank = function(b) { window.PosCart.selectedBankId = b; AppEngine.loadModule('sales_pos'); };
window.Modules.sales_clearCart = function() { window.PosCart.items = []; AppEngine.loadModule('sales_pos'); };

function bahtText(num) {
  num = Math.round(num * 100) / 100;
  if (num === 0) return 'ศูนย์บาทถ้วน';
  const numbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  let [intStr, decStr] = num.toFixed(2).split('.');
  let res = '';
  const len = intStr.length;
  for (let i = 0; i < len; i++) {
    const digit = parseInt(intStr[i]);
    const pos = len - i - 1;
    if (digit !== 0) {
      if (pos === 1 && digit === 1) res += 'สิบ';
      else if (pos === 1 && digit === 2) res += 'ยี่สิบ';
      else if (pos === 0 && digit === 1 && len > 1) res += 'เอ็ด';
      else res += numbers[digit] + units[pos];
    }
  }
  res += 'บาท';
  if (parseInt(decStr) === 0) res += 'ถ้วน';
  else {
    const d1 = parseInt(decStr[0]);
    const d2 = parseInt(decStr[1]);
    if (d1 !== 0) res += (d1 === 1 ? 'สิบ' : d1 === 2 ? 'ยี่สิบ' : numbers[d1] + 'สิบ');
    if (d2 !== 0) res += (d2 === 1 && d1 !== 0 ? 'เอ็ด' : numbers[d2]);
    res += 'สตางค์';
  }
  return res;
}

window.Modules.sales_checkout = function(formType) {
  const store = window.AppStore.data;
  const company = store.companyInfo;
  const cart = window.PosCart;
  if (cart.items.length === 0) { AppEngine.showToast('ไม่มีรายการสินค้าในบิล', 'warning'); return; }

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = cart.deliveryMode === 'SELF_PICKUP' ? 0 : (cart.distanceKm <= 5 ? 0 : (cart.distanceKm - 5) * 15);
  let vatAmount = cart.vatType === 'EXCLUDE_VAT' ? subtotal * 0.07 : (cart.vatType === 'INCLUDE_VAT' ? subtotal * 7 / 107 : 0);
  const grandTotal = (cart.vatType === 'EXCLUDE_VAT' ? subtotal + vatAmount : subtotal) + deliveryFee;

  // Auto Stock Deduction
  cart.items.forEach(item => {
    const p = store.products.find(x => x.sku === item.sku);
    if (p) {
      p.stock = Math.max(0, p.stock - item.qty);
      store.stockLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString('th-TH'),
        sku: item.sku,
        productName: item.name,
        type: 'OUT_SALE',
        qty: -item.qty,
        balanceAfter: p.stock,
        actor: `${cart.selectedCashierId} (POS)`,
        note: `ออกเอกสาร (${formType})`
      });
    }
  });

  const cashier = store.cashiers.find(c => c.id === cart.selectedCashierId);
  if (cashier) cashier.totalToday += grandTotal;
  window.AppStore.save();

  const selectedBank = store.storeBankAccounts.find(b => b.id === cart.selectedBankId) || store.storeBankAccounts[0];
  
  // GENERATE LINKED CROSS-DOCUMENT REFERENCE NUMBERS
  const randomSerial = Math.floor(Math.random()*9000 + 1000);
  const docNo = `DN-2026-${randomSerial}`;               // Delivery Note Number
  const billingNoteNo = `BN-2026-${randomSerial}`;       // Linked Billing Note Number
  const taxInvoiceNo = `INV-2026-${randomSerial}`;       // Linked Tax Invoice Number
  const quotationNo = `QO-2026-${randomSerial}`;         // Linked Quotation Number
  const cashSaleNo = `CS-2026-${randomSerial}`;           // Linked Cash Sale Number

  const todayStr = new Date().toLocaleDateString('th-TH');
  const validUntilStr = new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString('th-TH');

  let documentHtml = '';

  // 1. QUOTATION (ใบเสนอราคา)
  if (formType === 'QUOTATION') {
    documentHtml = `
      <div class="printable-document" style="background: #fff; color: #000; padding: 25px; font-family: 'Prompt', sans-serif; font-size: 0.82rem; border: 1px solid #ccc;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 12px;">
          <div>
            <h1 style="font-size: 1.6rem; margin: 0; color: #111;">ใบเสนอราคา Quotation</h1>
            <div style="font-size: 0.85rem; color: #555;">( ต้นฉบับ / original )</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.1rem; font-weight: 700; color: #06b6d4;">🪵 ${company.name}</div>
            <div style="font-size: 0.75rem; color: #555;">${company.address}</div>
            <div style="font-size: 0.75rem; color: #555;">เลขผู้เสียภาษี: ${company.taxId}</div>
            <div style="font-size: 0.75rem; color: #555;">โทร. ${company.phones}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 15px; margin-bottom: 12px; background: #f9fafb; padding: 10px; border-radius: 6px;">
          <div>
            <div><strong>ลูกค้า / Customer:</strong> ${cart.customerName}</div>
            <div><strong>ที่อยู่ / Address:</strong> ${cart.customerAddress}</div>
            <div><strong>เลขผู้เสียภาษี / Tax ID:</strong> ${cart.customerTaxId}</div>
          </div>
          <div>
            <div><strong>เลขที่ / No.:</strong> <strong style="color: #06b6d4;">${quotationNo}</strong></div>
            <div><strong>อ้างอิงเลขที่ใบวางบิล:</strong> <strong style="color: #8b5cf6;">${billingNoteNo}</strong></div>
            <div><strong>อ้างอิงบิลใบส่งของ:</strong> <strong style="color: #3b82f6;">${docNo}</strong></div>
            <div><strong>วันที่ / Issue Date:</strong> ${todayStr}</div>
            <div><strong>ใช้ได้ถึง / Valid Until:</strong> ${validUntilStr}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;" border="1" borderColor="#ddd">
          <thead>
            <tr style="background: #f1f5f9; text-align: left;">
              <th style="padding: 6px;">รหัส (ID no.)</th>
              <th style="padding: 6px;">คำอธิบาย (Description)</th>
              <th style="padding: 6px; text-align: center;">จำนวน</th>
              <th style="padding: 6px; text-align: center;">หน่วย</th>
              <th style="padding: 6px; text-align: right;">ราคา/หน่วย</th>
              <th style="padding: 6px; text-align: right;">มูลค่าก่อนภาษี</th>
            </tr>
          </thead>
          <tbody>
            ${cart.items.map(item => `
              <tr>
                <td style="padding: 6px;">${item.sku}</td>
                <td style="padding: 6px;">${item.name}</td>
                <td style="padding: 6px; text-align: center;">${item.qty}</td>
                <td style="padding: 6px; text-align: center;">${item.unit}</td>
                <td style="padding: 6px; text-align: right;">฿${AppEngine.formatCurrency(item.price)}</td>
                <td style="padding: 6px; text-align: right;">฿${AppEngine.formatCurrency(item.price * item.qty)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-bottom: 15px;">
          <div style="border: 1px solid #ddd; padding: 8px; border-radius: 6px; font-size: 0.78rem;">
            <strong>หมายเหตุ:</strong> การจัดส่ง: ${cart.deliveryMode === 'SELF_PICKUP' ? 'รับเองหน้าร้าน' : 'ส่งไซต์งาน (' + cart.distanceKm + ' กม.)'}<br>
            วิธีชำระเงิน: ${cart.paymentMethod === 'CASH' ? 'เงินสด' : 'โอน ' + selectedBank.bankName + ' (' + selectedBank.accountNo + ')'}
          </div>
          <div style="border: 1px solid #ddd; padding: 8px; border-radius: 6px; font-size: 0.82rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>ราคาสินค้ารวม:</span>
              <span>฿${AppEngine.formatCurrency(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; border-top: 1px solid #000; margin-top: 4px; padding-top: 2px;">
              <span>จำนวนเงินรวมทั้งสิ้น:</span>
              <span>฿${AppEngine.formatCurrency(grandTotal)}</span>
            </div>
            <div style="text-align: right; font-weight: 600; color: #059669; font-size: 0.78rem;">(${bahtText(grandTotal)})</div>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #e2e8f0; margin-bottom: 15px;">
          🔍 <strong>การเชื่อมโยงระบบเอกสาร (Audit Link):</strong> ใบเสนอราคานี้เชื่อมต่ออ้างอิงล่วงหน้ากับ <strong>ใบวางบิล (${billingNoteNo})</strong> และ <strong>บิลใบส่งของ (${docNo})</strong>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 25px; text-align: center; font-size: 0.78rem;">
          <div>
            <div>..........................................................</div>
            <div>อนุมัติโดย / Approved by</div>
          </div>
          <div>
            <div>..........................................................</div>
            <div>ยอมรับใบเสนอราคา / Accepted by</div>
          </div>
          <div>
            <div>..........................................................</div>
            <div>จัดเตรียมโดย / Prepared by (${cart.selectedCashierId})</div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. FULL TAX INVOICE (ใบกำกับภาษีเต็มรูป)
  else if (formType === 'FULL_TAX_INVOICE') {
    documentHtml = `
      <div class="printable-document" style="background: #fff; color: #000; padding: 25px; font-family: 'Prompt', sans-serif; font-size: 0.82rem; border: 1px solid #ccc;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #06b6d4; padding-bottom: 8px; margin-bottom: 12px;">
          <div>
            <h2 style="margin: 0; color: #06b6d4; font-size: 1.4rem;">${company.name}</h2>
            <div style="font-size: 0.78rem; color: #444;">${company.address}</div>
            <div style="font-size: 0.78rem; color: #444;">เลขประจำตัวผู้เสียภาษี: <strong>${company.taxId}</strong></div>
            <div style="font-size: 0.78rem; color: #444;">โทรศัพท์: <strong>${company.phones}</strong></div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #111; font-size: 1.3rem; white-space: nowrap;">ใบกำกับภาษี / ต้นฉบับ</h2>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-bottom: 12px; background: #f8fafc; padding: 8px; border-radius: 6px;">
          <div>
            <div><strong>ลูกค้า:</strong> ${cart.customerName}</div>
            <div><strong>ที่อยู่:</strong> ${cart.customerAddress}</div>
            <div><strong>เลขผู้เสียภาษี:</strong> ${cart.customerTaxId}</div>
          </div>
          <div>
            <div><strong>เลขที่ใบกำกับภาษี:</strong> <strong style="color: #06b6d4;">${taxInvoiceNo}</strong></div>
            <div><strong>อ้างอิงเลขที่ใบวางบิล:</strong> <strong style="color: #8b5cf6;">${billingNoteNo}</strong></div>
            <div><strong>อ้างอิงบิลใบส่งของ:</strong> <strong style="color: #3b82f6;">${docNo}</strong></div>
            <div><strong>วันที่:</strong> ${todayStr}</div>
            <div><strong>ผู้ขาย:</strong> ${cart.selectedCashierId}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;" border="1" borderColor="#ddd">
          <thead>
            <tr style="background: #e2e8f0; text-align: left;">
              <th style="padding: 5px; text-align: center;">#</th>
              <th style="padding: 5px;">รายละเอียด</th>
              <th style="padding: 5px; text-align: center;">จำนวน</th>
              <th style="padding: 5px; text-align: right;">ราคาต่อหน่วย</th>
              <th style="padding: 5px; text-align: right;">มูลค่า</th>
            </tr>
          </thead>
          <tbody>
            ${cart.items.map((item, i) => `
              <tr>
                <td style="padding: 5px; text-align: center;">${i + 1}</td>
                <td style="padding: 5px;">[${item.sku}] ${item.name}</td>
                <td style="padding: 5px; text-align: center;">${item.qty} ${item.unit}</td>
                <td style="padding: 5px; text-align: right;">฿${AppEngine.formatCurrency(item.price)}</td>
                <td style="padding: 5px; text-align: right;">฿${AppEngine.formatCurrency(item.price * item.qty)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-bottom: 15px;">
          <div style="display: flex; align-items: center; justify-content: center; background: #f1f5f9; padding: 8px; border-radius: 6px; font-weight: 700; color: #0f172a;">
            (${bahtText(grandTotal)})
          </div>
          <div style="font-size: 0.82rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>รวมเป็นเงิน:</span>
              <span>฿${AppEngine.formatCurrency(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>ภาษีมูลค่าเพิ่ม 7%:</span>
              <span>฿${AppEngine.formatCurrency(vatAmount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.95rem; border-top: 1px solid #000; padding-top: 2px;">
              <span>จำนวนเงินรวมทั้งสิ้น:</span>
              <span>฿${AppEngine.formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #e2e8f0; margin-bottom: 15px;">
          🔍 <strong>การเชื่อมโยงระบบเอกสาร (Audit Link):</strong> ใบกำกับภาษีนี้ผูกกับ <strong>ใบวางบิล (${billingNoteNo})</strong> และ <strong>บิลใบส่งของ (${docNo})</strong>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 20px; text-align: center; font-size: 0.78rem;">
          <div>
            <div>......................................................</div>
            <div>ผู้รับสินค้า / บริการ</div>
          </div>
          <div>
            <div>......................................................</div>
            <div>ผู้อนุมัติ (${company.name})</div>
          </div>
        </div>
      </div>
    `;
  }

  // 3 & 4. CASH SALE (บิลเงินสด 25 แถว - มีหัวบิล vs ไม่มีหัวบิล)
  else if (formType === 'CASH_SALE_WITH_HEADER' || formType === 'CASH_SALE_NO_HEADER') {
    const hasHeader = formType === 'CASH_SALE_WITH_HEADER';
    const rows = [];
    for (let i = 0; i < 25; i++) {
      const item = cart.items[i];
      rows.push({
        sku: item ? item.sku : '',
        qty: item ? item.qty : '',
        desc: item ? item.name : '',
        price: item ? AppEngine.formatCurrency(item.price) : '',
        amount: item ? AppEngine.formatCurrency(item.price * item.qty) : ''
      });
    }

    documentHtml = `
      <div class="printable-document" style="background: #fff; color: #000; padding: 20px; font-family: 'Prompt', sans-serif; font-size: 0.78rem; border: 1px solid #ccc;">
        ${hasHeader ? `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <div style="font-size: 1.1rem; font-weight: 700;">${company.name}</div>
              <div style="font-size: 0.72rem;">${company.address}</div>
              <div style="font-size: 0.72rem;">เลขประจำตัวผู้เสียภาษี: ${company.taxId}</div>
              <div style="font-size: 0.72rem;">โทรศัพท์: ${company.phones}</div>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 1.3rem;">บิลเงินสด</h2>
              <div style="font-size: 0.75rem; color: #555;">CASHSALE / 現兌單</div>
              <div style="font-size: 0.75rem;">เล่มที่ ......... เลขที่ <strong>${cashSaleNo}</strong></div>
              <div style="font-size: 0.72rem; color: #666;">อ้างอิงใบวางบิล: <strong>${billingNoteNo}</strong> | ใบส่งของ: <strong>${docNo}</strong></div>
            </div>
          </div>
        ` : `
          <div style="text-align: right; margin-bottom: 6px;">
            <span style="font-size: 1.1rem; font-weight: 700;">บิลเงินสด (CASHSALE)</span> | เลขที่ <strong>${cashSaleNo}</strong> (อ้างอิงใบวางบิล: ${billingNoteNo})
          </div>
        `}

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 8px; margin-bottom: 6px; border: 1px solid #888; padding: 6px;">
          <div>
            <div>นาม / CUSTOMER: <strong>${cart.customerName}</strong></div>
            <div>ที่อยู่ / ADDRESS: <strong>${cart.customerAddress}</strong></div>
          </div>
          <div>
            <div>วันที่ / DATE: <strong>${todayStr}</strong></div>
            <div>เลขผู้เสียภาษี / TAX ID: <strong>${cart.customerTaxId}</strong></div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px;" border="1" borderColor="#777">
          <thead>
            <tr style="background: #f1f5f9; text-align: center; font-weight: 700; height: 24px;">
              <th style="width: 12%;">รหัส (SKU)</th>
              <th style="width: 8%;">จำนวน</th>
              <th style="width: 52%;">รายการ (DESCRIPTION)</th>
              <th style="width: 14%;">หน่วยละ</th>
              <th style="width: 14%;">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr style="height: 19px;">
                <td style="padding: 1px 4px; text-align: center; font-size: 0.72rem;">${r.sku}</td>
                <td style="padding: 1px 4px; text-align: center;">${r.qty}</td>
                <td style="padding: 1px 4px; font-size: 0.75rem;">${r.desc}</td>
                <td style="padding: 1px 4px; text-align: right;">${r.price}</td>
                <td style="padding: 1px 4px; text-align: right;">${r.amount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid #777; padding: 6px;">
          <div style="font-weight: 600;">
            ผู้รับเงิน / COLLECTOR: ................................................
          </div>
          <div style="font-weight: 700; font-size: 0.95rem;">
            รวมเงิน / TOTAL: <span style="text-decoration: underline; margin-left: 8px;">฿${AppEngine.formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 5. DELIVERY NOTE (บิลใบส่งของ - WITH LINKED BILLING NOTE REFERENCE)
  else if (formType === 'DELIVERY_NOTE') {
    documentHtml = `
      <div class="printable-document" style="background: #fff; color: #000; padding: 25px; font-family: 'Prompt', sans-serif; font-size: 0.82rem; border: 1px solid #ccc;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 12px;">
          <div>
            <h2 style="margin: 0; color: #3b82f6; font-size: 1.4rem;">${company.name}</h2>
            <div style="font-size: 0.78rem; color: #444;">${company.address}</div>
            <div style="font-size: 0.78rem; color: #444;">เลขประจำตัวผู้เสียภาษี: ${company.taxId}</div>
            <div style="font-size: 0.78rem; color: #444;">โทรศัพท์: ${company.phones}</div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #111; font-size: 1.3rem;">ใบส่งของ / Delivery Note</h2>
            <div style="font-size: 0.85rem; color: #3b82f6; font-weight: 700;">เลขที่บิลใบส่งของ: <strong>${docNo}</strong></div>
          </div>
        </div>

        <!-- Linked Document Audit Reference Box -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; margin-bottom: 12px; background: #eff6ff; padding: 10px; border-radius: 6px; border: 1px solid #bfdbfe;">
          <div>
            <div><strong>สถานที่จัดส่ง:</strong> ${cart.customerName}</div>
            <div><strong>ที่อยู่จัดส่ง:</strong> ${cart.customerAddress}</div>
            <div><strong>ระยะทางจัดส่ง:</strong> ${cart.deliveryMode === 'SELF_PICKUP' ? 'รับเองหน้าร้าน' : cart.distanceKm + ' กม.'}</div>
          </div>
          <div>
            <div><strong>🔗 อ้างอิงเลขที่ใบวางบิล:</strong> <strong style="color: #8b5cf6; font-size: 0.9rem;">${billingNoteNo}</strong></div>
            <div><strong>📄 อ้างอิงใบกำกับภาษี / บิล:</strong> <strong style="color: #06b6d4;">${taxInvoiceNo}</strong></div>
            <div><strong>📝 อ้างอิงใบเสนอราคา:</strong> ${quotationNo}</div>
            <div><strong>วันที่ส่งของ:</strong> ${todayStr}</div>
          </div>
        </div>

        <!-- Delivery Line Items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;" border="1" borderColor="#ddd">
          <thead>
            <tr style="background: #dbeafe; text-align: left;">
              <th style="padding: 6px; text-align: center;">ลำดับ</th>
              <th style="padding: 6px;">รหัสสินค้า SKU</th>
              <th style="padding: 6px;">รายการสินค้าที่จัดส่ง</th>
              <th style="padding: 6px; text-align: center;">จำนวนส่ง</th>
              <th style="padding: 6px; text-align: center;">หน่วย</th>
            </tr>
          </thead>
          <tbody>
            ${cart.items.map((item, i) => `
              <tr>
                <td style="padding: 6px; text-align: center;">${i + 1}</td>
                <td style="padding: 6px; font-weight: 600;">${item.sku}</td>
                <td style="padding: 6px;">${item.name}</td>
                <td style="padding: 6px; text-align: center; font-weight: 700;">${item.qty}</td>
                <td style="padding: 6px; text-align: center;">${item.unit}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Audit Traceability Footer Note -->
        <div style="background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 0.78rem; border: 1px solid #cbd5e1; margin-bottom: 20px;">
          🔍 <strong>การสืบย้อนข้อมูลการซื้อขาย (Audit Traceability):</strong><br>
          บิลใบส่งของฉบับนี้ถูกเชื่อมโยงระบบย้อนหลังกับ <strong>ใบวางบิล เลขที่ ${billingNoteNo}</strong> และ <strong>ใบกำกับภาษี/ใบแจ้งหนี้ เลขที่ ${taxInvoiceNo}</strong> สามารถใช้ตรวจสอบประวัติการซื้อขาย รายการวัสดุ และยอดชำระเงินย้อนหลังได้ 100%
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 25px; text-align: center; font-size: 0.78rem;">
          <div>
            <div>......................................................</div>
            <div>ผู้รับสินค้า ณ ไซต์งาน</div>
            <div>วันที่ ..... / ..... / .......</div>
          </div>
          <div>
            <div>......................................................</div>
            <div>พนักงานจัดส่งสินค้า (${company.name})</div>
            <div>วันที่ ..... / ..... / .......</div>
          </div>
        </div>
      </div>
    `;
  }

  // 6. BILLING NOTE (ใบวางบิล - WITH LINKED DELIVERY NOTE & TAX INVOICE REFERENCE)
  else {
    documentHtml = `
      <div class="printable-document" style="background: #fff; color: #000; padding: 25px; font-family: 'Prompt', sans-serif; font-size: 0.82rem; border: 1px solid #ccc;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 12px;">
          <div>
            <h2 style="margin: 0; color: #8b5cf6; font-size: 1.4rem;">${company.name}</h2>
            <div style="font-size: 0.78rem; color: #444;">${company.address}</div>
            <div style="font-size: 0.78rem; color: #444;">เลขประจำตัวผู้เสียภาษี: ${company.taxId}</div>
            <div style="font-size: 0.78rem; color: #444;">โทรศัพท์: ${company.phones}</div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #111; font-size: 1.3rem;">ใบวางบิล / Billing Note</h2>
            <div style="font-size: 0.85rem; color: #8b5cf6; font-weight: 700;">เลขที่ใบวางบิล: <strong>${billingNoteNo}</strong></div>
          </div>
        </div>

        <!-- Linked Metadata Block -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; margin-bottom: 12px; background: #f5f3ff; padding: 10px; border-radius: 6px; border: 1px solid #ddd6fe;">
          <div>
            <div><strong>วางบิลแก่:</strong> ${cart.customerName}</div>
            <div><strong>ที่อยู่:</strong> ${cart.customerAddress}</div>
            <div><strong>เลขผู้เสียภาษี:</strong> ${cart.customerTaxId}</div>
          </div>
          <div>
            <div><strong>🚚 อ้างอิงเลขที่บิลใบส่งของ:</strong> <strong style="color: #3b82f6; font-size: 0.9rem;">${docNo}</strong></div>
            <div><strong>🧾 อ้างอิงใบกำกับภาษี / บิล:</strong> <strong style="color: #06b6d4;">${taxInvoiceNo}</strong></div>
            <div><strong>วันที่วางบิล:</strong> ${todayStr}</div>
            <div><strong>กำหนดชำระเงิน:</strong> ${validUntilStr}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;" border="1" borderColor="#ddd">
          <thead>
            <tr style="background: #ede9fe; text-align: left;">
              <th style="padding: 6px; text-align: center;">#</th>
              <th style="padding: 6px;">รายการบิล & ใบส่งของ อ้างอิง</th>
              <th style="padding: 6px; text-align: center;">วันครบกำหนด</th>
              <th style="padding: 6px; text-align: right;">จำนวนเงินรวม</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; text-align: center;">1</td>
              <td style="padding: 6px;">
                <strong>บิลใบส่งของ เลขที่ ${docNo}</strong><br>
                <span style="font-size: 0.75rem; color: #475569;">(อ้างอิงใบกำกับภาษี ${taxInvoiceNo} - รายการวัสดุก่อสร้าง ${cart.items.length} รายการ)</span>
              </td>
              <td style="padding: 6px; text-align: center;">${validUntilStr}</td>
              <td style="padding: 6px; text-align: right; font-weight: 700;">฿${AppEngine.formatCurrency(grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 8px 12px; border-radius: 6px; margin-bottom: 15px;">
          <div>จำนวนเงินรวมทั้งสิ้น: <strong>(${bahtText(grandTotal)})</strong></div>
          <div style="font-size: 1.1rem; font-weight: 700; color: #8b5cf6;">฿${AppEngine.formatCurrency(grandTotal)}</div>
        </div>

        <div style="background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 0.78rem; border: 1px solid #cbd5e1; margin-bottom: 20px;">
          🔗 <strong>การเชื่อมโยงระบบ (Cross-Document Linking):</strong><br>
          ใบวางบิลเลขที่ <strong>${billingNoteNo}</strong> ผูกเชื่อมกับ <strong>บิลใบส่งของ เลขที่ ${docNo}</strong> และ <strong>ใบเสนอราคา ${quotationNo}</strong> ครบถ้วน
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 25px; text-align: center; font-size: 0.78rem;">
          <div>
            <div>......................................................</div>
            <div>ผู้วางบิล (${company.name})</div>
          </div>
          <div>
            <div>......................................................</div>
            <div>ผู้รับวางบิล / วันที่ชำระเงิน</div>
          </div>
        </div>
      </div>
    `;
  }

  AppEngine.openModal(`🧾 เอกสารทางการ - ${docNo}`, documentHtml, `
    <button class="btn btn-secondary" onclick="window.print()">🖨️ พิมพ์เอกสาร (Print PDF A4)</button>
    <button class="btn btn-primary" onclick="AppEngine.closeModal(); AppEngine.loadModule('sales_pos');">ปิดหน้าต่าง</button>
  `);

  window.PosCart.items = [];
  AppEngine.showToast(`สร้างเอกสารทางการ ${docNo} (ผูกกับใบวางบิล ${billingNoteNo}) เรียบร้อย!`, 'success');
};
