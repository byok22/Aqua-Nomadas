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
Write-Host "Iniciando visor en localhost..."
Write-Host "URL: http://127.0.0.1:$port/visor-md/"
Start-WebServer -Bind "127.0.0.1" -Port $port
