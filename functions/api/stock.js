// Cloudflare Pages Function Endpoint: POST /api/stock
// Stock Replenishment & Return Operations on Cloudflare D1 Database
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const { mode, sku, qty, cost, note, actor } = data;

    if (!env.DB) {
      return new Response(JSON.stringify({ success: true, message: "Demo mode (D1 Binding optional)." }), {
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    // 1. Update Product Stock in D1
    await env.DB.prepare("UPDATE products SET stock = stock + ? WHERE sku = ?").bind(qty, sku).run();

    // 2. Insert Lot Record
    const lotNo = `LOT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*90+10)}`;
    await env.DB.prepare(`
      INSERT INTO product_lots (sku, lot_no, cost_price, qty, receive_date)
      VALUES (?, ?, ?, ?, date('now'))
    `).bind(sku, lotNo, cost, qty).run();

    // 3. Record Audit Log
    const logType = mode === 'RETURN' ? 'IN_RETURN' : 'IN_MANUAL';
    await env.DB.prepare(`
      INSERT INTO stock_logs (id, timestamp, sku, product_name, type, qty, balance_after, actor, note)
      VALUES (?, datetime('now'), ?, 'Product', ?, ?, 0, ?, ?)
    `).bind(`LOG-${Date.now()}`, sku, logType, qty, actor, note).run();

    return new Response(JSON.stringify({ success: true, lotNo }), {
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
}
