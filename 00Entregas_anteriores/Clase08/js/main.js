class Libro {
    constructor(id, titulo, autor, genero, paginas) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.paginas = paginas;
    }
}

let librosIniciales = [
    new Libro(1, "Harry Potter", "J. K. Rowling", "Fantasia", 350),
    new Libro(2, "El Senor de los Anillos", "J. R. R. Tolkien", "Fantasia", 1200),
    new Libro(3, "1984", "George Orwell", "Ciencia ficcion", 328),
    new Libro(4, "El Principito", "Antoine de Saint-Exupery", "Fabula", 96),
    new Libro(5, "Dracula", "Bram Stoker", "Terror", 418)
];

const librosGuardados = localStorage.getItem("libros");
let libros = librosGuardados ? JSON.parse(librosGuardados) : librosIniciales;

const formLibro = document.getElementById("form-libro");
const inputTitulo = document.getElementById("input-titulo");
const inputAutor = document.getElementById("input-autor");
const inputGenero = document.getElementById("input-genero");
const inputPaginas = document.getElementById("input-paginas");
const contenedorLibros = document.getElementById("contenedor-libros");
const inputBusqueda = document.getElementById("input-busqueda");
const filtroGenero = document.getElementById("filtro-genero");
const btnResumen = document.getElementById("btn-resumen");
const mensajeFeedback = document.getElementById("mensaje-feedback");
const mensajeVacio = document.getElementById("mensaje-vacio");
const statTotal = document.getElementById("stat-total");
const statPaginas = document.getElementById("stat-paginas");
const statGeneros = document.getElementById("stat-generos");

function mostrarFeedback(texto, tipo) {
    mensajeFeedback.textContent = texto;
    mensajeFeedback.className = "";
    mensajeFeedback.classList.add("feedback-" + tipo);
    mensajeFeedback.classList.remove("oculto");

    setTimeout(() => {
        mensajeFeedback.classList.add("oculto");
    }, 2500);
}

function generarId() {
    return libros.length > 0 ? Math.max(...libros.map(l => l.id)) + 1 : 1;
}

function actualizarEstadisticas() {
    const totalPaginas = libros.reduce((acc, libro) => acc + libro.paginas, 0);
    const generosUnicos = new Set(libros.map(l => l.genero));

    statTotal.textContent = libros.length;
    statPaginas.textContent = totalPaginas;
    statGeneros.textContent = generosUnicos.size;
}

function actualizarFiltroGeneros() {
    const generos = [...new Set(libros.map(l => l.genero))].sort();
    const generoActual = filtroGenero.value;

    filtroGenero.innerHTML = '<option value="">Todos los generos</option>';
    generos.forEach(g => {
        const option = document.createElement("option");
        option.value = g;
        option.textContent = g;
        filtroGenero.appendChild(option);
    });

    filtroGenero.value = generoActual;
}

function renderizarLibros() {
    const textoBusqueda = inputBusqueda.value.toLowerCase().trim();
    const generoSeleccionado = filtroGenero.value;

    let librosFiltrados = libros.filter(libro => {
        const coincideTitulo = libro.titulo.toLowerCase().includes(textoBusqueda);
        const coincideGenero = generoSeleccionado === "" || libro.genero === generoSeleccionado;
        return coincideTitulo && coincideGenero;
    });

    contenedorLibros.innerHTML = "";

    if (librosFiltrados.length === 0) {
        mensajeVacio.classList.remove("oculto");
    } else {
        mensajeVacio.classList.add("oculto");
        librosFiltrados.forEach(libro => {
            const { titulo, autor, paginas, genero } = libro;
        
            const div = document.createElement("div");
            div.className = "libro-card";
            div.innerHTML = `
                <div class="libro-info">
                    <h3>${titulo}</h3>
                    <p><strong>${autor}</strong> &mdash; ${paginas} paginas</p>
                    <span class="genero">${genero}</span>
                </div>
                <button class="btn-eliminar" data-id="${libro.id}">Eliminar</button>
            `;
            contenedorLibros.appendChild(div);
        });
    }

    actualizarEstadisticas();
    actualizarFiltroGeneros();
}

function eliminarLibro(id) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;

    libros = libros.filter(l => l.id !== id);
    localStorage.setItem("libros", JSON.stringify(libros));
    mostrarFeedback(`"${libro.titulo}" eliminado del catalogo.`, "error");
    renderizarLibros();
}

formLibro.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const genero = inputGenero.value.trim();
    const paginas = Number(inputPaginas.value);

    if (!titulo || !autor || !genero || !paginas) {
        mostrarFeedback("Completa todos los campos correctamente.", "error");
        return;
    }

    const nuevoLibro = new Libro(generarId(), titulo, autor, genero, paginas);
    libros.push(nuevoLibro);
    localStorage.setItem("libros", JSON.stringify(libros));

    mostrarFeedback(`"${titulo}" agregado al catalogo.`, "exito");

    formLibro.reset();
    renderizarLibros();
});

contenedorLibros.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
        const id = Number(e.target.dataset.id);
        eliminarLibro(id);
    }
});

inputBusqueda.addEventListener("input", () => {
    renderizarLibros();
});

filtroGenero.addEventListener("change", () => {
    renderizarLibros();
});

btnResumen.addEventListener("click", () => {
    if (libros.length === 0) {
        mostrarFeedback("No hay libros para resumir.", "info");
        return;
    }

    const soloTitulos = libros.map(l => l.titulo);
    const totalPaginas = libros.reduce((acc, l) => acc + l.paginas, 0);
    const promedio = Math.round(totalPaginas / libros.length);

    mostrarFeedback(
        `Total: ${libros.length} libros | ${totalPaginas} paginas | Promedio: ${promedio} pag/libro`,
        "info"
    );
});

document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        inputBusqueda.focus();
    }
});

renderizarLibros();