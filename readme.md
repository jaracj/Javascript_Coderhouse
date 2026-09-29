# La Lupa Lectora — Librería Online
Proyecto Final del Curso de JavaScript de Coderhouse. Desarrollo de un simulador de e-commerce completo para una librería independiente, enfocado en DOM, asincronismo, persistencia de datos de JavaScript.

# Circuito de Compra
Paso a paso del simulador completo:
1. Exploración: Renderizado del catálogo completo de títulos.
2. Búsqueda y filtrado: Motor de búsqueda en tiempo real por coincidencia de texto en título o autor, filtrado por categorías de género y ordenamiento por criterios de precio o alfabético.
3. Interacción: Sistema para agregar ejemplares a la bolsa de compras y gestión de una lista de favoritos.
4. Gestión del carrito: Modificación de cantidades con validación estricta del stock disponible, eliminación individual de artículos o vaciado total.
5. Cálculo de totales: Actualización en tiempo real del subtotal, evaluación del costo de envío basado en un umbral de $30.000 y cálculo del total definitivo.
6. Cierre de pedido: Simulación de procesamiento de la orden mediante promesas y generación de un identificador de compra único mediante modales de interfaz.

# Cómo Ejecutar el Proyecto
Debido a que la aplicación utiliza la API fetch para consumir una base de datos local en formato JSON, los navegadores bloquean la carga si se abre el archivo index.html directamente con doble clic (protocolo file://) por políticas de seguridad CORS.
Para ejecutarlo correctamente se requiere un entorno de servidor local:
1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Utilizar la extensión Live Server.
3. Iniciar el servidor desde el archivo index.html en la raíz.

# Estructura del Proyecto
* index.html: Interfaz y estructura principal del sitio.
* css/estilos.css: Estilos finales compilados de la aplicación.
* sass/estilos.scss: Archivo fuente de estilos desarrollado en SASS.
* js/principal.js: Lógica del catálogo, motores de filtrado, gestión de favoritos, fetch de datos e inicialización del entorno del cliente.
* js/carrito.js: Lógica de la bolsa de compras, cálculo de costos de envío, operaciones de almacenamiento y checkout.
* datos/libros.json: Base de datos simulada que contiene el catálogo de títulos, precios, stock y ofertas.
* assets/img/portadas/: Repositorio local de las imágenes de las cubiertas de los libros.

Nota sobre las portadas: Para añadir o modificar un libro se debe almacenar la imagen en la carpeta assets/img/portadas/ y actualizar el nombre del archivo dentro del campo "imagen" correspondiente en datos/libros.json.

# Persistencia de Datos (Storage)
El estado de la aplicación se conserva localmente en el navegador mediante el uso de localStorage:
* Guardar y modificar (setItem): Actualiza la persistencia de la bolsa de compras y los favoritos ante cualquier alteración de cantidades o adición de elementos.
* Borrar (removeItem): Remueve las claves específicas del almacenamiento al vaciar el carrito o al finalizar exitosamente la compra.
* Vaciar (clear): Realiza una limpieza absoluta del almacenamiento del navegador mediante la función "Reiniciar mis datos" disponible en el pie de página.