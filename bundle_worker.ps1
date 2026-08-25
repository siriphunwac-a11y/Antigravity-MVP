$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$html = [System.IO.File]::ReadAllText("$PSScriptRoot\index.html", $utf8NoBom)
$css  = [System.IO.File]::ReadAllText("$PSScriptRoot\styles.css", $utf8NoBom)
$data = [System.IO.File]::ReadAllText("$PSScriptRoot\data.js", $utf8NoBom)
$app  = [System.IO.File]::ReadAllText("$PSScriptRoot\app.js", $utf8NoBom)

function ToJsonString($str) {
    return ($str | ConvertTo-Json -Compress)
}

$htmlJson = ToJsonString $html
$cssJson  = ToJsonString $css
$dataJson = ToJsonString $data
$appJson  = ToJsonString $app

$moduleEntries = @()
$moduleFiles = Get-ChildItem "$PSScriptRoot\modules\*.js"
foreach ($f in $moduleFiles) {
    $c = [System.IO.File]::ReadAllText($f.FullName, $utf8NoBom)
    $cJson = ToJsonString $c
    $moduleEntries += "  '/modules/$($f.Name)': $cJson"
}

$modulesJoined = $moduleEntries -join ",`n"

$code = @"
// Self-Contained Cloudflare Worker for Namphet Construction Platform
const staticFiles = {
  '/': $htmlJson,
  '/index.html': $htmlJson,
  '/styles.css': $cssJson,
  '/data.js': $dataJson,
  '/app.js': $appJson,
$modulesJoined
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

    // 2. Serve Static File
    if (staticFiles[path]) {
      let mime = "text/html; charset=utf-8";
      if (path.endsWith(".css")) mime = "text/css; charset=utf-8";
      else if (path.endsWith(".js")) mime = "application/javascript; charset=utf-8";
      
      return new Response(staticFiles[path], {
        headers: { "content-type": mime, "cache-control": "public, max-age=3600" }
      });
    }

    // Fallback SPA
    return new Response(staticFiles['/'], {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};
"@

[System.IO.File]::WriteAllText("$PSScriptRoot\index.js", $code, $utf8NoBom)
Write-Host "Bundled index.js successfully generated without BOM! Total size: "$code.Length " bytes."
