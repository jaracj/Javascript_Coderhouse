const CLAVE_CARRITO = "lupa_carrito";
const CLAVE_FAVORITOS = "lupa_favoritos";
const UMBRAL_ENVIO_GRATIS = 30000;
const COSTO_ENVIO = 3500;

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

function guardarEnAlmacenamiento(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    avisar("No se pudieron guardar tus datos en este navegador", "#8A3033");
  }
}

function obtenerDeAlmacenamiento(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave));
  } catch {
    return null;
  }
}

function borrarDeAlmacenamiento(clave) {
  localStorage.removeItem(clave);
}

function avisar(mensaje, fondo = "#17303A") {
  Toastify({
    text: mensaje,
    duration: 2600,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: { background: fondo, borderRadius: "8px", fontFamily: "inherit" },
  }).showToast();
}

let librosCatalogo = [];
let generoActivo = "todos";
let textoBusqueda = "";
let criterioOrden = "relevancia";
let listaFavoritos = obtenerDeAlmacenamiento(CLAVE_FAVORITOS) || [];

const grillaLibros = document.getElementById("grilla-libros");
const estadoVacio = document.getElementById("estado-vacio");
const estadoError = document.getElementById("estado-error");
const contadorResultados = document.getElementById("contador-resultados");
const campoBusqueda = document.getElementById("campo-busqueda");
const chipsGenero = document.getElementById("chips-genero");
const selectorOrden = document.getElementById("selector-orden");
const cifraTitulos = document.getElementById("cifra-titulos");
const cifraGeneros = document.getElementById("cifra-generos");
const estanteNovedades = document.getElementById("estante-novedades");
const contadorFavoritos = document.getElementById("contador-favoritos");

async function cargarCatalogo() {
  mostrarEsqueletos();
  try {
    const respuesta = await fetch("datos/libros.json");
    if (!respuesta.ok) {
      throw new Error(`Respuesta del servidor: ${respuesta.status}`);
    }
    librosCatalogo = await respuesta.json();
    pintarChipsGenero();
    pintarCatalogo();
    pintarNovedades();
    pintarEscaparate();
    sincronizarCarritoConCatalogo();
  } catch {
    grillaLibros.classList.add("oculto");
    estadoVacio.classList.add("oculto");
    estadoError.classList.remove("oculto");
    contadorResultados.textContent = "Catálogo no disponible";
  } finally {
    grillaLibros.setAttribute("aria-busy", "false");
  }
}

function mostrarEsqueletos() {
  const tarjetaEsqueleto = `
    <article class="tarjeta-libro tarjeta-esqueleto">
      <div class="esqueleto-portada"></div>
      <div class="esqueleto-linea"></div>
      <div class="esqueleto-linea corta"></div>
    </article>`;
  grillaLibros.classList.remove("oculto");
  grillaLibros.setAttribute("aria-busy", "true");
  grillaLibros.innerHTML = tarjetaEsqueleto.repeat(8);
}

function pintarChipsGenero() {
  const recuento = librosCatalogo.reduce((generos, { genero }) => {
    generos[genero] = (generos[genero] || 0) + 1;
    return generos;
  }, {});

  const chips = Object.entries(recuento)
    .sort(([generoA], [generoB]) => generoA.localeCompare(generoB, "es"))
    .map(
      ([genero, cantidad]) => `
      <button class="chip" data-genero="${genero}" aria-pressed="false">
        ${genero} <span class="chip-cantidad">${cantidad}</span>
      </button>`
    )
    .join("");

  chipsGenero.innerHTML = `
    <button class="chip activo" data-genero="todos" aria-pressed="true">
      Todos <span class="chip-cantidad">${librosCatalogo.length}</span>
    </button>${chips}`;
}

function filtrarLibros() {
  const consulta = textoBusqueda.toLowerCase();

  let resultado = librosCatalogo.filter((libro) => {
    const coincideGenero = generoActivo === "todos" || libro.genero === generoActivo;
    const coincideTexto =
      consulta === "" ||
      libro.titulo.toLowerCase().includes(consulta) ||
      libro.autor.toLowerCase().includes(consulta);
    return coincideGenero && coincideTexto;
  });

  if (criterioOrden === "precio-asc") {
    resultado = [...resultado].sort((libroA, libroB) => libroA.precio - libroB.precio);
  } else if (criterioOrden === "precio-desc") {
    resultado = [...resultado].sort((libroA, libroB) => libroB.precio - libroA.precio);
  } else if (criterioOrden === "titulo") {
    resultado = [...resultado].sort((libroA, libroB) =>
      libroA.titulo.localeCompare(libroB.titulo, "es")
    );
  }
  return resultado;
}

