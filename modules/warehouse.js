// ==========================================
// Warehouse Management & Stock Control Module
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.Modules.warehouse = function() {
  const store = window.AppStore.data;
  const products = store.products || [];
  const logs = store.stockLogs || [];
  const user = store.currentUser;
  const isSupervisor = user.role === 'supervisor';

  return `
    <div class="warehouse-module">
      <!-- Role Permission Notice Banner -->
      <div class="card mb-4" style="background: ${isSupervisor ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; border-left: 4px solid ${isSupervisor ? '#10b981' : '#f59e0b'};">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; color: ${isSupervisor ? '#10b981' : '#f59e0b'}; margin-bottom: 4px;">
              🏭 สิทธิ์สลับบทบาท: ${user.name} (${isSupervisor ? 'Supervisor (แก้ไขต้นทุน & สต๊อกยอดยกมาได้)' : 'Cashier (คีย์รับเข้า & คีย์คืนได้เท่านั้น - ห้ามแก้ต้นทุน/สต๊อก)'})
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              ${isSupervisor 
                ? 'คุณอยู่ในสิทธิ์ Supervisor: สามารถแก้ไขราคาต้นทุน Lot และปรับสต๊อกยอดยกมาได้' 
                : 'ข้อกำหนดความปลอดภัย: Cashier สามารถคีย์รับเข้าและคืนสินค้าได้ แต่ไม่สามารถแก้ไขข้อมูลสต๊อกยอดยกมาหรือปรับราคาต้นทุน Lot ได้'}
            </p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="Modules.warehouse_openStockInModal('RETURN')">↩️ คีย์รับคืนสินค้า (Return Item)</button>
            <button class="btn btn-success" onclick="Modules.warehouse_openStockInModal('MANUAL')">➕ คีย์รับเข้าสินค้า (Stock Entry)</button>
          </div>
        </div>
      </div>

      <!-- Warehouse SKU Inventory Table -->
      <div class="card mb-4">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="card-title">🏭 คลังสินค้าคงเหลือ & ข้อมูล Lot ต้นทุน (Lot & Cost Control)</div>
          ${isSupervisor ? `
            <button class="btn btn-sm btn-primary" onclick="Modules.product_openAddSkuModal()">+ เพิ่ม SKU สินค้าใหม่</button>
          ` : ''}
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>SKU / รายการสินค้า</th>
                <th>ยี่ห้อ</th>
                <th>พิกัดจัดเก็บ (Bin)</th>
                <th>สต๊อกคงเหลือ</th>
                <th>สถานะสต๊อก</th>
                <th>ข้อมูล Lot ต้นทุน (Cost per Lot)</th>
                <th>แก้ไขราคาต้นทุน (Supervisor Only)</th>
              </tr>
            </thead>
            <tbody>
              ${products.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 40px;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📦</div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: #67e8f9;">ระบบคลังสินค้ายังว่างเปล่า (ไม่มี SKU สินค้า)</div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px; margin-bottom: 15px;">คลิกปุ่มด้านล่างเพื่อเริ่มลงรายการ SKU สินค้าแรกของร้าน</p>
                    <button class="btn btn-primary" onclick="Modules.product_openAddSkuModal()">+ เพิ่ม SKU สินค้าใหม่แรกเข้าคลัง</button>
                  </td>
                </tr>
              ` : ''}
              ${products.map(p => {
                const isLow = p.stock <= p.minStock;
                return `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: var(--accent-cyan-light);">${p.sku}</div>
                      <div style="font-size: 0.88rem;">${p.name}</div>
                    </td>
                    <td><span class="badge badge-info">${p.brand}</span></td>
                    <td><strong style="color: var(--accent-amber);">${p.binLocation || '-'}</strong></td>
                    <td style="font-weight: 700; font-size: 1.1rem; color: ${isLow ? 'var(--accent-rose)' : '#fff'};">
                      ${AppEngine.formatNumber(p.stock)} ${p.unit}
                    </td>
                    <td>
                      ${isLow ? '<span class="badge badge-danger">⚠️ สินค้าใกล้หมด</span>' : '<span class="badge badge-success">ปกติ</span>'}
                    </td>
                    <td>
                      <div style="font-size: 0.78rem;">
                        ${(p.lots || []).map(l => `
                          <div style="background: rgba(0,0,0,0.2); padding: 3px 6px; border-radius: 4px; margin-bottom: 3px; display: flex; justify-content: space-between; gap: 10px;">
                            <span>${l.lotNo}:</span>
                            <span style="color: #10b981; font-weight: 600;">฿${l.costPrice}/หน่วย (${l.qty} ${p.unit})</span>
                          </div>
                        `).join('')}
                      </div>
                    </td>
                    <td>
                      ${isSupervisor ? `
                        <button class="btn btn-sm btn-secondary" onclick="Modules.warehouse_openAdjustLotModal('${p.sku}')">✏️ แก้ไขราคาต้นทุน Lot</button>
                      ` : `
                        <span style="font-size: 0.75rem; color: var(--text-dim); font-style: italic;">🔒 ล็อก (Cashier ห้ามแก้ไขราคาต้นทุน)</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Stock Movement Log -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">📜 ประวัติเคลื่อนไหวสต๊อก (Stock Movement Audit Logs)</div>
        </div>

        <div class="table-responsive">
          <table class="custom-table" style="font-size: 0.85rem;">
            <thead>
              <tr>
                <th>เวลา</th>
                <th>SKU</th>
                <th>ประเภทรายการ</th>
                <th>จำนวน</th>
                <th>ยอดยกไป</th>
                <th>ผู้ทำรายการ</th>
                <th>หมายเหตุ / เหตุผลการคืน</th>
              </tr>
            </thead>
            <tbody>
              ${logs.length === 0 ? '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 25px;">ยังไม่มีประวัติการเคลื่อนไหวสต๊อก</td></tr>' : ''}
              ${logs.map(log => `
                <tr>
                  <td style="color: var(--text-dim);">${log.timestamp}</td>
                  <td style="font-weight: 600;">${log.sku}</td>
                  <td>
                    ${log.type === 'OUT_SALE' ? '<span class="badge badge-danger">ตัดขายหน้าร้าน</span>' : 
                      log.type === 'IN_RETURN' ? '<span class="badge badge-warning">รับคืนสินค้า</span>' : 
                      '<span class="badge badge-success">คีย์รับเข้าสินค้า</span>'}
                  </td>
                  <td style="font-weight: 700; color: ${log.qty > 0 ? '#10b981' : '#f43f5e'};">
                    ${log.qty > 0 ? `+${log.qty}` : log.qty}
                  </td>
                  <td>${log.balanceAfter}</td>
                  <td>${log.actor}</td>
                  <td style="color: var(--text-muted); font-style: italic;">${log.note}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// Stock Replenishment & Return Modal for Cashier & Supervisor
window.Modules.warehouse_openStockInModal = function(mode) {
  const store = window.AppStore.data;
  const products = store.products || [];

  if (products.length === 0) {
    AppEngine.openModal('⚠️ ระบบยังไม่มี SKU สินค้า', `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 2.5rem; margin-bottom: 10px;">📦</div>
        <h4 style="color: #67e8f9;">ระบบคลังสินค้ายังว่างเปล่า</h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">
          กรุณาเพิ่ม SKU สินค้าใหม่ของร้านก่อนทำรายการคีย์รับเข้าสต๊อก
        </p>
        <button class="btn btn-primary" onclick="AppEngine.closeModal(); Modules.product_openAddSkuModal();">
          + เพิ่ม SKU สินค้าใหม่เข้าคลัง
        </button>
      </div>
    `, '');
    return;
  }

  const html = `
    <div>
      <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid #06b6d4; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 0.85rem;">
        ${mode === 'RETURN' 
          ? '↩️ <strong>โหมดคีย์รับคืนสินค้าเข้าสต๊อก:</strong> กรุณาระบุหมายเหตุและสาเหตุการคืน' 
          : '➕ <strong>โหมดคีย์รับเข้าสินค้า:</strong> เลือกรหัส SKU สินค้า และระบุจำนวน/ราคาต้นทุนจริง'}
      </div>

      <div class="form-group">
        <label class="form-label">เลือกรหัสสินค้า (SKU): <span style="color: red;">*</span></label>
        <select class="form-select" id="stockin-sku-select" onchange="Modules.warehouse_onSkuSelectChange(this.value)">
          <option value="">-- กรุณาเลือกรหัส SKU สินค้า --</option>
          ${products.map(p => `<option value="${p.sku}">[${p.sku}] ${p.name} (คงเหลือ: ${p.stock} ${p.unit})</option>`).join('')}
        </select>
      </div>

      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div class="form-group">
          <label class="form-label">จำนวนที่ ${mode === 'RETURN' ? 'รับคืน' : 'รับเข้า'}: <span style="color: red;">*</span></label>
          <input type="number" id="stockin-qty" class="form-control" placeholder="กรอกจำนวน (เช่น 50)">
        </div>

        <div class="form-group">
          <label class="form-label">ราคาต้นทุนต่อหน่วย Lot นี้ (บาท): <span style="color: red;">*</span></label>
          <input type="number" id="stockin-cost" class="form-control" placeholder="กรอกราคาต้นทุนต่อหน่วย">
        </div>
      </div>

      <div class="form-group mb-0">
        <label class="form-label">หมายเหตุ / เหตุผลการ${mode === 'RETURN' ? 'รับคืน' : 'คีย์รับเข้า'}: <span style="color: red;">*</span></label>
        <input type="text" id="stockin-note" class="form-control" placeholder="${mode === 'RETURN' ? 'เช่น ลูกค้าซื้อเกิน ขอคืนสินค้าสภาพใหม่ 100%' : 'เช่น รับเข้าสินค้าจากการจัดซื้อ PO ล่าสุด'}">
      </div>
    </div>
  `;

  AppEngine.openModal(mode === 'RETURN' ? '↩️ คีย์รับคืนสินค้าเข้าสต๊อก (Return Stock)' : '➕ คีย์รับเข้าสินค้า (Stock Entry)', html, `
    <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ยกเลิก</button>
    <button class="btn btn-success" onclick="Modules.warehouse_submitStockIn('${mode}')">ยืนยันบันทึกสต๊อก</button>
  `);
};

window.Modules.warehouse_onSkuSelectChange = function(sku) {
  const p = window.AppStore.data.products.find(x => x.sku === sku);
  if (!p) return;
  const costInput = document.getElementById('stockin-cost');
  if (costInput && p.lots && p.lots.length > 0) {
    costInput.value = p.lots[p.lots.length - 1].costPrice || '';
  }
};

window.Modules.warehouse_submitStockIn = function(mode) {
  const store = window.AppStore.data;
  const sku = document.getElementById('stockin-sku-select')?.value;
  const qty = parseInt(document.getElementById('stockin-qty')?.value || 0);
  const cost = parseFloat(document.getElementById('stockin-cost')?.value || 0);
  const note = document.getElementById('stockin-note')?.value || '';

  if (!sku) {
    AppEngine.showToast('กรุณาเลือกรายการสินค้า SKU', 'danger');
    return;
  }

  if (qty <= 0) {
    AppEngine.showToast('กรุณาระบุจำนวนที่รับเข้าให้ถูกต้อง (ต้องมากกว่า 0)', 'danger');
    return;
  }

  if (!note.trim()) {
    AppEngine.showToast('กรุณาระบุหมายเหตุการรับคืน/คีย์รับเข้า', 'danger');
    return;
  }

  const p = store.products.find(x => x.sku === sku);
  if (!p) return;

  p.stock += qty;
  
  const newLotNo = `LOT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*90+10)}`;
  p.lots.push({
    lotNo: newLotNo,
    costPrice: cost,
    qty: qty,
    receiveDate: new Date().toISOString().slice(0,10)
  });

  const newLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleString('th-TH'),
    sku: sku,
    productName: p.name,
    type: mode === 'RETURN' ? 'IN_RETURN' : 'IN_MANUAL',
    qty: +qty,
    balanceAfter: p.stock,
    actor: `${store.currentUser.username} (${store.currentUser.name})`,
    note: note
  };
  store.stockLogs.unshift(newLog);

  window.AppStore.save();
  AppEngine.closeModal();
  AppEngine.showToast(`บันทึกรับเข้า/รับคืน ${p.name} จำนวน +${qty} ${p.unit} สำเร็จ!`, 'success');
  AppEngine.loadModule('warehouse');
};

// Supervisor Only Adjust Lot Modal
window.Modules.warehouse_openAdjustLotModal = function(sku) {
  const store = window.AppStore.data;
  if (store.currentUser.role !== 'supervisor') {
    AppEngine.showToast('สิทธิ์ไม่เพียงพอ! เฉพาะหัวหน้างาน (Supervisor) เท่านั้นที่แก้ไขราคาต้นทุนได้', 'danger');
    return;
  }

  const p = store.products.find(x => x.sku === sku);
  if (!p) return;

  const html = `
    <div>
      <h4 style="font-weight: 700; color: #67e8f9; margin-bottom: 10px;">[${p.sku}] ${p.name}</h4>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
        แก้ไขราคาต้นทุนเฉพาะ Lot (สิทธิ์หัวหน้างาน Supervisor)
      </p>

      <div class="table-responsive mb-3">
        <table class="custom-table" style="font-size: 0.82rem;">
          <thead>
            <tr>
              <th>เลขที่ Lot</th>
              <th>วันที่รับเข้า</th>
              <th>จำนวน</th>
              <th>ราคาต้นทุน (บาท/หน่วย)</th>
            </tr>
          </thead>
          <tbody>
            ${p.lots.map((l, index) => `
              <tr>
                <td style="font-weight: 600;">${l.lotNo}</td>
                <td>${l.receiveDate}</td>
                <td>${l.qty} ${p.unit}</td>
                <td>
                  <input type="number" class="form-control" id="lot-cost-input-${index}" value="${l.costPrice}" style="width: 110px;">
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  AppEngine.openModal(`✏️ แก้ไขราคาต้นทุน Lot - ${p.sku}`, html, `
    <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ยกเลิก</button>
    <button class="btn btn-primary" onclick="Modules.warehouse_saveAdjustLot('${sku}')">บันทึกการปรับต้นทุน</button>
  `);
};

window.Modules.warehouse_saveAdjustLot = function(sku) {
  const p = window.AppStore.data.products.find(x => x.sku === sku);
  if (!p) return;

  p.lots.forEach((l, index) => {
    const el = document.getElementById(`lot-cost-input-${index}`);
    if (el) l.costPrice = parseFloat(el.value || l.costPrice);
  });

  window.AppStore.save();
  AppEngine.closeModal();
  AppEngine.showToast(`ปรับปรุงราคาต้นทุนแต่ละ Lot ของ ${p.sku} สำเร็จ!`, 'success');
  AppEngine.loadModule('warehouse');
};
