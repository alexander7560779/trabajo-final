RCM-4 “INGAVI” — SISTEMA DE SEÑALÉTICA MULTIMEDIA Y DIGITAL
Versión 5 · encabezado y panel translúcidos sobre el mapa
Orientación espacial en el RCM-4 Ingavi, ciudad de El Alto

CÓMO ABRIR
1. Extraiga el ZIP en una carpeta.
2. Abra mapa.html (o index.html) con un navegador actualizado.
3. Escriba el destino o seleccione un marcador B–J.
4. Se mostrará únicamente la ruta elegida desde A, con flechas, distancia,
   tiempo estimado e indicaciones. Puede ampliar, mover u ocultar el panel.
5. “Iniciar guía” permite recorrer las indicaciones manualmente con
   Anterior/Siguiente. No reproduce audio ni avanza por sí solo.
   “Ver ruta completa” vuelve a encuadrar el trayecto entero.
   El altavoz reproduce la presentación y luego cada tramo por separado:
   el mapa enfoca y resalta el tramo cuando comienza a sonar su indicación.
   Al terminar la locución de un tramo, reproduce el siguiente hasta llegar.
   “Detener audio” cancela el avance y conserva el último tramo mostrado.
   Cambiar de destino, pulsar Inicio o usar los pasos manuales detiene el audio.
6. Las tres vistas están abajo a la derecha, debajo del zoom:
   Croquis, Plano original y Satelital. El cambio conserva la ruta y el paso.
7. “Inicio” limpia la ruta, cierra la guía y vuelve a los nueve destinos.
   Conserva la vista y el ritmo elegidos.
8. El botón superior derecho solicita pantalla completa al navegador.
9. El título institucional está en MAYÚSCULAS y se ajusta a la pantalla,
   con el logo recibido a ambos lados. El encabezado y los logos tienen
   un efecto suave de marca de agua; el panel deja ver el mapa detrás.
   Los textos y controles conservan contraste para leer y elegir rutas.
   Puede ocultar el panel para ampliar el área del mapa.
10. El croquis inicial prioriza el área de destinos con mayor tamaño.
    El botón de encuadre junto al zoom permite ver el recinto completo.

PUNTOS CORRECTOS DEL PLANO
A  Inicio (confirmado por el usuario).
B  Comando                        171,68 m
C  Escuela de Idiomas             256,52 m
D  Cancha de Fútbol                545,95 m
E  Compañía de ICIA y REC.         665,63 m
F  Batallón de Transporte          528,05 m
G  Polígono de Tiro                322,59 m
H  Coliseo                        872,10 m
I  Viviendas Militares            656,15 m
J  CEO                            626,66 m

ENTRADAS INDEPENDIENTES
mapa.html / index.html: mapa general y buscador.
mapa1.html: A → F (Batallón de Transporte).
mapa2.html: A → D (Cancha de Fútbol).
mapa3.html: A → C (Escuela de Idiomas).
mapa4.html: A → B (Comando).
mapa5.html: A → I (Viviendas Militares).
mapa6.html: A → G (Polígono de Tiro).
mapa7.html: A → H (Coliseo).
mapa8.html: A → J (CEO).
mapa9.html: A → E (Compañía de ICIA y REC.).
mapa10.html: mapa general.
También puede usar mapa.html#B, mapa.html#C, etc., para abrir una ruta.
Cada HTML lleva su propio CSS, JavaScript, croquis SVG y plano original;
no necesita descargar librerías ni ejecutar un servidor.
Croquis, plano original y rutas funcionan sin conexión. La imagen satelital
se consulta en línea y requiere internet. Si el servicio no responde, se
muestra el croquis de respaldo con el botón “Reintentar”.

FUNCIONES
- Mapa que ocupa toda la ventana, con diseño adaptable a móviles.
- Rutas individuales desde A, flechas y resaltado del paso seleccionado.
- Zoom con botones o rueda; arrastre; gesto de pinza en pantallas táctiles.
- Buscador que acepta nombres, letras y textos sin tildes.
- Guía manual por pasos con botones anterior/siguiente.
- Audio secuencial sincronizado con el tramo resaltado y su encuadre.
  Requiere un navegador con síntesis de voz disponible. Sin audio no existe
  avance automático; la guía manual continúa disponible.
- Cancelación de voz y protección frente a eventos de audio atrasados
  al detener la reproducción, cambiar de ruta o regresar a Inicio.
