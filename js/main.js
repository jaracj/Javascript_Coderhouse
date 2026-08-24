class Libro {
    constructor(id, titulo, autor, genero, paginas) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.paginas = paginas;
    }

    mostrarInformacion() {
        return `ID: ${this.id} | "${this.titulo}" de ${this.autor} | Genero: ${this.genero} | Paginas: ${this.paginas}`;
    }
}

const libro1 = new Libro(1, "Harry Potter", "J. K. Rowling", "Fantasia", 350);
const libro2 = new Libro(2, "El Senor de los Anillos", "J. R. R. Tolkien", "Fantasia", 1200);
const libro3 = new Libro(3, "1984", "George Orwell", "Ciencia ficcion", 328);
const libro4 = new Libro(4, "El Principito", "Antoine de Saint-Exupery", "Fabula", 96);
const libro5 = new Libro(5, "Dracula", "Bram Stoker", "Terror", 418);

let libros = [libro1, libro2, libro3, libro4, libro5];

function mostrarLibros() {
    let lista = "Catalogo de libros:\n\n";
    console.clear();
    console.log("=== Catalogo de libros ===");
    for (let libro of libros) {
        lista += libro.titulo + "\n";
        console.log(libro.mostrarInformacion());
    }
    alert(lista);
}

let opcion = 0;

while (opcion != 9) {
    opcion = Number(prompt(
        "Biblioteca Virtual\n\n" +
        "1 - Ver catalogo completo\n" +
        "2 - Agregar libro al final\n" +
        "3 - Agregar libro al principio\n" +
        "4 - Buscar libro por titulo (find)\n" +
        "5 - Filtrar libros por genero (filter)\n" +
        "6 - Modificar un libro\n" +
        "7 - Eliminar ultimo libro\n" +
        "8 - Resumen de biblioteca (map & reduce)\n" +
        "9 - Salir\n\n" +
        "Selecciona una opcion (1-9):"
    ));

    switch (opcion) {
        case 1:
            mostrarLibros();
            break;

        case 2:
            let nuevoTitulo = prompt("Ingresa el nombre del libro:");
            let nuevoAutor = prompt("Ingresa el autor del libro:");
            let nuevoGenero = prompt("Ingresa el genero del libro:");
            let nuevasPaginas = Number(prompt("Ingresa la cantidad de paginas:"));
            let nuevoId = libros.length > 0 ? Math.max(...libros.map(l => l.id)) + 1 : 1;
            
            const nuevoLibro = new Libro(nuevoId, nuevoTitulo, nuevoAutor, nuevoGenero, nuevasPaginas);
            libros.push(nuevoLibro);
            alert("Libro agregado al final correctamente.");
            console.log("Libro agregado: " + nuevoLibro.mostrarInformacion());
            break;

        case 3:
            let tituloInicio = prompt("Ingresa el nombre del libro:");
            let autorInicio = prompt("Ingresa el autor del libro:");
            let generoInicio = prompt("Ingresa el genero del libro:");
            let paginasInicio = Number(prompt("Ingresa la cantidad de paginas:"));
            let idInicio = libros.length > 0 ? Math.max(...libros.map(l => l.id)) + 1 : 1;
            
            const libroInicio = new Libro(idInicio, tituloInicio, autorInicio, generoInicio, paginasInicio);
            libros.unshift(libroInicio);
            alert("Libro agregado al principio correctamente.");
            console.log("Libro agregado: " + libroInicio.mostrarInformacion());
            break;

        case 4:
            let busquedaTitulo = prompt("Ingresa el nombre del libro a buscar:").toLowerCase();
            const libroEncontrado = libros.find(libro => libro.titulo.toLowerCase() === busquedaTitulo);
            
            if (libroEncontrado) {
                alert("Libro encontrado:\n\n" + libroEncontrado.mostrarInformacion());
                console.log("Busqueda exitosa:", libroEncontrado);
            } else {
                alert("El libro no existe en el catalogo.");
                console.log("Busqueda fallida: No se encontro '" + busquedaTitulo + "'");
            }
            break;

        case 5:
            let generoBuscado = prompt("Ingresa el genero para filtrar (ej: Fantasia, Terror):").toLowerCase();
            const librosFiltrados = libros.filter(libro => libro.genero.toLowerCase() === generoBuscado);
            
            if (librosFiltrados.length > 0) {
                let mensaje = `Se encontraron ${librosFiltrados.length} libro(s) de genero '${generoBuscado}':\n\n`;
                librosFiltrados.forEach(l => {
                    mensaje += "- " + l.titulo + " (" + l.autor + ")\n";
                });
                alert(mensaje);
                console.log("Filtro aplicado:", librosFiltrados);
            } else {
                alert("No se encontraron libros con ese genero.");
                console.log("Filtro sin resultados.");
            }
            break;

        case 6:
            mostrarLibros();
            let posicion = Number(prompt("Ingresa la posicion que desea modificar (La primera posicion es la 0):"));
            if (posicion >= 0 && posicion < libros.length) {
                let nuevoNombre = prompt("Ingrese el nuevo nombre del libro:");
                libros[posicion].titulo = nuevoNombre;
                alert("Libro modificado correctamente.");
                console.log(`Libro en posicion ${posicion} modificado a: ${nuevoNombre}`);
            } else {
                alert("La posicion ingresada no es valida.");
            }
            break;

        case 7:
            if (libros.length > 0) {
                let eliminado = libros.pop();
                alert("Se ha eliminado el libro:\n\n" + eliminado.titulo);
                console.log("Libro eliminado: " + eliminado.mostrarInformacion());
            } else {
                alert("No hay libros para eliminar.");
            }
            break;

        case 8:
            const soloTitulos = libros.map(libro => libro.titulo);
            const totalPaginas = libros.reduce((acumulador, libro) => acumulador + libro.paginas, 0);
            
            let resumen = `RESUMEN DE LA BIBLIOTECA\n\n`;
            resumen += `Total de libros: ${libros.length}\n`;
            resumen += `Total de paginas en la biblioteca: ${totalPaginas}\n\n`;
            resumen += `Titulos disponibles:\n- ${soloTitulos.join("\n- ")}`;
            
            alert(resumen);
            console.log("Resumen generado. Total paginas:", totalPaginas);
            console.log("Array de solo titulos:", soloTitulos);
            break;

        case 9:
            alert("Gracias por visitar la Biblioteca Virtual.");
            console.log("Sesion cerrada.");
            break;

        default:
            alert("Debe ingresar una opcion valida entre 1 y 9.");
            console.log("Opcion invalida ingresada.");
    }
}

console.log("Fin del programa.");