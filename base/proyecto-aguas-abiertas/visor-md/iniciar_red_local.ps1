$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Start-WebServer {
  param(
    [string]$Bind,
    [int]$Port
  )

  $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
  if ($pythonCmd) {
    cmd /c "python --version >nul 2>nul"
    if ($LASTEXITCODE -eq 0) {
      python -m http.server $Port --bind $Bind
      return
    }
  }

  $pyCmd = Get-Command py -ErrorAction SilentlyContinue
  if ($pyCmd) {
    cmd /c "py --version >nul 2>nul"
    if ($LASTEXITCODE -eq 0) {
      py -m http.server $Port --bind $Bind
      return
    }
  }

  if (Get-Command npx -ErrorAction SilentlyContinue) {
    npx --yes http-server . -p $Port -a $Bind -c-1
    return
  }

  throw "No se encontro Python ni npx. Instala Python o Node.js para servir el visor."
}

$port = 8080
$ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "169.254*" -and $_.IPAddress -ne "127.0.0.1" } | Select-Object -ExpandProperty IPAddress -Unique

Write-Host "Iniciando visor para red local..."
Write-Host "URL local: http://127.0.0.1:$port/visor-md/"
foreach ($ip in $ips) {
  Write-Host "URL red local: http://$ip`:$port/visor-md/"
}
Write-Host "Si no abre desde otro equipo, habilita firewall para Python en red privada."

Start-WebServer -Bind "0.0.0.0" -Port $port
