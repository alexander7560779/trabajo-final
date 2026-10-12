#!/usr/bin/env python3
"""Genera HTML autónomos. Uso: python codigo/construir.py. Solo biblioteca estándar."""
from pathlib import Path
import base64,json
src=Path(__file__).resolve().parent
root=src.parent
html=(src/'interfaz.html').read_text(encoding='utf8')
icons=json.loads((src/'iconos.json').read_text(encoding='utf8'))
for item in icons.values():
 item['src']='data:image/png;base64,'+base64.b64encode((root/item['file']).read_bytes()).decode('ascii')
values={
 '__MARKER_ASSETS__':json.dumps(icons,ensure_ascii=False,separators=(',',':')),
 '__ICONOS__':(src/'iconos.js').read_text(encoding='utf8'),
 '__CSS__':(src/'estilos.css').read_text(encoding='utf8'),
 '__MAP__':(src/'croquis.svg').read_text(encoding='utf8'),
 '__DATA__':(src/'datos.js').read_text(encoding='utf8'),
 '__JS__':(src/'aplicacion.js').read_text(encoding='utf8'),
 '__IMAGE__':'data:image/jpeg;base64,'+base64.b64encode((root/'assets/plano-recortado.jpg').read_bytes()).decode('ascii'),
 '__LOGO__':'data:image/png;base64,'+base64.b64encode((root/'assets/logo-ingavi.png').read_bytes()).decode('ascii'),
 '__SATELLITE__':(src/'satelite.json').read_text(encoding='utf8')
}
for token,value in values.items():html=html.replace(token,value)
entries={'mapa.html':None,'mapa1.html':'F','mapa2.html':'D','mapa3.html':'C','mapa4.html':'B','mapa5.html':'I','mapa6.html':'G','mapa7.html':'H','mapa8.html':'J','mapa9.html':'E','mapa10.html':None,'index.html':None}
for filename,dest in entries.items():
 (root/filename).write_text(html.replace('__INITIAL__',json.dumps(dest)),encoding='utf8')
print(f'{len(entries)} HTML construidos en {root}')
