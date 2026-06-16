@echo off
cd /d "%~dp0.."

echo Detectando IP de red local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "169.254"') do (
  set RAW=%%a
)
set IP=%RAW: =%

echo.
echo Iniciando visor Oro Abierto Swim en RED LOCAL...
echo URL local:     http://127.0.0.1:8080/visor-md/
echo URL red local: http://%IP%:8080/visor-md/
echo.
echo Comparte esa URL con tu celular o cualquier equipo en la misma WiFi.
echo Para cerrar el servidor, cierra esta ventana o presiona Ctrl+C.
echo.

start "" "http://127.0.0.1:8080/visor-md/"
npx --yes http-server . -p 8080 -a 0.0.0.0 -c-1
pause
