// ==========================================
// Dynamic Product & SKU Master Catalog Module
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.Modules.product = function() {
  const store = window.AppStore.data;
  const products = store.products || [];
  const categories = store.categories || [];
  const user = store.currentUser;
  const isSupervisor = user.role === 'supervisor';

  const activeCategory = window.ActiveProductCategory || 'all';
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return `
    <div class="product-module">
      <!-- Top Action Bar -->
      <div class="card mb-4">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--accent-cyan-light);">📦 คลังข้อมูลสินค้า SKU Master (สินค้าทั้งหมด ${products.length} รายการ)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">จัดการเพิ่ม SKU สินค้าใหม่ แก้ไขราคา และปรับเปลี่ยนพิกัดจัดเก็บในคลัง</p>
          </div>

          <div style="display: flex; gap: 10px;">
            ${isSupervisor ? `
              <button class="btn btn-primary" onclick="Modules.product_openAddSkuModal()">+ เพิ่ม SKU สินค้าใหม่ (Add New SKU)</button>
            ` : `
              <span class="badge badge-warning" style="padding: 8px 12px;">🔒 สิทธิ์ Cashier ดูข้อมูล SKU ได้อย่างเดียว (Supervisor เท่านั้นที่เพิ่ม/แก้ไข SKU ได้)</span>
            `}
          </div>
        </div>

        <!-- Category Pills Bar -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
          ${categories.map(c => `
            <button class="btn btn-sm ${activeCategory === c.id ? 'btn-primary' : 'btn-secondary'}" onclick="Modules.product_filterCat('${c.id}')">
              ${c.icon} ${c.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- SKU Master Table Grid -->
      <div class="card">
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>รหัส SKU</th>
                <th>รูป / ไอคอน</th>
                <th>รายการสินค้า (Product Description)</th>
                <th>หมวดหมู่</th>
                <th>ยี่ห้อ</th>
                <th>ราคาขายหน้าร้าน</th>
                <th>สต๊อกคงเหลือ</th>
                <th>น้ำหนัก/หน่วย</th>
                <th>พิกัด Bin</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredProducts.length === 0 ? '<tr><td colspan="10" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบรายการสินค้าในหมวดนี้</td></tr>' : ''}
              ${filteredProducts.map(p => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${p.sku}</td>
                  <td style="font-size: 1.8rem; text-align: center;">${p.image || '📦'}</td>
                  <td>
                    <div style="font-weight: 700; font-size: 0.9rem;">${p.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${p.description || '-'}</div>
                  </td>
                  <td><span class="badge badge-info">${p.category}</span></td>
                  <td><strong style="color: var(--accent-amber);">${p.brand}</strong></td>
                  <td style="font-weight: 700; font-size: 1rem; color: #10b981;">฿${AppEngine.formatCurrency(p.price)}</td>
                  <td>
                    <span style="font-weight: 700; color: ${p.stock <= p.minStock ? 'var(--accent-rose)' : '#fff'};">
                      ${AppEngine.formatNumber(p.stock)} ${p.unit}
                    </span>
                    ${p.stock <= p.minStock ? '<br><span class="badge badge-danger">เตือนสต๊อกต่ำ</span>' : ''}
                  </td>
                  <td>${p.weightKg} กก.</td>
                  <td><strong style="color: #67e8f9;">📍 ${p.binLocation || '-'}</strong></td>
                  <td>
                    ${isSupervisor ? `
                      <div style="display: flex; gap: 5px;">
                        <button class="btn btn-sm btn-secondary" onclick="Modules.product_openEditSkuModal('${p.sku}')">✏️ แก้ไข</button>
                        <button class="btn btn-sm btn-danger" onclick="Modules.product_deleteSku('${p.sku}')">🗑️</button>
                      </div>
                    ` : `
                      <span style="font-size: 0.75rem; color: var(--text-dim);">🔒 อ่านอย่างเดียว</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

window.Modules.product_filterCat = function(catId) {
  window.ActiveProductCategory = catId;
  AppEngine.loadModule('product');
};

// ADD NEW SKU MODAL
window.Modules.product_openAddSkuModal = function() {
  const categories = window.AppStore.data.categories || [];
  const html = `
    <div>
      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div class="form-group">
          <label class="form-label">รหัส SKU สินค้า: <span style="color: red;">*</span></label>
          <input type="text" id="add-sku" class="form-control" placeholder="เช่น IRN-001, PIP-001, CEM-003">
        </div>
        <div class="form-group">
          <label class="form-label">ชื่อรายการสินค้า: <span style="color: red;">*</span></label>
          <input type="text" id="add-name" class="form-control" placeholder="เช่น เหล็กเส้นข้ออ้อย SD40 12 มม. ยาว 10 ม.">
        </div>
      </div>

      <div class="grid-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <div class="form-group">
          <label class="form-label">หมวดหมู่สินค้า:</label>
          <select id="add-category" class="form-select">
            ${categories.filter(c => c.id !== 'all').map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ยี่ห้อ / แบรนด์:</label>
          <input type="text" id="add-brand" class="form-control" value="น้ำเพชร">
        </div>
        <div class="form-group">
          <label class="form-label">หน่วยนับ:</label>
          <input type="text" id="add-unit" class="form-control" value="เส้น" placeholder="ถุง, เส้น, แผ่น, กล่อง, ม้วน">
        </div>
      </div>

      <div class="grid-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <div class="form-group">
          <label class="form-label">ราคาขายหน้าร้าน (บาท): <span style="color: red;">*</span></label>
          <input type="number" id="add-price" class="form-control" value="280">
        </div>
        <div class="form-group">
          <label class="form-label">ราคาต้นทุนตั้งต้น (บาท):</label>
          <input type="number" id="add-cost" class="form-control" value="210">
        </div>
        <div class="form-group">
          <label class="form-label">จำนวนสต๊อกตั้งต้น:</label>
          <input type="number" id="add-stock" class="form-control" value="500">
        </div>
      </div>

      <div class="grid-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <div class="form-group">
          <label class="form-label">เตือนสต๊อกต่ำ (Min Stock):</label>
          <input type="number" id="add-minstock" class="form-control" value="50">
        </div>
        <div class="form-group">
          <label class="form-label">น้ำหนักต่อหน่วย (กก.):</label>
          <input type="number" id="add-weight" class="form-control" value="8.88" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">พิกัดจัดเก็บ (Bin Location):</label>
          <input type="text" id="add-bin" class="form-control" value="S-01-01">
        </div>
      </div>

      <div class="form-group mb-0">
        <label class="form-label">คำอธิบายคุณสมบัติสินค้า:</label>
        <textarea id="add-desc" class="form-control" rows="2">เหล็กเส้นข้ออ้อย มาตรฐาน มอก. สำหรับงานโครงสร้างเสา-คานอาคารแข็งแรงทนทาน</textarea>
      </div>
    </div>
  `;

  AppEngine.openModal('📦 เพิ่ม SKU สินค้าใหม่เข้าคลังร้าน', html, `
    <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ยกเลิก</button>
    <button class="btn btn-primary" onclick="Modules.product_saveNewSku()">+ บันทึกเพิ่ม SKU สินค้าใหม่</button>
  `);
};

window.Modules.product_saveNewSku = function() {
  const store = window.AppStore.data;
  const sku = document.getElementById('add-sku')?.value?.trim();
  const name = document.getElementById('add-name')?.value?.trim();
  const category = document.getElementById('add-category')?.value;
  const brand = document.getElementById('add-brand')?.value || 'น้ำเพชร';
  const unit = document.getElementById('add-unit')?.value || 'ชิ้น';
  const price = parseFloat(document.getElementById('add-price')?.value || 0);
  const cost = parseFloat(document.getElementById('add-cost')?.value || 0);
  const stock = parseInt(document.getElementById('add-stock')?.value || 0);
  const minStock = parseInt(document.getElementById('add-minstock')?.value || 20);
  const weight = parseFloat(document.getElementById('add-weight')?.value || 1.0);
  const bin = document.getElementById('add-bin')?.value || 'A-01';
  const desc = document.getElementById('add-desc')?.value || '';

  if (!sku || !name || price <= 0) {
    AppEngine.showToast('กรุณาระบุรหัส SKU, ชื่อสินค้า และราคาขายให้ถูกต้อง', 'danger');
    return;
  }

  if (store.products.find(x => x.sku === sku)) {
    AppEngine.showToast(`รหัส SKU ${sku} มีอยู่ในระบบแล้ว! กรุณาใช้รหัสอื่น`, 'warning');
    return;
  }

  const newProduct = {
    sku: sku,
    name: name,
    category: category,
    brand: brand,
    price: price,
    unit: unit,
    stock: stock,
    minStock: minStock,
    weightKg: weight,
    binLocation: bin,
    image: '📦',
    unitsSoldMonth: 0,
    totalSalesMonth: 0,
    marginPercent: cost > 0 ? ((price - cost) / price * 100) : 25.0,
    description: desc,
    lots: [
      { lotNo: `LOT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-01`, costPrice: cost, qty: stock, receiveDate: new Date().toISOString().slice(0,10) }
    ]
  };

  store.products.unshift(newProduct);
  window.AppStore.save();
  AppEngine.closeModal();
  AppEngine.showToast(`เพิ่ม SKU สินค้าใหม่ [${sku}] ${name} สำเร็จ!`, 'success');
  AppEngine.loadModule('product');
};

// EDIT SKU MODAL
window.Modules.product_openEditSkuModal = function(sku) {
  const store = window.AppStore.data;
  const p = store.products.find(x => x.sku === sku);
  if (!p) return;

  const html = `
    <div>
      <div class="form-group">
        <label class="form-label">รหัส SKU (แก้ไขไม่ได้):</label>
        <input type="text" class="form-control" value="${p.sku}" disabled style="background: rgba(255,255,255,0.05);">
      </div>

      <div class="form-group">
        <label class="form-label">ชื่อรายการสินค้า:</label>
        <input type="text" id="edit-name" class="form-control" value="${p.name}">
      </div>

      <div class="grid-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <div class="form-group">
          <label class="form-label">ราคาขาย (บาท):</label>
          <input type="number" id="edit-price" class="form-control" value="${p.price}">
        </div>
        <div class="form-group">
          <label class="form-label">หน่วยนับ:</label>
          <input type="text" id="edit-unit" class="form-control" value="${p.unit}">
        </div>
        <div class="form-group">
          <label class="form-label">ยี่ห้อ:</label>
          <input type="text" id="edit-brand" class="form-control" value="${p.brand}">
        </div>
      </div>

      <div class="grid-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <div class="form-group">
          <label class="form-label">จำนวนสต๊อกคงเหลือ:</label>
          <input type="number" id="edit-stock" class="form-control" value="${p.stock}">
        </div>
        <div class="form-group">
          <label class="form-label">เตือนสต๊อกต่ำ:</label>
          <input type="number" id="edit-minstock" class="form-control" value="${p.minStock}">
        </div>
        <div class="form-group">
          <label class="form-label">พิกัด Bin Location:</label>
          <input type="text" id="edit-bin" class="form-control" value="${p.binLocation}">
        </div>
      </div>

      <div class="form-group mb-0">
        <label class="form-label">คำอธิบายเพิ่มเติม:</label>
        <textarea id="edit-desc" class="form-control" rows="2">${p.description || ''}</textarea>
      </div>
    </div>
  `;

  AppEngine.openModal(`✏️ แก้ไขข้อมูล SKU - ${p.sku}`, html, `
    <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ยกเลิก</button>
    <button class="btn btn-primary" onclick="Modules.product_saveEditSku('${p.sku}')">บันทึกการแก้ไข</button>
  `);
};

window.Modules.product_saveEditSku = function(sku) {
  const store = window.AppStore.data;
  const p = store.products.find(x => x.sku === sku);
  if (!p) return;

  p.name = document.getElementById('edit-name')?.value || p.name;
  p.price = parseFloat(document.getElementById('edit-price')?.value || p.price);
  p.unit = document.getElementById('edit-unit')?.value || p.unit;
  p.brand = document.getElementById('edit-brand')?.value || p.brand;
  p.stock = parseInt(document.getElementById('edit-stock')?.value || p.stock);
  p.minStock = parseInt(document.getElementById('edit-minstock')?.value || p.minStock);
  p.binLocation = document.getElementById('edit-bin')?.value || p.binLocation;
  p.description = document.getElementById('edit-desc')?.value || p.description;

  window.AppStore.save();
  AppEngine.closeModal();
  AppEngine.showToast(`แก้ไขข้อมูล SKU [${sku}] สำเร็จ!`, 'success');
  AppEngine.loadModule('product');
};

// DELETE SKU
window.Modules.product_deleteSku = function(sku) {
  const store = window.AppStore.data;
  const idx = store.products.findIndex(x => x.sku === sku);
  if (idx === -1) return;

  if (confirm(`คุณต้องการลบ SKU [${sku}] ออกจากระบบคลังสินค้าใช่หรือไม่?`)) {
    store.products.splice(idx, 1);
    window.AppStore.save();
    AppEngine.showToast(`ลบ SKU [${sku}] เรียบร้อยแล้ว`, 'info');
    AppEngine.loadModule('product');
  }
};
