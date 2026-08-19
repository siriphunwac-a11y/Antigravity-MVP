// Self-Contained Cloudflare Worker serving Static Assets & D1 API
// เธเธฃเธดเธฉเธฑเธ— เธเนเธณเน€เธเธเธฃเธเนเธฒเนเธกเน เธเธณเธเธฑเธ” (One Stop Service)

const staticFiles = {
  '/': $escapedHtml,
  '/index.html': $escapedHtml,
  '/styles.css': $escapedCss,
  '/data.js': $escapedData,
  '/app.js': $escapedApp,
  '/modules/accounting.js': $escaped,
  '/modules/boq_calculator.js': $escaped,
  '/modules/crm.js': $escaped,
  '/modules/dashboard.js': $escaped,
  '/modules/ecommerce.js': $escaped,
  '/modules/logistics.js': $escaped,
  '/modules/one_stop_scenario.js': $escaped,
  '/modules/procurement.js': $escaped,
  '/modules/product.js': $escaped,
  '/modules/sales_pos.js': $escaped,
  '/modules/warehouse.js': $escaped,

};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. API Endpoint: GET /api/products
    if (path === "/api/products") {
      try {
        if (!env.DB) return new Response(JSON.stringify({ success: false, message: "D1 Database missing" }), { headers: { "content-type": "application/json; charset=utf-8" } });
        const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY sku ASC").all();
        return new Response(JSON.stringify({ success: true, products: results }), { headers: { "content-type": "application/json; charset=utf-8" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "content-type": "application/json; charset=utf-8" } });
      }
    }

    // 2. Serve Static File from Memory Map
    if (staticFiles[path]) {
      let mime = "text/html; charset=utf-8";
      if (path.endsWith(".css")) mime = "text/css; charset=utf-8";
      else if (path.endsWith(".js")) mime = "application/javascript; charset=utf-8";
      
      return new Response(staticFiles[path], {
        headers: { "content-type": mime, "cache-control": "public, max-age=3600" }
      });
    }

    // Fallback to index.html for SPA routes
    return new Response(staticFiles['/'], {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};