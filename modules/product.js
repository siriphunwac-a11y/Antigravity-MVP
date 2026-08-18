// ==========================================
// Product Management & Comparison Module
// ==========================================

window.Modules = window.Modules || {};

window.Modules.product = function() {
  const store = window.AppStore.data;
  const products = store.products || [];
  const categories = store.categories || [];

  return `
    <div class="product-module">
      <!-- Search & Filters -->
      <div class="card mb-4" style="margin-bottom: 20px;">
        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 10px; flex: 1; min-width: 300px;">
            <input type="text" id="product-search-input" class="form-control" placeholder="🔍 ค้นหาสินค้า SKU, ชื่อสินค้า, ยี่ห้อ..." oninput="Modules.product_filter()">
            <select id="product-category-select" class="form-select" style="max-width: 220px;" onchange="Modules.product_filter()">
              <option value="ALL">หมวดหมู่ทั้งหมด</option>
              ${categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>
          
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="Modules.product_openComparisonModal()">📊 เปรียบเทียบสินค้า</button>
            <button class="btn btn-primary" onclick="Modules.product_openUsageCalcModal()">🧮 เครื่องคำนวณการใช้งานต่อหน่วย</button>
          </div>
        </div>
      </div>

      <!-- Product List Grid -->
      <div class="grid-3" id="product-cards-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        ${products.map(p => `
          <div class="card product-item-card" data-category="${p.category}" data-search="${p.name.toLowerCase()} ${p.sku.toLowerCase()} ${p.brand.toLowerCase()}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <span style="font-size: 2.5rem;">${p.image}</span>
              <span class="badge badge-info">${p.brand}</span>
            </div>
            
            <div style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">SKU: ${p.sku} | Location: ${p.binLocation}</div>
            <h3 style="font-size: 1rem; font-weight: 600; margin: 6px 0; height: 48px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              ${p.name}
            </h3>
            
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px; height: 36px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              ${p.description}
            </p>

            <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                <span style="color: var(--text-muted);">คงเหลือ Real-time:</span>
                <span style="font-weight: 700; color: ${p.stock <= p.minStock ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                  ${AppEngine.formatNumber(p.stock)} ${p.unit}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span style="color: var(--text-muted);">น้ำหนักต่อหน่วย:</span>
                <span>${p.weightKg} กิโลกรัม</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted);">ราคาขาย</span>
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-cyan-light);">฿${AppEngine.formatCurrency(p.price)} / ${p.unit}</div>
              </div>
              
              <button class="btn btn-sm btn-primary" onclick="Modules.product_addToCart('${p.sku}')">+ เพิ่มใส่ POS / ใบเสนอราคา</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// Filter Products
window.Modules.product_filter = function() {
  const query = (document.getElementById('product-search-input')?.value || '').toLowerCase();
  const cat = document.getElementById('product-category-select')?.value || 'ALL';

  document.querySelectorAll('.product-item-card').forEach(card => {
    const cardCat = card.dataset.category;
    const cardSearch = card.dataset.search;

    const matchesCat = (cat === 'ALL' || cardCat === cat);
    const matchesSearch = cardSearch.includes(query);

    card.style.display = (matchesCat && matchesSearch) ? 'block' : 'none';
  });
};

