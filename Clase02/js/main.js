let stockRemera = 10;
let stockPantalon = 5;
let stockZapatilla = 3;
let continuar = true;

alert("Simulador de Compras");

while (continuar) {
    let opcion = prompt(
        "Stock actual:\n" +
        "- Remeras: " + stockRemera + "\n" +
        "- Pantalones: " + stockPantalon + "\n" +
        "- Zapatillas: " + stockZapatilla + "\n\n" +
        "1. Vender producto\n" +
        "2. Reponer stock\n" +
        "3. Salir"
    );

    if (opcion === null) {
        continuar = false;
        break;
    }

    if (opcion === '1') {
        let producto = prompt(
            "Que producto vas a vender?\n" +
            "1. Remera\n" +
            "2. Pantalon\n" +
            "3. Zapatilla"
        );
        
        let cantidad = parseInt(prompt("Cantidad:"));
        
        if (producto === '1') {
            if (cantidad <= stockRemera && cantidad > 0) {
                stockRemera = stockRemera - cantidad;
                alert("Venta realizada. Remeras restantes: " + stockRemera);
                console.log("Venta: " + cantidad + " remeras");
            } else {
                alert("Stock insuficiente o cantidad invalida");
            }
        } else if (producto === '2') {
            if (cantidad <= stockPantalon && cantidad > 0) {
                stockPantalon = stockPantalon - cantidad;
                alert("Venta realizada. Pantalones restantes: " + stockPantalon);
                console.log("Venta: " + cantidad + " pantalones");
            } else {
                alert("Stock insuficiente o cantidad invalida");
            }
        } else if (producto === '3') {
            if (cantidad <= stockZapatilla && cantidad > 0) {
                stockZapatilla = stockZapatilla - cantidad;
                alert("Venta realizada. Zapatillas restantes: " + stockZapatilla);
                console.log("Venta: " + cantidad + " zapatillas");
            } else {
                alert("Stock insuficiente o cantidad invalida");
            }
        } else {
            alert("Producto invalido");
        }
        
    } else if (opcion === '2') {
        let producto = prompt(
            "Que producto vas a reponer?\n" +
            "1. Remera\n" +
            "2. Pantalon\n" +
            "3. Zapatilla"
        );
        
        let cantidad = parseInt(prompt("Cantidad a reponer:"));
        
        if (producto === '1') {
            stockRemera = stockRemera + cantidad;
            alert("Stock repuesto. Remeras totales: " + stockRemera);
            console.log("Reposicion: " + cantidad + " remeras");
        } else if (producto === '2') {
            stockPantalon = stockPantalon + cantidad;
            alert("Stock repuesto. Pantalones totales: " + stockPantalon);
            console.log("Reposicion: " + cantidad + " pantalones");
        } else if (producto === '3') {
            stockZapatilla = stockZapatilla + cantidad;
            alert("Stock repuesto. Zapatillas totales: " + stockZapatilla);
            console.log("Reposicion: " + cantidad + " zapatillas");
        } else {
            alert("Producto invalido");
        }
        
    } else if (opcion === '3') {
        continuar = false;
        alert("Sistema cerrado");
    } else {
        alert("Opcion no valida");
    }
}

console.log("Stock final - Remeras: " + stockRemera + ", Pantalones: " + stockPantalon + ", Zapatillas: " + stockZapatilla);