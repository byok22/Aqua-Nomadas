@echo off
cd /d "%~dp0.."
echo Iniciando visor Oro Abierto Swim...
echo URL: http://127.0.0.1:8080/visor-md/
start "" "http://127.0.0.1:8080/visor-md/"
npx --yes http-server . -p 8080 -a 127.0.0.1 -c-1
pause
