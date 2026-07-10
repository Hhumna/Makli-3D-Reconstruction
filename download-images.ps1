$ProgressPreference = 'SilentlyContinue'
$urls = @(
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PK_Thatta_asv2020-02_img15_Makli_Necropolis.jpg/1200px-PK_Thatta_asv2020-02_img15_Makli_Necropolis.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/PK_Thatta_asv2020-02_img11_Makli_Necropolis.jpg/1200px-PK_Thatta_asv2020-02_img11_Makli_Necropolis.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/PK_Thatta_asv2020-02_img20_Makli_Necropolis.jpg/1200px-PK_Thatta_asv2020-02_img20_Makli_Necropolis.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/PK_Thatta_asv2020-02_img16_Makli_Necropolis.jpg/1200px-PK_Thatta_asv2020-02_img16_Makli_Necropolis.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/PK_Thatta_asv2020-02_img19_Makli_Necropolis.jpg/1200px-PK_Thatta_asv2020-02_img19_Makli_Necropolis.jpg'
)

$imgDir = 'public\images'
for ($i=0; $i -lt $urls.Length; $i++) {
  $filename = "makli_" + ($i+1) + ".jpg"
  $filepath = Join-Path $imgDir $filename
  Write-Host "Downloading $filename..."
  try {
    Invoke-WebRequest -Uri $urls[$i] -OutFile $filepath -TimeoutSec 30 -ErrorAction Stop
    Write-Host ("Downloaded: " + $filename)
  } catch {
    Write-Host ("Failed: " + $filename)
  }
}

Write-Host "Checking images:"
Get-ChildItem ($imgDir + "\*.jpg") | ForEach-Object { Write-Host ($_.Name) }
