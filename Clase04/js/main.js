let libros = [
    "Harry Potter",
    "El Señor de los Anillos",
    "1984",
    "El Principito",
    "Drácula"
];

function mostrarLibros() {

    let lista = "Catalogo de libros\n\n";

    console.log("Catalogo de libros");

    for (let libro of libros) {

        lista = lista + libro + "\n";
        console.log(libro);

    }

    alert(lista);

}

let opcion = 0;

while (opcion != 7) {

    opcion = Number(prompt(

        "Biblioteca virtual\n\n" +

        "1 - Ver catalogo\n" +
        "2 - Agregar libro al final\n" +
        "3 - Agregar libro al principio\n" +
        "4 - Buscar libro\n" +
        "5 - Modificar un libro\n" +
        "6 - Eliminar ultimo libro\n" +
        "7 - Salir\n\n" +

        "Selecciona una opcion"

    ));

    switch (opcion) {

        case 1:

            mostrarLibros();

            break;

        case 2:

            let nuevoLibro = prompt("Ingresa el nombre del libro:");

            libros.push(nuevoLibro);

            alert("Libro agregado a la biblioteca correctamente.");

            console.log("Libro agregado correctamente.");
            console.log("Libro agregado: " + nuevoLibro);

            mostrarLibros();

            break;

        case 3:

            let libroInicio = prompt("Ingresa el libro que desea agregar al principio del listado:");

            libros.unshift(libroInicio);

            alert("Libro agregado al principio del listado correctamente.");

            console.log("Libro agregado al principio.");
            console.log("Libro agregado: " + libroInicio);

            mostrarLibros();

            break;

        case 4:

            let libroBuscado = prompt("Ingresa el nombre del libro:");

            if (libros.includes(libroBuscado)) {

                let posicion = libros.indexOf(libroBuscado);

                alert("El libro existe.\n\nSe encuentra en la posición: " + posicion);

                console.log("Búsqueda realizada.");
                console.log("El libro '" + libroBuscado + "' existe.");
                console.log("Posición: " + posicion);

            } else {

                alert("El libro no existe en el catálogo.");

                console.log("Búsqueda realizada.");
                console.log("El libro '" + libroBuscado + "' no existe.");

            }

            break;

        case 5:

            mostrarLibros();

            let posicion = Number(prompt("Ingresa la posición que desea modificar.\n\nLa primera posición es la 0."));

            if (posicion >= 0 && posicion < libros.length) {

                let nuevoNombre = prompt("Ingrese el nuevo nombre del libro:");

                libros.splice(posicion, 1, nuevoNombre);

                alert("Libro modificado correctamente.");

                console.log("Libro modificado.");
                console.log("Nueva posición: " + posicion);
                console.log("Nuevo nombre: " + nuevoNombre);

                mostrarLibros();

            } else {

                alert("La posición ingresada no es válida.");

                console.log("Intento de modificación con posición inválida.");

            }

            break;

        case 6:

            let eliminado = libros.pop();

            alert("Se ha eliminado el libro:\n\n" + eliminado);

            console.log("Libro eliminado: " + eliminado);

            mostrarLibros();

            break;

        case 7:

            alert("Gracias por visitar la Biblioteca Virtual.");

            console.log("Sesion cerrada.");

            break;

        default:

            alert("Debe ingresar una opción entre 1 y 7.");

            console.log("Opción inválida ingresada.");

    }

}

console.log("Fin del programa.");