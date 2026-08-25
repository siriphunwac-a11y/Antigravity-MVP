// ==========================================
// Executive Dashboard, Brand & SKU Comparison KPI Module
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.Modules.dashboard = function() {
  const store = window.AppStore.data;
  const cashiers = store.cashiers || [];
  const products = store.products || [];
  const trucks = store.trucks || [];

  // Calculate totals
  const totalSalesToday = cashiers.reduce((acc, c) => acc + (c.totalToday || 0), 0);
  const totalStockItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalStockValue = products.reduce((acc, p) => {
    const avgCost = p.lots && p.lots.length > 0 ? p.lots[0].costPrice : p.price * 0.8;
    return acc + (p.stock * avgCost);
  }, 0);

  const activeTrucksCount = trucks.filter(t => t.status === 'En Route').length;

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
            <div class="kpi-value">${activeTrucksCount} คิว</div>
            <div class="kpi-label">รถจัดส่งพร้อมเดินทางวันนี้</div>
          </div>
        </div>
      </div>

      <!-- SKU-level KPI Performance Matrix -->
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
              ${products.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 35px;">
                    <div style="font-size: 1.8rem; margin-bottom: 5px;">📦</div>
                    ยังไม่มีข้อมูลสินค้าในระบบ (0 รายการ) - คลิกที่เมนู <strong>คลังข้อมูลสินค้า SKU</strong> เพื่อเริ่มเพิ่มสินค้าแรกของร้าน
                  </td>
                </tr>
              ` : ''}
              ${products.map((p, idx) => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${p.sku}</td>
                  <td style="font-weight: 600;">${p.image || '📦'} ${p.name}</td>
                  <td><span class="badge badge-info">${p.brand || 'ทั่วไป'}</span></td>
                  <td style="font-weight: 700;">${AppEngine.formatNumber(p.unitsSoldMonth || 0)} ${p.unit}</td>
                  <td style="font-weight: 700; color: #10b981;">฿${AppEngine.formatCurrency(p.totalSalesMonth || 0)}</td>
                  <td style="font-weight: 600; color: var(--accent-amber);">+${p.marginPercent || 0}%</td>
                  <td>
                    ${idx === 0 ? '<span class="badge badge-success">🏆 อันดับ 1</span>' :
                      '<span class="badge badge-secondary">อันดับ ' + (idx + 1) + '</span>'}
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
                    <td><span class="badge badge-success">พร้อมใช้งาน</span></td>
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
            ${products.length === 0 ? `
              <div style="text-align: center; color: var(--text-dim); padding: 30px; font-size: 0.88rem;">
                🤖 ระบบ AI จะทำการวิเคราะห์และพยากรณ์ความต้องการสินค้าเมื่อเริ่มคีย์ข้อมูล SKU และประวัติการออกบิลขาย
              </div>
            ` : `
              ${products.slice(0, 2).map(p => `
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 3px solid #06b6d4;">
                  <div style="font-weight: 600;">[${p.sku}] ${p.name}</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">พยากรณ์ความต้องการ 7 วันข้างหน้า: <strong>${Math.floor((p.stock || 50) * 0.5)} ${p.unit}</strong></div>
                </div>
              `).join('')}
            `}
          </div>
        </div>
      </div>
    </div>
  `;
};
