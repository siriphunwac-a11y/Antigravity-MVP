$html = Get-Content -Raw -Path "index.html" -Encoding UTF8
$css = Get-Content -Raw -Path "styles.css" -Encoding UTF8
$data = Get-Content -Raw -Path "data.js" -Encoding UTF8
$app = Get-Content -Raw -Path "app.js" -Encoding UTF8

$modules = Get-ChildItem -Path "modules\*.js"
$modulesJs = ""
foreach ($file in $modules) {
    $content = Get-Content -Raw -Path $file.FullName -Encoding UTF8
    $relPath = "modules/" + $file.Name
    $escaped = $content.Replace('\', '\\').Replace('`', '\`').Replace('$', '\$')
    $modulesJs += "  '/modules/$($file.Name)': `$escaped`,`n"
}

$escapedHtml = $html.Replace('\', '\\').Replace('`', '\`').Replace('$', '\$')
$escapedCss = $css.Replace('\', '\\').Replace('`', '\`').Replace('$', '\$')
$escapedData = $data.Replace('\', '\\').Replace('`', '\`').Replace('$', '\$')
$escapedApp = $app.Replace('\', '\\').Replace('`', '\`').Replace('$', '\$')

$workerCode = @"
// Self-Contained Cloudflare Worker serving Static Assets & D1 API
// บริษัท น้ำเพชรค้าไม้ จำกัด (One Stop Service)

const staticFiles = {
  '/': `$escapedHtml`,
  '/index.html': `$escapedHtml`,
  '/styles.css': `$escapedCss`,
  '/data.js': `$escapedData`,
  '/app.js': `$escapedApp`,
$modulesJs
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
"@

[System.IO.File]::WriteAllText("index.js", $workerCode, [System.Text.Encoding]::UTF8)
Write-Host "Self-contained index.js Worker script generated successfully!"
