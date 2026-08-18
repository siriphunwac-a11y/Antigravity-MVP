// Cloudflare Pages Function Endpoint: POST /api/checkout
// Executes transactional POS checkout & stock deduction directly on Cloudflare D1 Database
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const { docNo, docType, customerName, customerAddress, customerTaxId, vatType, subtotal, vatAmount, deliveryFee, depositAmount, grandTotal, paymentMethod, cashierId, items } = data;

    if (!env.DB) {
      return new Response(JSON.stringify({ success: true, message: "Demo mode (D1 Binding optional)." }), {
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    // 1. Insert Sales Transaction into D1
    await env.DB.prepare(`
      INSERT INTO sales_transactions (doc_no, doc_type, customer_name, customer_address, customer_tax_id, vat_type, subtotal, vat_amount, delivery_fee, deposit_amount, grand_total, remaining_amount, payment_method, cashier_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(docNo, docType, customerName, customerAddress, customerTaxId, vatType, subtotal, vatAmount, deliveryFee, depositAmount, grandTotal, Math.max(0, grandTotal - depositAmount), paymentMethod, cashierId).run();

    // 2. Loop Items: Deduct Stock & Record Log
    for (const item of items) {
      await env.DB.prepare("UPDATE products SET stock = MAX(0, stock - ?) WHERE sku = ?").bind(item.qty, item.sku).run();
      await env.DB.prepare(`
        INSERT INTO stock_logs (id, timestamp, sku, product_name, type, qty, balance_after, actor, note)
        VALUES (?, datetime('now'), ?, ?, 'OUT_SALE', ?, 0, ?, ?)
      `).bind(`LOG-${Date.now()}-${item.sku}`, item.sku, item.name, -item.qty, `${cashierId} (POS)`, `ขายหน้าร้าน (${docType})`).run();
    }

    // 3. Update Cashier Daily Total
    await env.DB.prepare("UPDATE cashiers SET total_today = total_today + ? WHERE id = ?").bind(grandTotal, cashierId).run();

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
