// ==========================================
// Construction Calculator & Auto-BOQ Module
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.Modules.boq_calculator = function() {
  return `
    <div class="boq-module">
      <!-- Top Auto BOQ Generator Header Card -->
      <div class="card mb-4" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15)); border: 1px solid rgba(16, 185, 129, 0.3);">
        <div class="card-header">
          <div class="card-title" style="color: #10b981;">
            <span>🧮</span> ระบบ Auto-BOQ คำนวณวัสดุบ้าน ไม้ฝา ไม้พื้น ยิปซั่ม กระเบื้อง เสารั้ว & ลวดหนาม
          </div>
          <span class="badge badge-success">คำนวณละเอียด 100%</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 15px;">
          กรอกขนาดบ้าน ความสูง ด้านผนัง เลือกวัสดุผนัง (ไม้ฝา/ยิปซั่ม/สมาร์ทบอร์ด) พื้น (ไม้พื้น/กระเบื้อง) และคำนวณลวดหนามเสารั้วรอบบ้าน
        </p>

        <!-- Section 1: House Structural & Wall/Floor Dimensions -->
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #67e8f9; margin-bottom: 10px;">🏠 1. คำนวณตัวบ้าน, ผนังไม้ฝา/ยิปซั่ม และพื้นกระเบื้อง/ไม้พื้น:</h4>
        <div class="grid-4 mb-3" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
          <div>
            <label class="form-label">กว้าง (ม.):</label>
            <input type="number" id="boq-width" class="form-control" value="10" min="1" oninput="Modules.boq_recalculate()">
          </div>
          <div>
            <label class="form-label">ยาว (ม.):</label>
            <input type="number" id="boq-length" class="form-control" value="12" min="1" oninput="Modules.boq_recalculate()">
          </div>
          <div>
            <label class="form-label">สูง (ม.):</label>
            <input type="number" id="boq-height" class="form-control" value="3.5" step="0.1" min="2" oninput="Modules.boq_recalculate()">
          </div>
          <div>
            <label class="form-label">จำนวนชั้น:</label>
            <input type="number" id="boq-floors" class="form-control" value="2" min="1" max="5" oninput="Modules.boq_recalculate()">
          </div>
          <div>
            <label class="form-label">ด้านผนัง:</label>
            <select id="boq-sides" class="form-select" onchange="Modules.boq_recalculate()">
              <option value="4">4 ด้าน (มาตรฐาน)</option>
              <option value="6">6 ด้าน (L-Shape)</option>
              <option value="8">8 ด้าน (U-Shape)</option>
            </select>
          </div>
        </div>

        <div class="grid-2 mb-3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <!-- Wall Material Selection -->
          <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px;">
            <label class="form-label" style="color: #67e8f9; font-weight: 700;">🧱 วัสดุก่อผนัง (Wall Material):</label>
            <select id="boq-wall-type" class="form-select mb-2" onchange="Modules.boq_toggleMaterialSpecs(); Modules.boq_recalculate();">
              <option value="WOOD_BOARD">ไม้ฝาเฌอร่า/SCG (ระบุหน้ากว้าง x ยาว)</option>
              <option value="GYPSUM">แผ่นยิปซั่ม / สมาร์ทบอร์ด (120x240 ซม.)</option>
              <option value="BRK_QCON">อิฐมวลเบา Q-CON</option>
              <option value="BRK_RED">อิฐมอญแดง 4 รู</option>
            </select>

            <div id="spec-wood-wall" style="display: flex; gap: 10px;">
              <div>
                <label class="form-label" style="font-size: 0.75rem;">หน้ากว้างไม้ฝา (ซม.):</label>
                <input type="number" id="wood-wall-w" class="form-control" value="15" oninput="Modules.boq_recalculate()">
              </div>
              <div>
                <label class="form-label" style="font-size: 0.75rem;">ความยาวไม้ฝา (ซม.):</label>
                <input type="number" id="wood-wall-l" class="form-control" value="300" oninput="Modules.boq_recalculate()">
              </div>
            </div>
          </div>

          <!-- Floor Material Selection -->
          <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px;">
            <label class="form-label" style="color: #10b981; font-weight: 700;">🪵 วัสดุปูพื้น (Floor Material):</label>
            <select id="boq-floor-type" class="form-select mb-2" onchange="Modules.boq_toggleMaterialSpecs(); Modules.boq_recalculate();">
              <option value="WOOD_FLOOR">ไม้พื้นสังเคราะห์ (ระบุหน้ากว้าง x ยาว)</option>
              <option value="TILE">กระเบื้องปูพื้น (ระบุขนาดกระเบื้อง)</option>
              <option value="CONCRETE">พื้นคอนกรีตขัดมัน</option>
            </select>

            <div id="spec-wood-floor" style="display: flex; gap: 10px;">
              <div>
                <label class="form-label" style="font-size: 0.75rem;">หน้ากว้างไม้พื้น (ซม.):</label>
                <input type="number" id="wood-floor-w" class="form-control" value="20" oninput="Modules.boq_recalculate()">
              </div>
              <div>
                <label class="form-label" style="font-size: 0.75rem;">ความยาวไม้พื้น (ซม.):</label>
                <input type="number" id="wood-floor-l" class="form-control" value="300" oninput="Modules.boq_recalculate()">
              </div>
            </div>

            <div id="spec-tile-floor" style="display: none; flex-direction: column; gap: 5px;">
              <label class="form-label" style="font-size: 0.75rem;">ขนาดกระเบื้องปูพื้น:</label>
              <select id="tile-size-select" class="form-select" onchange="Modules.boq_recalculate()">
                <option value="60x60">60 x 60 ซม. (แกรนิตโต้)</option>
                <option value="30x30">30 x 30 ซม. (มาตรฐาน)</option>
                <option value="40x40">40 x 40 ซม.</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 2: Fence & Barbed Wire Calculation -->
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #f59e0b; margin-top: 15px; margin-bottom: 10px;">⛓️ 2. คำนวณเสารั้วคอนกรีต & ลวดหนามขึงรอบพื้นที่:</h4>
        <div class="grid-3 mb-3" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
          <div>
            <label class="form-label">ความยาวรวมรั้ว (เมตร):</label>
            <input type="number" id="fence-length" class="form-control" value="100" min="0" oninput="Modules.boq_recalculate()">
          </div>
          <div>
            <label class="form-label">ระยะห่างเสารั้ว (เมตร):</label>
            <select id="fence-post-spacing" class="form-select" onchange="Modules.boq_recalculate()">
              <option value="2.0">2.0 เมตร (มาตรฐานแข็งแรง)</option>
              <option value="2.5">2.5 เมตร</option>
              <option value="3.0">3.0 เมตร (ระยะประหยัด)</option>
            </select>
          </div>
          <div>
            <label class="form-label">จำนวนแถวลวดหนามที่ขึง (แถว):</label>
            <select id="fence-wire-rows" class="form-select" onchange="Modules.boq_recalculate()">
              <option value="4">4 แถว</option>
              <option value="5" selected>5 แถว (มาตรฐาน)</option>
              <option value="6">6 แถว</option>
              <option value="7">7 แถว</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-primary" onclick="Modules.boq_transferToQuotation()">📄 1-Click โอน BOQ เข้าใบเสนอราคา (Quotation)</button>
        </div>
      </div>

      <!-- BOQ Computed Table Results -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title" id="boq-summary-title">
            📋 ตารางถอดรายการวัสดุและประมาณราคา (Bill of Quantity - BOQ Summary)
          </div>
          <span style="font-weight: 700; font-size: 1.1rem; color: var(--accent-cyan-light);" id="boq-grand-total-display">
            ประมาณการราคารวม: ฿0
          </span>
        </div>

        <div class="table-responsive">
          <table class="custom-table" id="boq-table-results">
            <thead>
              <tr>
                <th>หมวดงาน</th>
                <th>รายการวัสดุ (Material Item)</th>
                <th>จำนวนที่ต้องใช้</th>
                <th>หน่วย</th>
                <th>ราคา/หน่วย</th>
                <th>ราคารวม (บาท)</th>
              </tr>
            </thead>
            <tbody id="boq-tbody">
              <!-- Renders dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

window.Modules.boq_calculator_bind = function() {
  window.Modules.boq_toggleMaterialSpecs();
  window.Modules.boq_recalculate();
};

window.Modules.boq_toggleMaterialSpecs = function() {
  const wallType = document.getElementById('boq-wall-type')?.value;
  const floorType = document.getElementById('boq-floor-type')?.value;

  const woodWallSpec = document.getElementById('spec-wood-wall');
  if (woodWallSpec) woodWallSpec.style.display = wallType === 'WOOD_BOARD' ? 'flex' : 'none';

  const woodFloorSpec = document.getElementById('spec-wood-floor');
  const tileFloorSpec = document.getElementById('spec-tile-floor');
  if (woodFloorSpec) woodFloorSpec.style.display = floorType === 'WOOD_FLOOR' ? 'flex' : 'none';
  if (tileFloorSpec) tileFloorSpec.style.display = floorType === 'TILE' ? 'flex' : 'none';
};

window.Modules.boq_recalculate = function() {
  const width = parseFloat(document.getElementById('boq-width')?.value || 10);
  const length = parseFloat(document.getElementById('boq-length')?.value || 12);
  const height = parseFloat(document.getElementById('boq-height')?.value || 3.5);
  const floors = parseInt(document.getElementById('boq-floors')?.value || 2);
  const sides = parseInt(document.getElementById('boq-sides')?.value || 4);

  const wallType = document.getElementById('boq-wall-type')?.value || 'WOOD_BOARD';
  const floorType = document.getElementById('boq-floor-type')?.value || 'WOOD_FLOOR';

  const fenceLength = parseFloat(document.getElementById('fence-length')?.value || 0);
  const postSpacing = parseFloat(document.getElementById('fence-post-spacing')?.value || 2.0);
  const wireRows = parseInt(document.getElementById('fence-wire-rows')?.value || 5);

  const floorArea = width * length * floors;
  const perimeter = (width + length) * (sides / 4);
  const wallArea = perimeter * height * floors * 0.85;

  const store = window.AppStore.data;
  const products = store.products;

  const boqItems = [];

  // 1. Wall Calculation
  if (wallType === 'WOOD_BOARD') {
    const wW = parseFloat(document.getElementById('wood-wall-w')?.value || 15) / 100; // to meters
    const wL = parseFloat(document.getElementById('wood-wall-l')?.value || 300) / 100; // to meters
    const boardArea = wW * wL;
    const qtyWood = Math.ceil((wallArea / boardArea) * 1.05); // +5% waste
    const p = products.find(x => x.sku === 'WOD-001') || { name: 'ไม้ฝาเฌอร่า/SCG 15x300 ซม.', price: 95, unit: 'แผ่น', sku: 'WOD-001' };
    boqItems.push({ cat: `งานผนังไม้ฝา (${(wW*100)}x${(wL*100)}ซม.)`, item: p, qty: qtyWood });
  } else if (wallType === 'GYPSUM') {
    const qtyGyp = Math.ceil((wallArea / (1.2 * 2.4)) * 1.05);
    const p = products.find(x => x.sku === 'BRD-001') || { name: 'แผ่นยิปซั่ม 120x240 ซม.', price: 165, unit: 'แผ่น', sku: 'BRD-001' };
    boqItems.push({ cat: 'งานผนังแผ่นยิปซั่ม/สมาร์ทบอร์ด', item: p, qty: qtyGyp });
  } else {
    const qtyBrick = Math.ceil(wallType === 'BRK_QCON' ? wallArea * 8.33 : wallArea * 120);
    const p = products.find(x => x.sku === (wallType === 'BRK_QCON' ? 'BRK-001' : 'BRK-002')) || products[0];
    boqItems.push({ cat: 'งานผนังอิฐ', item: p, qty: qtyBrick });
  }

  // 2. Floor Calculation
  if (floorType === 'WOOD_FLOOR') {
    const fW = parseFloat(document.getElementById('wood-floor-w')?.value || 20) / 100;
    const fL = parseFloat(document.getElementById('wood-floor-l')?.value || 300) / 100;
    const plankArea = fW * fL;
    const qtyFloorPlanks = Math.ceil((floorArea / plankArea) * 1.05);
    const p = products.find(x => x.sku === 'WOD-002') || { name: 'ไม้พื้นสังเคราะห์ 20x300 ซม.', price: 240, unit: 'แผ่น', sku: 'WOD-002' };
    boqItems.push({ cat: `งานปูไม้พื้น (${(fW*100)}x${(fL*100)}ซม.)`, item: p, qty: qtyFloorPlanks });
  } else if (floorType === 'TILE') {
    const tSize = document.getElementById('tile-size-select')?.value || '60x60';
    const tilePerBox = tSize === '60x60' ? 1.44 : 1.0;
    const qtyBoxes = Math.ceil((floorArea / tilePerBox) * 1.05);
    const p = products.find(x => x.sku === 'TIL-001') || { name: `กระเบื้องปูพื้น ${tSize} ซม.`, price: 320, unit: 'กล่อง', sku: 'TIL-001' };
    boqItems.push({ cat: `งานกระเบื้องปูพื้น (${tSize} ซม.)`, item: p, qty: qtyBoxes });
  }

  // 3. Structure & Cement
  const cementStruct = products.find(x => x.sku === 'CEM-001') || products[0];
  boqItems.push({ cat: 'งานโครงสร้างเสา-คานปูน', item: cementStruct, qty: Math.ceil(floorArea * 0.85) });

  // 4. Fence & Barbed Wire Calculation
  if (fenceLength > 0) {
    const fencePostsQty = Math.ceil(fenceLength / postSpacing) + 1;
    const totalWireMeters = fenceLength * wireRows * 1.1; // +10% slack
    const wireRollsQty = Math.ceil(totalWireMeters / 100); // 100m per roll

    const postProduct = products.find(x => x.sku === 'FNC-001') || { name: 'เสารั้วคอนกรีตอัดแรง 2.0m', price: 120, unit: 'ต้น', sku: 'FNC-001' };
    const wireProduct = products.find(x => x.sku === 'FNC-002') || { name: 'ลวดหนามชุบกัลวาไนซ์ 100m', price: 650, unit: 'ม้วน', sku: 'FNC-002' };

    boqItems.push({ cat: `งานเสารั้วคอนกรีต (ระยะห่าง ${postSpacing}m)`, item: postProduct, qty: fencePostsQty });
    boqItems.push({ cat: `งานขึงลวดหนาม (${wireRows} แถว ยาว ${fenceLength}m)`, item: wireProduct, qty: wireRollsQty });
  }

  let totalCost = 0;
  const tbody = document.getElementById('boq-tbody');
  if (!tbody) return;

  tbody.innerHTML = boqItems.map(row => {
    const price = row.item ? row.item.price : 0;
    const sum = price * row.qty;
    totalCost += sum;
    return `
      <tr>
        <td><strong style="color: var(--accent-cyan-light);">${row.cat}</strong></td>
        <td>${row.item ? row.item.name : '-'}</td>
        <td style="font-weight: 700;">${AppEngine.formatNumber(row.qty)}</td>
        <td>${row.item ? row.item.unit : '-'}</td>
        <td>฿${price}</td>
        <td style="font-weight: 700; color: #10b981;">฿${AppEngine.formatCurrency(sum)}</td>
      </tr>
    `;
  }).join('');

  const titleEl = document.getElementById('boq-summary-title');
  if (titleEl) titleEl.innerHTML = `📋 BOQ บ้านและรั้วลวดหนาม (พื้นที่ตัวบ้าน ${floorArea} ตร.ม. | ผนัง ${wallArea.toFixed(1)} ตร.ม. | รั้วยาว ${fenceLength} ม.)`;

  const grandTotalEl = document.getElementById('boq-grand-total-display');
  if (grandTotalEl) grandTotalEl.innerText = `ประมาณการราคารวม: ฿${AppEngine.formatCurrency(totalCost)}`;

  window.ActiveBOQ = {
    floorArea,
    items: boqItems.map(b => ({ sku: b.item.sku, name: b.item.name, price: b.item.price, unit: b.item.unit, qty: b.qty, weightKg: b.item ? b.item.weightKg : 10 }))
  };
};

window.Modules.boq_transferToQuotation = function() {
  if (!window.ActiveBOQ || !window.ActiveBOQ.items) return;
  window.PosCart.items = [...window.ActiveBOQ.items];
  AppEngine.showToast('โอนรายการ BOQ ไม้ฝา ไม้พื้น และลวดหนามเสารั้ว เข้าใบเสนอราคาสำเร็จ!', 'success');
  AppEngine.loadModule('sales_pos');
};