- Ritmos de 3, 4 y 5 km/h; tiempo calculado al cambiar el ritmo.
- Tres vistas sincronizadas: croquis, plano original y satelital.
- Inicio visible para escoger otra ruta; impresión del recorrido seleccionado.
- Controles con etiquetas accesibles, navegación por teclado y respeto de
  la preferencia del dispositivo de reducir animaciones.

PROCEDENCIA Y ALCANCE
La fuente es el PDF HUAYHUA 2, lámina 2, septiembre de 2026. Se corrigieron
las correspondencias de letras y destinos de la versión anterior.
A es el punto de inicio confirmado por el usuario en esta revisión.
Las distancias se transcribieron de los rótulos de la lámina. Los caminos
se digitalizaron visualmente siguiendo las vías dibujadas. El croquis es
orientativo: las entradas exactas y la transitabilidad de cada acceso
requieren comprobación en el recinto antes de usarlo como guía oficial.
Las instrucciones siguen la orientación del mapa mostrado. No se han
asignado puntos cardinales que el documento no identifica.
No hay GPS ni localización automática: “Iniciar guía” recorre indicaciones
en pantalla y no confirma que la persona se esté moviendo.

TIEMPOS
Segundos = metros × 3,6 / velocidad en km/h; se redondea al segundo.
Velocidad inicial: 3 km/h, igual a la indicada en la lámina.
Escuela de Idiomas: 256,52 m → 5 min 08 s a 3 km/h.
CEO: 626,66 m → 12 min 32 s a 3 km/h.
Los tiempos impresos en la lámina para esos puntos son inconsistentes con
su distancia y velocidad; aquí se aplica una fórmula común.

CÓDIGO EDITABLE
codigo/interfaz.html: estructura HTML.
codigo/estilos.css: diseño, adaptación móvil e impresión.
codigo/datos.js: puntos, distancias, polilíneas e indicaciones.
codigo/aplicacion.js: buscador, navegación, zoom, panel y voz.
codigo/croquis.svg: representación vectorial de las instalaciones.
codigo/construir.py: incorpora estos componentes en cada HTML autónomo.
codigo/satelite.json: servicio, encuadre y alineación visual de la imagen aérea.
assets/logo-ingavi.png: logo original adjuntado por el usuario.
assets/plano-recortado.jpg: plano base alineado con el croquis.
assets/plano-rcm4.jpg: reproducción de la lámina completa recibida.

Para regenerar las páginas después de editar el código:
  python codigo/construir.py
Requiere Python 3 solo para regenerar archivos, no para usar el sistema.
Las coordenadas usan el sistema de la página PDF original (1191 × 842).
Cada paso tiene un listado points. Debe comenzar donde terminó el anterior.
Las distancias de los rótulos y la geometría visual se mantienen por separado:
la aplicación no presenta las medidas del dibujo digitalizado como mediciones.

VISTA SATELITAL
Esri World Imagery, consultado el 29 de septiembre de 2026.
Servicio:
https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer
Créditos del servicio: Esri, Vantor, Earthstar Geographics, and the GIS User Community.
https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9
Las imágenes se solicitan directamente al servicio; no se distribuye una
copia satelital en el ZIP. Los créditos permanecen visibles sobre el mapa.
La fecha de consulta no es la fecha de captura: no es una imagen en vivo.

La alineación es aproximada: una transformación afín calculada mediante
siete coincidencias visuales (acceso, coliseo, rotonda y esquinas de cancha).
Se rota la imagen al sistema del plano para conservar las mismas rutas y
las instrucciones de giro. Esto NO convierte el plano en una medición GPS.
El ajuste debe validarse en el terreno; el recorrido continúa basándose en
los caminos del documento proporcionado, no en un cálculo automático de
rutas sobre fotografía. No se recalculan distancias a partir de la imagen.
Las referencias de ajuste están documentadas en codigo/satelite.json.

Al imprimir la vista satelital, conserve los créditos. La disponibilidad
y condiciones del servicio externo son independientes de este HTML.

SINCRONIZACIÓN DEL AUDIO
La presentación y cada tramo tienen una locución independiente. El evento
start del motor de voz activa y enfoca el tramo; end solicita la siguiente
locución. No se usan tiempos estimados de lectura para mover el mapa.
Al terminar el último tramo aparece el destino. Detener el audio invalida
los eventos pendientes: no pueden iniciar ni avanzar una ruta nueva.
Las tres vistas conservan la misma guía y pueden cambiarse durante el audio.
La calidad y disponibilidad de la voz dependen del navegador y del equipo.