// Open Product Comparison Modal
window.Modules.product_openComparisonModal = function() {
  const products = window.AppStore.data.products;
  const p1 = products[0];
  const p2 = products[1];

  const html = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
        <div style="font-size: 2rem;">${p1.image}</div>
        <h4 style="font-size: 1rem; font-weight: 700;">${p1.name}</h4>
        <p style="color: var(--accent-cyan-light); font-weight: 700; font-size: 1.2rem;">฿${AppEngine.formatCurrency(p1.price)} / ${p1.unit}</p>
        <ul style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px; list-style: none;">
          <li>• แบรนด์: ${p1.brand}</li>
          <li>• น้ำหนัก: ${p1.weightKg} กก.</li>
          <li>• ตำแหน่งคลัง: ${p1.binLocation}</li>
          <li>• สต๊อกคงเหลือ: ${p1.stock} ${p1.unit}</li>
        </ul>
      </div>

      <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
        <div style="font-size: 2rem;">${p2.image}</div>
        <h4 style="font-size: 1rem; font-weight: 700;">${p2.name}</h4>
        <p style="color: var(--accent-cyan-light); font-weight: 700; font-size: 1.2rem;">฿${AppEngine.formatCurrency(p2.price)} / ${p2.unit}</p>
        <ul style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px; list-style: none;">
          <li>• แบรนด์: ${p2.brand}</li>
          <li>• น้ำหนัก: ${p2.weightKg} กก.</li>
          <li>• ตำแหน่งคลัง: ${p2.binLocation}</li>
          <li>• สต๊อกคงเหลือ: ${p2.stock} ${p2.unit}</li>
        </ul>
      </div>
    </div>
  `;

  AppEngine.openModal('📊 เปรียบเทียบคุณสมบัติสินค้า (Product Comparison)', html, '<button class="btn btn-secondary" onclick="AppEngine.closeModal()">ปิดหน้าต่าง</button>');
};

// Open Unit Usage Estimator Modal
window.Modules.product_openUsageCalcModal = function() {
  const html = `
    <div>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 15px;">
        เครื่องมือคำนวณประมาณการใช้งานวัสดุเบื้องต้นสำหรับช่างและเจ้าของบ้าน
      </p>
      
      <div class="form-group">
        <label class="form-label">เลือกประเภทงานที่ต้องการคำนวณ:</label>
        <select id="usage-type" class="form-select" onchange="Modules.product_calcUsage()">
          <option value="WALL_BRICK">งานก่อผนังอิฐมอญ / อิฐมวลเบา (ตร.ม.)</option>
          <option value="CONCRETE_POUR">งานเทพื้นคอนกรีตหนา 10 ซม. (ตร.ม.)</option>
          <option value="ROOF_COVER">งานมุงหลังคาบ้าน (ตร.ม.)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">ระบุพื้นที่ทั้งหมด (ตารางเมตร):</label>
        <input type="number" id="usage-sqm" class="form-control" value="50" oninput="Modules.product_calcUsage()">
      </div>

      <div id="calc-result-box" style="background: rgba(6, 182, 212, 0.1); border: 1px solid #06b6d4; padding: 15px; border-radius: 8px; margin-top: 15px;">
        <!-- Computed results -->
      </div>
    </div>
  `;

  AppEngine.openModal('🧮 เครื่องคำนวณปริมาณการใช้งานต่อหน่วย', html, '<button class="btn btn-secondary" onclick="AppEngine.closeModal()">ปิด</button>');
  setTimeout(() => window.Modules.product_calcUsage(), 100);
};

window.Modules.product_calcUsage = function() {
  const type = document.getElementById('usage-type')?.value;
  const sqm = parseFloat(document.getElementById('usage-sqm')?.value || 0);
  const resultBox = document.getElementById('calc-result-box');
  if (!resultBox) return;

  if (type === 'WALL_BRICK') {
    const brickRed = Math.ceil(sqm * 120);
    const brickQcon = Math.ceil(sqm * 8.33);
    const cementBag = (sqm * 0.35).toFixed(1);
    resultBox.innerHTML = `
      <h5 style="font-size: 0.95rem; font-weight: 700; color: #67e8f9; margin-bottom: 8px;">ผลการคำนวณสำหรับพื้นที่ก่อผนัง ${sqm} ตร.ม.:</h5>
      <ul style="font-size: 0.88rem; color: #fff; line-height: 1.6;">
        <li>• หากใช้อิฐมอญแดง: <strong>${AppEngine.formatNumber(brickRed)} ก้อน</strong> + ปูนก่อ <strong>${cementBag} ถุง</strong></li>
        <li>• หากใช้อิฐมวลเบา Q-CON: <strong>${AppEngine.formatNumber(brickQcon)} ก้อน</strong> + ปูนก่อ <strong>${(sqm*0.15).toFixed(1)} ถุง</strong></li>
      </ul>
    `;
  } else if (type === 'CONCRETE_POUR') {
    const cuM = (sqm * 0.10).toFixed(2); // 10 cm thickness
    const cementBags = Math.ceil(cuM * 7); // ~7 bags per cu.m
    resultBox.innerHTML = `
      <h5 style="font-size: 0.95rem; font-weight: 700; color: #67e8f9; margin-bottom: 8px;">ผลการคำนวณงานเทพื้นหนา 10 ซม. พื้นที่ ${sqm} ตร.ม.:</h5>
      <ul style="font-size: 0.88rem; color: #fff; line-height: 1.6;">
        <li>• ปริมาตรคอนกรีตที่ต้องใช้: <strong>${cuM} คิว (คิวบิกเมตร)</strong></li>
        <li>• หรือใช้ปูนโครงสร้างผสมเอง: <strong>${cementBags} ถุง</strong> (ทราย 0.5 คิว, หิน 0.9 คิว)</li>
      </ul>
    `;
  } else {
    const doubleTile = Math.ceil(sqm * 2.2);
    const concreteTile = Math.ceil(sqm * 11);
    resultBox.innerHTML = `
      <h5 style="font-size: 0.95rem; font-weight: 700; color: #67e8f9; margin-bottom: 8px;">ผลการคำนวณกระเบื้องหลังคา พื้นที่ ${sqm} ตร.ม.:</h5>
      <ul style="font-size: 0.88rem; color: #fff; line-height: 1.6;">
        <li>• กระเบื้องหลังคาลอนคู่ SCG: <strong>${AppEngine.formatNumber(doubleTile)} แผ่น</strong></li>
        <li>• กระเบื้องคอนกรีต ซีแพค: <strong>${AppEngine.formatNumber(concreteTile)} แผ่น</strong></li>
      </ul>
    `;
  }
};

window.Modules.product_addToCart = function(sku) {
  const p = window.AppStore.data.products.find(x => x.sku === sku);
  if (!p) return;
  AppEngine.showToast(`เพิ่ม ${p.name} เข้าสู่ตะกร้าสินค้าสำเร็จ!`, 'success');
};
