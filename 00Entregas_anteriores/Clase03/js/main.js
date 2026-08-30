let stockRemera = 10, precioRemera = 5000;
let stockPantalon = 5, precioPantalon = 12000;
let stockZapatilla = 3, precioZapatilla = 25000;

let totalCarrito = 0;
let itemsComprados = 0;
let continuar = true;

function obtenerProducto(opcion) {
    if (opcion === '1') return { nombre: "Remera", precio: precioRemera, stock: stockRemera };
    if (opcion === '2') return { nombre: "Pantalón", precio: precioPantalon, stock: stockPantalon };
    if (opcion === '3') return { nombre: "Zapatilla", precio: precioZapatilla, stock: stockZapatilla };
    return null;
}

const calcularSubtotal = (precio, cantidad) => precio * cantidad;

const descontarStock = function(opcion, cantidad) {
    if (opcion === '1') stockRemera -= cantidad;
    if (opcion === '2') stockPantalon -= cantidad;
    if (opcion === '3') stockZapatilla -= cantidad;
};

function mostrarResumen(total, items) {
    alert(`¡Gracias por tu compra!\nProductos adquiridos: ${items}\nTotal abonado: $${total}`);
    console.log(`Compra finalizada. Total: $${total} | Items: ${items}`);
}

alert("¡Bienvenido al Local!");

while (continuar) {
    let opcion = prompt(
        `Productos disponibles:\n` +
        `1. Remera ($${precioRemera}) - Stock: ${stockRemera}\n` +
        `2. Pantalón ($${precioPantalon}) - Stock: ${stockPantalon}\n` +
        `3. Zapatilla ($${precioZapatilla}) - Stock: ${stockZapatilla}\n\n` +
        `4. Finalizar compra y pagar\n` +
        `5. Salir`
    );

    if (opcion === null || opcion === '5') {
        continuar = false;
        totalCarrito > 0 ? mostrarResumen(totalCarrito, itemsComprados) : alert("No realizaste ninguna compra. ¡Hasta la próxima!");
        break;
    }

    if (['1', '2', '3'].includes(opcion)) {
        let producto = obtenerProducto(opcion);
        let cantidad = parseInt(prompt(`¿Cuántas unidades de ${producto.nombre} querés llevar?`));

        if (isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor, ingresá un número mayor a 0.");
            continue;
        }

        if (cantidad <= producto.stock) {
            let subtotal = calcularSubtotal(producto.precio, cantidad);
            
            descontarStock(opcion, cantidad);
            totalCarrito += subtotal;
            itemsComprados += cantidad;

            alert(`Agregado: ${cantidad} ${producto.nombre}(s). Subtotal: $${subtotal}`);
            console.log(`Agregado: ${cantidad} ${producto.nombre} | Subtotal: $${subtotal}`);
        } else {
            alert(`Stock insuficiente. Solo quedan ${producto.stock} unidades disponibles.`);
        }

    } else if (opcion === '4') {
        continuar = false;
        totalCarrito > 0 ? mostrarResumen(totalCarrito, itemsComprados) : alert("El carrito está vacío.");
    } else {
        alert("Opción no válida, por favor seleccioná una opción del menú.");
    }
}

console.log(`Stock final -> Remeras: ${stockRemera} | Pantalones: ${stockPantalon} | Zapatillas: ${stockZapatilla}`);