// ==========================================
// Cloudflare Worker Main Entrypoint (index.js)
// บริษัท น้ำเพชรค้าไม้ จำกัด (One Stop Service Platform)
// ==========================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API Endpoint: GET /api/products (Cloudflare D1 Query)
    if (url.pathname === "/api/products") {
      try {
        if (!env.DB) {
          return new Response(JSON.stringify({ success: false, message: "D1 Database binding missing" }), {
            headers: { "content-type": "application/json; charset=utf-8" }
          });
        }
        const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY sku ASC").all();
        return new Response(JSON.stringify({ success: true, products: results }), {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      }
    }

    // 2. API Endpoint: POST /api/checkout (Cloudflare D1 POS Checkout & Stock Deduction)
    if (url.pathname === "/api/checkout" && request.method === "POST") {
      try {
        const data = await request.json();
        const { docNo, docType, customerName, customerAddress, customerTaxId, vatType, subtotal, vatAmount, deliveryFee, depositAmount, grandTotal, paymentMethod, cashierId, items } = data;

        if (env.DB) {
          await env.DB.prepare(`
            INSERT INTO sales_transactions (doc_no, doc_type, customer_name, customer_address, customer_tax_id, vat_type, subtotal, vat_amount, delivery_fee, deposit_amount, grand_total, remaining_amount, payment_method, cashier_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(docNo, docType, customerName, customerAddress, customerTaxId, vatType, subtotal, vatAmount, deliveryFee, depositAmount, grandTotal, Math.max(0, grandTotal - depositAmount), paymentMethod, cashierId).run();

          for (const item of items) {
            await env.DB.prepare("UPDATE products SET stock = MAX(0, stock - ?) WHERE sku = ?").bind(item.qty, item.sku).run();
          }
        }
        return new Response(JSON.stringify({ success: true, docNo }), {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      }
    }

    // 3. Serve Static Assets (index.html, styles.css, app.js, modules/*.js)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Namphet Construction WebApp Online", { status: 200 });
  }
};
