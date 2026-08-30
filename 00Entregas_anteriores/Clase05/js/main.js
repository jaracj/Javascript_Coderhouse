class Libro {
    constructor(id, titulo, autor, genero) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
    }
    mostrarInformacion() {
        return "ID: " + this.id + " - " + this.titulo + " - " + this.autor + " - " + this.genero;
    }
}

const libro1 = new Libro(1, "Harry Potter", "J. K. Rowling", "Fantasía");
const libro2 = new Libro(2, "El Señor de los Anillos", "J. R. R. Tolkien", "Fantasía");
const libro3 = new Libro(3, "1984", "George Orwell", "Ciencia ficción");
const libro4 = new Libro(4, "El Principito", "Antoine de Saint-Exupéry", "Fábula");
const libro5 = new Libro(5, "Drácula", "Bram Stoker", "Terror");

let libros = [
    libro1,
    libro2,
    libro3,
    libro4,
    libro5
];

function mostrarLibros() {
    let lista = "Catalogo de libros\n\n";
    console.log("Catalogo de libros");
    for (let libro of libros) {
        lista = lista + libro.titulo + "\n";
        console.log(libro.mostrarInformacion());
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
            let nuevoTitulo = prompt("Ingresa el nombre del libro:");
            let nuevoAutor = prompt("Ingresa el autor del libro:");
            let nuevoGenero = prompt("Ingresa el genero del libro:");
            let nuevoId = libros.length + 1;
            const nuevoLibro = new Libro(nuevoId, nuevoTitulo, nuevoAutor, nuevoGenero);
            libros.push(nuevoLibro);
            alert("Libro agregado a la biblioteca correctamente.");
            console.log("Libro agregado correctamente.");
            console.log("Libro agregado: " + nuevoLibro.mostrarInformacion());
            mostrarLibros();
            break;
        case 3:
            let tituloInicio = prompt("Ingresa el libro que desea agregar al principio del listado:");
            let autorInicio = prompt("Ingresa el autor del libro:");
            let generoInicio = prompt("Ingresa el genero del libro:");
            let idInicio = libros.length + 1;
            const libroInicio = new Libro(idInicio, tituloInicio, autorInicio, generoInicio);
            libros.unshift(libroInicio);
            alert("Libro agregado al principio del listado correctamente.");
            console.log("Libro agregado al principio.");
            console.log("Libro agregado: " + libroInicio.mostrarInformacion());
            mostrarLibros();
            break;
        case 4:
            let libroBuscado = prompt("Ingresa el nombre del libro:");
            let posicionBusqueda = libros.findIndex(libro => libro.titulo === libroBuscado);
            if (posicionBusqueda !== -1) {
                alert("El libro existe.\n\nSe encuentra en la posición: " + posicionBusqueda);
                console.log("Búsqueda realizada.");
                console.log("El libro '" + libroBuscado + "' existe.");
                console.log("Posición: " + posicionBusqueda);
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
                libros[posicion].titulo = nuevoNombre;
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
            if (libros.length > 0) {
                let eliminado = libros.pop();
                alert("Se ha eliminado el libro:\n\n" + eliminado.titulo);
                console.log("Libro eliminado: " + eliminado.mostrarInformacion());
                mostrarLibros();
            } else {
                alert("No hay libros para eliminar.");
            }
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