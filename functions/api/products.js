// Cloudflare Pages Function Endpoint: GET /api/products
// Connects directly to Cloudflare D1 Database via env.DB
export async function onRequestGet(context) {
  const { env } = context;
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Cloudflare D1 Binding missing. Falling back to local data." }), {
        status: 500,
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
