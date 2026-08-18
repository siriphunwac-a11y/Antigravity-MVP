// ==========================================
// Executive Dashboard, Brand & SKU Comparison KPI Module
// ==========================================

window.Modules = window.Modules || {};

window.Modules.dashboard = function() {
  const store = window.AppStore.data;
  const brands = store.brands || [];
  const cashiers = store.cashiers || [];
  const products = store.products || [];

  // Calculate totals
  const totalSalesToday = cashiers.reduce((acc, c) => acc + (c.totalToday || 0), 0);
  const totalStockItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalStockValue = products.reduce((acc, p) => {
    const avgCost = p.lots && p.lots.length > 0 ? p.lots[0].costPrice : p.price * 0.8;
    return acc + (p.stock * avgCost);
  }, 0);

  return `
    <div class="dashboard-module">
      <!-- Top Summary KPI Grid -->
      <div class="grid-4 mb-4" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 25px;">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">💰</div>
          <div>
            <div class="kpi-value">฿${AppEngine.formatCurrency(totalSalesToday)}</div>
            <div class="kpi-label">ยอดขายรวมวันนี้ (ทุก POS)</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">📦</div>
          <div>
            <div class="kpi-value">${AppEngine.formatNumber(totalStockItems)} ชิ้น</div>
            <div class="kpi-label">จำนวนสินค้าคงเหลือรวม</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">🏷️</div>
          <div>
            <div class="kpi-value">฿${AppEngine.formatCurrency(totalStockValue)}</div>
            <div class="kpi-label">มูลค่าสินค้าในคลัง (ราคาต้นทุน)</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">🚚</div>
          <div>
            <div class="kpi-value">2 คิว</div>
            <div class="kpi-label">รถจัดส่งพร้อมเดินทางวันนี้</div>
          </div>
        </div>
      </div>

      <!-- NEW CUSTOMIZATION: KPI เปรียบเทียบ แยกตาม SKU (SKU-level KPI Performance Matrix) -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">
            <span>📦</span> KPI เปรียบเทียบสินค้า แยกตาม SKU (SKU Performance Comparison Matrix)
          </div>
          <span class="badge badge-success">อัปเดตเรียลไทม์ตามยอดขาย</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px;">
          เปรียบเทียบยอดขายรายหน่วย (Units Sold), รายได้รวม (Revenue), และอัตรากำไรขั้นต้น (Margin %) รายรายการสินค้า SKU
        </p>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>รหัส SKU</th>
                <th>ชื่อสินค้าวัสดุก่อสร้าง</th>
                <th>ยี่ห้อ (Brand)</th>
                <th>จำนวนขายเดือนนี้</th>
                <th>รายได้รวม (บาท)</th>
                <th>อัตรากำไร (Margin %)</th>
                <th>อันดับการขาย</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((p, idx) => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${p.sku}</td>
                  <td style="font-weight: 600;">${p.image} ${p.name}</td>
                  <td><span class="badge badge-info">${p.brand}</span></td>
                  <td style="font-weight: 700;">${AppEngine.formatNumber(p.unitsSoldMonth || 1200)} ${p.unit}</td>
                  <td style="font-weight: 700; color: #10b981;">฿${AppEngine.formatCurrency(p.totalSalesMonth || (p.price * 1200))}</td>
                  <td style="font-weight: 600; color: var(--accent-amber);">+${p.marginPercent || 22.5}%</td>
                  <td>
                    ${idx === 0 ? '<span class="badge badge-success">🏆 อันดับ 1 (Best Seller)</span>' :
                      idx === 1 ? '<span class="badge badge-info">🥈 อันดับ 2</span>' :
                      '<span class="badge badge-secondary">อันดับ ' + (idx + 1) + '</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Brand Performance KPI Comparison -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">
            <span>🏷️</span> KPI เปรียบเทียบยี่ห้อสินค้า (Brand Performance Comparison Matrix)
          </div>
          <span class="badge badge-info">แยกตามแบรนด์</span>
        </div>
        
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>แบรนด์สินค้า (Brand)</th>
                <th>หมวดหมู่หลัก</th>
                <th>ยอดขายเดือนนี้</th>
                <th>ส่วนแบ่งตลาด (Market Share)</th>
                <th>อัตรากำไรขั้นต้น (Margin %)</th>
                <th>สถานะยอดขาย</th>
              </tr>
            </thead>
            <tbody>
              ${brands.map(b => `
                <tr>
                  <td style="font-weight: 600; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.3rem;">${b.logo}</span> ${b.name}
                  </td>
                  <td>${b.category}</td>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">฿${AppEngine.formatCurrency(b.salesThisMonth)}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${b.marketShare}%; height: 100%; background: linear-gradient(90deg, #06b6d4, #3b82f6);"></div>
                      </div>
                      <span>${b.marketShare}%</span>
                    </div>
                  </td>
                  <td style="font-weight: 600; color: #10b981;">+${b.profitMargin}%</td>
                  <td>
                    ${b.profitMargin > 20 ? '<span class="badge badge-success">High Margin 🔥</span>' : '<span class="badge badge-info">Normal Target</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cashiers Performance & Sales Tracking Per Terminal/ID -->
      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">🧑‍💻 ยอดขายแยกตาม Cashier & เครื่อง POS หน้าร้าน</div>
          </div>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>รหัส Cashier / ชื่อ</th>
                  <th>เครื่อง POS</th>
                  <th>สถานะ</th>
                  <th>ยอดขายวันนี้</th>
                </tr>
              </thead>
              <tbody>
                ${cashiers.map(c => `
                  <tr>
                    <td style="font-weight: 600;">${c.id} - ${c.name}</td>
                    <td>${c.terminal}</td>
                    <td><span class="badge ${c.status === 'Active' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
                    <td style="font-weight: 700; color: var(--accent-cyan-light);">฿${AppEngine.formatCurrency(c.totalToday)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Demand Forecast -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 AI Forecast Demand & สินค้าขายดีประจำสัปดาห์</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid #06b6d4;">
              <div style="font-weight: 600;">🧱 ปูนซีเมนต์ผสม SCG ซูเปอร์เสือ</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">พยากรณ์ความต้องการ 7 วันข้างหน้า: <strong>650 ถุง</strong> (แนะนำสั่งเพิ่มใน PO)</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid #3b82f6;">
              <div style="font-weight: 600;">⚙️ เหล็กเส้นข้ออ้อย DB12 มอก. SD40</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">พยากรณ์ความต้องการ 7 วันข้างหน้า: <strong>420 เส้น</strong> (เพียงพอ)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
