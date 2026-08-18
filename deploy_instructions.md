# 🚀 คู่มือการนำ Web App & Cloudflare D1 Database ขึ้น Cloudflare Pages

แพลตฟอร์มวัสดุก่อสร้าง **บริษัท น้ำเพชรค้าไม้ จำกัด** ถูกออกแบบโครงสร้างพร้อมอัปโหลดขึ้น **Cloudflare Pages** และเชื่อมต่อ **Cloudflare D1 Database (Serverless SQL Edge Database)** สมบูรณ์แบบ 100% แล้วครับ

---

## 📌 ขั้นตอนการสร้าง Cloudflare D1 Database และ Deploy (เลือกทำได้ 2 วิธี)

### วิธีที่ 1: Deploy ผ่าน Cloudflare Dashboard (ทำผ่านเบราว์เซอร์ - ง่ายที่สุด ⭐⭐⭐⭐⭐)

1. **ล็อกอินเข้า Cloudflare Dashboard**:
   - ไปที่ [https://dash.cloudflare.com/](https://dash.cloudflare.com/)

2. **สร้าง Cloudflare D1 Database**:
   - เมนูซ้ายมือ เลือก **Workers & Pages** ➔ **D1**
   - กดปุ่ม **Create database**
   - ตั้งชื่อฐานข้อมูล: `namphet_construction_db` ➔ กด **Create**
   - กดปุ่ม **Console** ของ D1 แล้วก๊อปปี้เนื้อหาในไฟล์ `schema.sql` ทั้งหมด ไปวางแล้วกด **Execute** เพื่อสร้างตารางและข้อมูลตั้งต้น

3. **Deploy Web Application ขึ้น Cloudflare Pages**:
   - เมนูซ้ายมือ เลือก **Workers & Pages** ➔ **Create application** ➔ แท็บ **Pages**
   - เลือก **Connect to Git** (เลือก Repository จาก GitHub) หรืออัปโหลดโฟลเดอร์โครงการนี้
   - ในขั้นตอน **Settings**:
     - Framework preset: `None`
     - Build output directory: `./`
   - กด **Save and Deploy** ➔ Web App จะออนไลน์ทันทีบน URL ของ Cloudflare (เช่น `https://namphet-construction.pages.dev`)

4. **เชื่อมต่อ Web App เข้ากับ D1 Database (Binding)**:
   - ไปที่โครงการ Pages ของคุณใน Cloudflare ➔ เมนู **Settings** ➔ **Functions**
   - เลื่อนลงมาที่หัวข้อ **D1 database bindings** ➔ กด **Add binding**
   - Variable name: `DB`
   - D1 database: เลือก `namphet_construction_db` ➔ กด **Save**

---

### วิธีที่ 2: Deploy ผ่าน Command Line (Wrangler CLI)

หากคุณมี Node.js และ Cloudflare CLI (`wrangler`) ติดตั้งบนเครื่อง ให้รันคำสั่งต่อไปนี้ใน Terminal:

```bash
# 1. ล็อกอินเข้า Cloudflare
npx wrangler login

# 2. สร้าง D1 Database บน Cloudflare
npx wrangler d1 create namphet_construction_db

# 3. รัน Schema สร้างตารางใน D1 Database
npx wrangler d1 execute namphet_construction_db --file=./schema.sql

# 4. Deploy Web App ขึ้น Cloudflare Pages
npx wrangler pages deploy ./ --project-name=namphet-construction-one-stop
```

---

## 📂 โครงสร้างไฟล์สำหรับ Cloudflare Deployment:
- `wrangler.jsonc`: ไฟล์คอนฟิก Cloudflare Pages & D1 Database Binding (`DB`)
- `schema.sql`: สคริปต์โครงสร้างตาราง D1 SQL (Products, Stock Lots, Cashiers, Sales Transactions, Stock Movement Logs, AR Bills)
- `functions/api/products.js`: Cloudflare Function ดึงข้อมูล SKU จาก D1 DB
- `functions/api/checkout.js`: Cloudflare Function บันทึกบิล ตัดสต๊อกใน D1 DB
- `functions/api/stock.js`: Cloudflare Function คีย์รับเข้าและคืนสินค้าลง D1 DB