function plantillaTarjeta(libro) {
  const { id, titulo, autor, genero, precio, precioAnterior, stock, nuevo } = libro;
  const esFavorito = listaFavoritos.includes(id);
  const descuento = precioAnterior
    ? Math.round((1 - precio / precioAnterior) * 100)
    : 0;

  const etiquetas = `
    ${precioAnterior ? `<span class="etiqueta etiqueta-oferta">-${descuento}%</span>` : ""}
    ${nuevo ? `<span class="etiqueta etiqueta-nuevo">Nuevo</span>` : ""}`;

  const botonCompra =
    stock === 0
      ? `<button class="boton-agregar" disabled>Sin stock</button>`
      : `<button class="boton-agregar" data-accion="agregar" data-id="${id}">Agregar a la bolsa</button>`;

  const notaStock =
    stock > 0 && stock <= 4
      ? `<p class="nota-stock">Quedan ${stock} ejemplares</p>`
      : "";

  return `
  <article class="tarjeta-libro" data-tarjeta="${id}">
    <div class="tarjeta-portada">
      <img src="${libro.imagen}" alt="Tapa de ${titulo}, de ${autor}"
           loading="lazy" data-id="${id}">
      ${etiquetas}
      <button class="boton-favorito ${esFavorito ? "activo" : ""}"
              data-accion="favorito" data-id="${id}"
              aria-pressed="${esFavorito}" aria-label="Guardar ${titulo} en favoritos">
        <span class="material-symbols-outlined">favorite</span>
      </button>
    </div>
    <div class="tarjeta-info">
      <p class="tarjeta-genero">${genero} · ${libro.editorial}</p>
      <h3 class="tarjeta-titulo">${titulo}</h3>
      <p class="tarjeta-autor">${autor}</p>
      <p class="tarjeta-resena">${libro.resena}</p>
      <div class="tarjeta-precios">
        <span class="precio">${formatearPrecio(precio)}</span>
        ${precioAnterior ? `<span class="precio-anterior">${formatearPrecio(precioAnterior)}</span>` : ""}
      </div>
      ${notaStock}
      ${botonCompra}
    </div>
  </article>`;
}

function plantillaNovedad(libro) {
  const { id, titulo, autor, precio, precioAnterior } = libro;
  return `
  <article class="libro-novedad" data-tarjeta="${id}">
    <div class="novedad-portada">
      <img src="${libro.imagen}" alt="Tapa de ${titulo}, de ${autor}" loading="lazy" data-id="${id}">
    </div>
    <div class="novedad-datos">
      <p class="novedad-titulo">${titulo}</p>
      <p class="novedad-autor">${autor}</p>
      <p class="novedad-precio">
        ${formatearPrecio(precio)}
        ${precioAnterior ? `<s>${formatearPrecio(precioAnterior)}</s>` : ""}
      </p>
      <div class="novedad-acciones">
        <button class="boton-agregar compacto" data-accion="agregar" data-id="${id}">+ Bolsa</button>
        <button class="boton-favorito ${listaFavoritos.includes(id) ? "activo" : ""}"
                data-accion="favorito" data-id="${id}" aria-label="Guardar en favoritos">
          <span class="material-symbols-outlined">favorite</span>
        </button>
      </div>
    </div>
  </article>`;
}

function pintarCatalogo() {
  const visibles = filtrarLibros();

  estadoError.classList.add("oculto");

  if (visibles.length === 0) {
    grillaLibros.classList.add("oculto");
    estadoVacio.classList.remove("oculto");
    contadorResultados.textContent = "Sin resultados";
    return;
  }

  estadoVacio.classList.add("oculto");
  grillaLibros.classList.remove("oculto");
  grillaLibros.innerHTML = visibles.map(plantillaTarjeta).join("");
  contadorResultados.textContent = `Mostrando ${visibles.length} de ${librosCatalogo.length} títulos`;
}

function pintarNovedades() {
  const destacados = librosCatalogo.filter((libro) => libro.destacado);
  estanteNovedades.innerHTML = destacados.map(plantillaNovedad).join("");
}

function pintarEscaparate() {
  const portadas = document.querySelectorAll(".portada-escaparate");

  librosCatalogo.slice(0, 3).forEach((libro, indice) => {
    const imagen = portadas[indice];
    imagen.src = libro.imagen;
    imagen.dataset.id = libro.id;
    imagen.alt = `Tapa de ${libro.titulo}`;
  });

  cifraTitulos.textContent = librosCatalogo.length;
  cifraGeneros.textContent = new Set(librosCatalogo.map((libro) => libro.genero)).size;
}

function alternarFavorito(id) {
  const libro = librosCatalogo.find((elemento) => elemento.id === id);
  const yaEstaba = listaFavoritos.includes(id);

  listaFavoritos = yaEstaba
    ? listaFavoritos.filter((favorito) => favorito !== id)
    : [...listaFavoritos, id];

  guardarEnAlmacenamiento(CLAVE_FAVORITOS, listaFavoritos);

  document
    .querySelectorAll(`.boton-favorito[data-id="${id}"]`)
    .forEach((boton) => {
      boton.classList.toggle("activo", !yaEstaba);
      boton.setAttribute("aria-pressed", String(!yaEstaba));
    });

  pintarContadorFavoritos();
  avisar(
    yaEstaba ? `«${libro.titulo}» salió de favoritos` : `«${libro.titulo}» guardado en favoritos`,
    yaEstaba ? "#4C555C" : "#8A3033"
  );
}

function pintarContadorFavoritos() {
  contadorFavoritos.textContent = listaFavoritos.length;
  contadorFavoritos.classList.toggle("oculto", listaFavoritos.length === 0);
}

