// ==========================================
// Logistics Fleet Queue & Photo POD Module
// (บริษัท น้ำเพชรค้าไม้ จำกัด)
// ==========================================

window.Modules = window.Modules || {};

window.Modules.logistics = function() {
  const store = window.AppStore.data;
  const trucks = store.trucks || [];

  return `
    <div class="logistics-module">
      <!-- Truck Fleet Dispatch Matrix -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">🚚 ระบบจัดคิวรถขนส่งไม้ & วัสดุ (ผู้ติดตาม 0 - 10 คน)</div>
          <button class="btn btn-primary" onclick="Modules.logistics_openDispatchModal()">+ จัดคิวรถส่งของใหม่ (New Queue)</button>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>รหัส / ประเภทรถ</th>
                <th>ทะเบียนรถ</th>
                <th>พนักงานขับรถ</th>
                <th>พนักงานติดตามจัดส่ง (Helpers 0-10 คน)</th>
                <th>สถานะรถ</th>
                <th>ตำแหน่ง GPS ปัจจุบัน</th>
                <th>การยืนยันส่ง (POD)</th>
              </tr>
            </thead>
            <tbody>
              ${trucks.map(t => `
                <tr>
                  <td style="font-weight: 700; color: var(--accent-cyan-light);">${t.id} - ${t.type}</td>
                  <td><strong style="color: var(--accent-amber);">${t.plate}</strong></td>
                  <td style="font-weight: 600;">👨‍✈️ ${t.driver}</td>
                  <td>
                    <div style="font-size: 0.82rem;">
                      <span class="badge badge-warning" style="margin-between: 4px;">รวม ${(t.helpers || []).length} คน</span>
                      ${(t.helpers || []).map(h => `<span class="badge badge-info" style="display: inline-block; margin: 2px;">👷 ${h}</span>`).join('')}
                    </div>
                  </td>
                  <td>
                    <span class="badge ${t.status === 'Available' ? 'badge-success' : t.status === 'En Route' ? 'badge-warning' : 'badge-danger'}">
                      ${t.status}
                    </span>
                  </td>
                  <td style="font-size: 0.85rem;">📍 ${t.currentLocation}</td>
                  <td>
                    <button class="btn btn-sm btn-success" onclick="Modules.logistics_openPhotoPODModal('${t.id}')">📷 แนบรูปส่งของ (Photo POD)</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Distance Delivery Fee Calculator & GPS Tracking Live View -->
      <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📍 เครื่องคำนวณค่าจัดส่งตามระยะทาง (Distance Calculator)</div>
          </div>
          <div class="form-group">
            <label class="form-label">ระบุระยะทางจัดส่งจากร้าน อ.เขาย้อย ถึงไซต์งาน (กิโลเมตร):</label>
            <input type="number" id="logistics-dist-km" class="form-control" value="18" oninput="Modules.logistics_calcFee()">
          </div>
          <div id="logistics-fee-result" style="background: rgba(6, 182, 212, 0.1); border: 1px solid #06b6d4; padding: 15px; border-radius: 8px;">
            <!-- Result -->
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🗺️ GPS Tracking Simulation (ติดตามรถส่งของ Real-time)</div>
          </div>
          <div style="background: #091322; border: 1px solid var(--border-color); height: 180px; border-radius: 8px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; top: 15px; left: 20px; font-size: 0.8rem; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px;">
              🟢 TRK-02 (ทะเบียน 82-5678) ➔ มุ่งหน้า อ.เขาย้อย (ความเร็ว 60 กม./ชม.)
            </div>
            <div style="font-size: 3rem; animation: pulse 2s infinite;">🚚 💨 --------------------> 🪵</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.Modules.logistics_calculator_bind = function() {
  window.Modules.logistics_calcFee();
};

window.Modules.logistics_calcFee = function() {
  const km = parseFloat(document.getElementById('logistics-dist-km')?.value || 0);
  const resultBox = document.getElementById('logistics-fee-result');
  if (!resultBox) return;

  const baseFree = 5;
  const ratePerKm = 15;
  const fee = km <= baseFree ? 0 : (km - baseFree) * ratePerKm;

  resultBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 5px;">
      <span>ระยะทาง: <strong>${km} กม.</strong></span>
      <span>นโยบาย: ฟรี ${baseFree} กม. แรก (เกินคิด ฿${ratePerKm}/กม.)</span>
    </div>
    <div style="font-size: 1.2rem; font-weight: 700; color: #67e8f9;">
      ค่าจัดส่งประเมินสุทธิ: ฿${AppEngine.formatCurrency(fee)}
    </div>
  `;
};

// Dispatch Queue Modal (0 - 10 Helpers/Assistants)
window.Modules.logistics_openDispatchModal = function() {
  const allAvailableHelpers = [
    'นายสมชาย ดีงาม', 'นายสมศักดิ์ ขยันงาน', 'นายประเสริฐ ชำนาญ',
    'นายวิชัย ใจดี', 'นายสุรชัย แข็งแรง', 'นายสายชล ช่วยยก',
    'นายเดชา ปลอดภัย', 'นายสมพงษ์ สู้งาน', 'นายอนันต์ ขยันยิ่ง', 'นายธีระ ยึดมั่น'
  ];

  const html = `
    <div>
      <div class="form-group">
        <label class="form-label">เลือกประเภทรถจัดส่ง:</label>
        <select class="form-select" id="dispatch-truck-type">
          <option>รถ 6 ล้อคันใหญ่ขนส่งไม้ (8 ตัน)</option>
          <option>รถ 10 ล้อ พร้อมเครนยก (15 ตัน)</option>
          <option>รถกระบะตู้ข้าง (1.5 ตัน)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">ระบุทะเบียนรถ:</label>
        <input type="text" id="dispatch-plate" class="form-control" value="82-9999 เพชรบุรี">
      </div>

      <div class="form-group">
        <label class="form-label">เลือกพนักงานขับรถ:</label>
        <input type="text" id="dispatch-driver" class="form-control" value="นายสมนึก ขยันขับ">
      </div>

      <div class="form-group">
        <label class="form-label" style="color: #67e8f9; font-weight: 700;">เลือกพนักงานติดตามจัดส่ง (เลือกได้ตั้งแต่ 0 ถึง 10 คน):</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.82rem; max-height: 180px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px;">
          ${allAvailableHelpers.map((h, i) => `
            <label><input type="checkbox" class="dispatch-helper-chk" ${i < 3 ? 'checked' : ''} value="${h}"> ${h}</label>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  AppEngine.openModal('🚚 จัดคิวรถส่งของใหม่ (เลือกผู้ติดตาม 0-10 คน)', html, `
    <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ยกเลิก</button>
    <button class="btn btn-primary" onclick="Modules.logistics_submitDispatch()">ยืนยันปล่อยคิวรถ</button>
  `);
};

window.Modules.logistics_submitDispatch = function() {
  const plate = document.getElementById('dispatch-plate')?.value;
  const driver = document.getElementById('dispatch-driver')?.value;
  const type = document.getElementById('dispatch-truck-type')?.value;

  const selectedHelpers = [];
  document.querySelectorAll('.dispatch-helper-chk:checked').forEach(chk => {
    selectedHelpers.push(chk.value);
  });

  const newTruck = {
    id: `TRK-0${window.AppStore.data.trucks.length + 1}`,
    plate: plate,
    type: type,
    driver: driver,
    helpers: selectedHelpers,
    status: 'En Route',
    currentLocation: 'ออกจากคลัง มุ่งหน้าไซต์งาน'
  };

  window.AppStore.data.trucks.push(newTruck);
  window.AppStore.save();
  AppEngine.closeModal();
  AppEngine.showToast(`จัดคิวรถทะเบียน ${plate} (ผู้ติดตาม ${selectedHelpers.length} คน) เรียบร้อย!`, 'success');
  AppEngine.loadModule('logistics');
};

// Photo POD
window.Modules.logistics_openPhotoPODModal = function(truckId) {
  const t = window.AppStore.data.trucks.find(x => x.id === truckId);
  
  const html = `
    <div>
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 0.85rem;">
        📷 <strong>Electronic Proof of Delivery (Photo POD):</strong> ยืนยันการส่งมอบวัสดุ ณ หน้างานจริงด้วยรูปถ่ายจากพนักงานส่งของ
      </div>

      <p style="font-size: 0.85rem; color: var(--text-muted);">
        รถจัดส่ง: <strong>${t ? t.plate : ''}</strong> (${t ? t.driver : ''})
      </p>

      <div class="photo-pod-container">
        <div style="font-size: 3rem;">📸</div>
        <p style="font-size: 0.85rem; color: var(--text-muted);">ถ่ายรูปหรือแนบภาพถ่ายสินค้าที่จัดส่งถึงไซต์งานสำเร็จแล้ว</p>
        <button class="btn btn-sm btn-primary" style="margin-top: 10px;" onclick="Modules.logistics_simulatePhotoUpload()">📷 จำลองถ่ายรูปจากมือถือพนักงานส่งของ</button>
        <div id="pod-photo-preview-box"></div>
      </div>
    </div>
  `;

  AppEngine.openModal('📷 รูปถ่ายยืนยันการส่งมอบสินค้า (Photo POD)', html, `
    <button class="btn btn-secondary" onclick="AppEngine.closeModal()">ปิด</button>
    <button class="btn btn-success" onclick="Modules.logistics_confirmPOD('${truckId}')">✅ บันทึกยืนยันส่งมอบสำเร็จ</button>
  `);
};

window.Modules.logistics_simulatePhotoUpload = function() {
  const box = document.getElementById('pod-photo-preview-box');
  if (box) {
    box.innerHTML = `
      <div style="margin-top: 15px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; border: 1px solid #10b981;">
        <div style="font-size: 0.8rem; color: #10b981; font-weight: 600;">✅ แนบรูปถ่ายสำเร็จ: photo_wood_delivery_site.jpg</div>
        <div style="height: 120px; background: #1e293b; border-radius: 6px; margin-top: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #94a3b8;">
          [รูปถ่ายไม้ฝาเฌอร่าและไม้พื้นลงที่ไซต์งาน อ.เขาย้อย]
        </div>
      </div>
    `;
  }
};

window.Modules.logistics_confirmPOD = function(truckId) {
  const t = window.AppStore.data.trucks.find(x => x.id === truckId);
  if (t) {
    t.status = 'Available';
    t.currentLocation = 'ส่งของสำเร็จ (กลับถึงร้าน)';
  }
  window.AppStore.save();
  AppEngine.closeModal();
  AppEngine.showToast('บันทึกรูปถ่ายยืนยันการส่งมอบ Photo POD เรียบร้อย!', 'success');
  AppEngine.loadModule('logistics');
};
