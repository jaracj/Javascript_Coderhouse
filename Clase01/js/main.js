const nombreCine = "Cines Hoyts";
const precioEntrada = 15000;
const precioCombo = 5000;
const iva = 0.21;

alert("Bienvenido a " + nombreCine);

let nombreCliente = prompt("¿Cuál es tu nombre?");
let cantidadEntradas = parseInt(prompt("¿Cuántas entradas querés comprar?"));
let cantidadCombos = parseInt(prompt("¿Cuántos combos querés comprar?"));

let costoEntradas = cantidadEntradas * precioEntrada;
let costoCombos = cantidadCombos * precioCombo;
let subtotal = costoEntradas + costoCombos;
let impuesto = subtotal * iva;
let total = subtotal + impuesto;

console.log("Cliente: " + nombreCliente);
console.log("Entradas: " + costoEntradas);
console.log("Combos: " + costoCombos);
console.log("Subtotal: " + subtotal);
console.log("IVA: " + impuesto);
console.log("Total: " + total);

let mensaje = "Hola " + nombreCliente + ", tu compra en " + nombreCine + " es: " +
              "Entradas: $" + costoEntradas + " | " +
              "Combos: $" + costoCombos + " | " +
              "Subtotal: $" + subtotal + " | " +
              "IVA: $" + impuesto + " | " +
              "Total a pagar: $" + total;

alert(mensaje);