async function mostrarFavoritos() {
  if (listaFavoritos.length === 0) {
    avisar("Todavía no guardaste favoritos. Tocá el corazón de cualquier libro.", "#8A3033");
    return;
  }

  const filas = listaFavoritos
    .map((id) => librosCatalogo.find((libro) => libro.id === id))
    .filter(Boolean)
    .map(({ titulo, autor }) => `<li><strong>${titulo}</strong> · ${autor}</li>`)
    .join("");

  const { isDenied } = await Swal.fire({
    title: "Tus favoritos",
    html: `<ul class="lista-favoritos">${filas}</ul>`,
    showDenyButton: true,
    confirmButtonText: "Cerrar",
    denyButtonText: "Vaciar favoritos",
    confirmButtonColor: "#17303A",
    denyButtonColor: "#D14E24",
    customClass: { popup: "alerta-lupa" },
  });

  if (isDenied) vaciarFavoritos();
}

function vaciarFavoritos() {
  listaFavoritos = [];
  borrarDeAlmacenamiento(CLAVE_FAVORITOS);

  document.querySelectorAll(".boton-favorito.activo").forEach((boton) => {
    boton.classList.remove("activo");
    boton.setAttribute("aria-pressed", "false");
  });

  pintarContadorFavoritos();
  avisar("Favoritos vaciados", "#4C555C");
}

async function reiniciarDatos() {
  const { isConfirmed } = await Swal.fire({
    title: "¿Reiniciar tus datos?",
    text: "Se borran tu carrito y tus favoritos de este navegador.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#D14E24",
    cancelButtonColor: "#17303A",
    customClass: { popup: "alerta-lupa" },
  });

  if (!isConfirmed) return;

  localStorage.clear();
  bolsaCarrito = [];
  listaFavoritos = [];
  pintarCarrito();
  pintarContadorFavoritos();

  if (librosCatalogo.length > 0) {
    pintarCatalogo();
    pintarNovedades();
  }

  avisar("Tus datos fueron reiniciados", "#4C555C");
}

function reiniciarChips() {
  chipsGenero.querySelectorAll(".chip").forEach((chip) => {
    const esTodos = chip.dataset.genero === "todos";
    chip.classList.toggle("activo", esTodos);
    chip.setAttribute("aria-pressed", String(esTodos));
  });
}

function registrarEventosCatalogo() {
  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === "agregar") {
      agregarAlCarrito(id);
    }
    if (boton.dataset.accion === "favorito") {
      alternarFavorito(id);
    }
  });

  campoBusqueda.addEventListener("input", () => {
    textoBusqueda = campoBusqueda.value.trim();
    pintarCatalogo();
  });

  chipsGenero.addEventListener("click", (evento) => {
    const chip = evento.target.closest(".chip");
    if (!chip) return;
    generoActivo = chip.dataset.genero;
    chipsGenero.querySelectorAll(".chip").forEach((elemento) => {
      const esElegido = elemento === chip;
      elemento.classList.toggle("activo", esElegido);
      elemento.setAttribute("aria-pressed", String(esElegido));
    });
    pintarCatalogo();
  });

  selectorOrden.addEventListener("change", () => {
    criterioOrden = selectorOrden.value;
    pintarCatalogo();
  });

  document.getElementById("boton-limpiar-busqueda").addEventListener("click", () => {
    campoBusqueda.value = "";
    textoBusqueda = "";
    generoActivo = "todos";
    reiniciarChips();
    pintarCatalogo();
  });

  document.getElementById("boton-reintentar").addEventListener("click", () => {
    estadoError.classList.add("oculto");
    cargarCatalogo();
  });
}

function registrarEventosNavegacion() {
  document.getElementById("flecha-izquierda").addEventListener("click", () => {
    estanteNovedades.scrollBy({ left: -340, behavior: "smooth" });
  });
  document.getElementById("flecha-derecha").addEventListener("click", () => {
    estanteNovedades.scrollBy({ left: 340, behavior: "smooth" });
  });

  const cabecera = document.querySelector(".cabecera");
  document.addEventListener("scroll", () => {
    cabecera.classList.toggle("con-sombra", document.documentElement.scrollTop > 20);
  });

  const botonMenu = document.getElementById("boton-menu-movil");
  const menu = document.getElementById("menu-principal");
  botonMenu.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", String(abierto));
  });
  menu.addEventListener("click", (evento) => {
    if (evento.target.tagName === "A") {
      menu.classList.remove("abierto");
      botonMenu.setAttribute("aria-expanded", "false");
    }
  });

  document.getElementById("formulario-boletin").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campo = document.getElementById("campo-boletin");
    avisar(`Listo. Te llegan las novedades a ${campo.value}`, "#2E5E4E");
    campo.value = "";
  });

  document.getElementById("boton-favoritos").addEventListener("click", mostrarFavoritos);
  document.getElementById("boton-reiniciar").addEventListener("click", reiniciarDatos);
}

registrarEventosCatalogo();
registrarEventosNavegacion();
pintarContadorFavoritos();
cargarCatalogo();