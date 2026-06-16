# Visor HTML de Documentos Markdown

Visor simple para navegar y leer todos los archivos .md del proyecto.

## Requisitos
- Python instalado (python o py en PATH).
- O Node.js instalado (npx en PATH).

## Opcion 1: Solo localhost
1. Abre PowerShell en esta carpeta.
2. Ejecuta:
   ./iniciar_localhost.ps1
3. Abre en navegador:
   http://127.0.0.1:8080/visor-md/

Nota:
- El script intenta Python primero.
- Si Python no existe, usa npx http-server automaticamente.

## Opcion 2: Red local (misma WiFi/LAN)
1. Abre PowerShell en esta carpeta.
2. Ejecuta:
   ./iniciar_red_local.ps1
3. Desde tu PC: http://127.0.0.1:8080/visor-md/
4. Desde celular u otro equipo: usa la URL IP que imprime el script.

## Notas
- Si agregas nuevos .md, actualiza md-index.json.
- Este visor usa la libreria marked por CDN para renderizar Markdown.
- Si la red bloquea CDN, el visor puede mostrar Markdown sin formato.
