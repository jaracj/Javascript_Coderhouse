let bolsaCarrito = obtenerDeAlmacenamiento(CLAVE_CARRITO) || [];

const panelCarrito = document.getElementById("panel-carrito");
const velo = document.getElementById("velo");
const panelCuerpo = document.getElementById("panel-cuerpo");
const contadorCarrito = document.getElementById("contador-carrito");
const tituloCantidad = document.getElementById("titulo-cantidad");
const botonAbrirCarrito = document.getElementById("boton-carrito");
const botonCerrarCarrito = document.getElementById("boton-cerrar-carrito");
const botonConfirmar = document.getElementById("boton-confirmar");
const botonVaciar = document.getElementById("boton-vaciar");
const barraEnvio = document.getElementById("barra-envio");
const textoEnvio = document.getElementById("texto-envio");
const progresoEnvio = document.getElementById("progreso-envio");
const resumenSubtotal = document.getElementById("resumen-subtotal");
const resumenEnvio = document.getElementById("resumen-envio");
const resumenTotal = document.getElementById("resumen-total");

function sincronizarCarritoConCatalogo() {
  bolsaCarrito = bolsaCarrito.filter(({ id }) =>
    librosCatalogo.some((libro) => libro.id === id)
  );
  guardarEnAlmacenamiento(CLAVE_CARRITO, bolsaCarrito);
  pintarCarrito();
}

function abrirCarrito() {
  panelCarrito.classList.add("abierto");
  panelCarrito.setAttribute("aria-hidden", "false");
  velo.classList.remove("oculto");
  document.body.classList.add("sin-desplazamiento");
  botonCerrarCarrito.focus();
}

function cerrarCarrito(devolverFoco = true) {
  panelCarrito.classList.remove("abierto");
  panelCarrito.setAttribute("aria-hidden", "true");
  velo.classList.add("oculto");
  document.body.classList.remove("sin-desplazamiento");

  if (devolverFoco) {
    botonAbrirCarrito.focus();
  }
}

function agregarAlCarrito(id) {
  const libro = librosCatalogo.find((elemento) => elemento.id === id);
  if (!libro || libro.stock === 0) return;

  const articulo = bolsaCarrito.find((elemento) => elemento.id === id);

  if (articulo) {
    if (articulo.cantidad >= libro.stock) {
      avisar(`Solo tenemos ${libro.stock} ejemplares de «${libro.titulo}»`, "#8A3033");
      return;
    }
    articulo.cantidad += 1;
  } else {
    bolsaCarrito.push({ id, cantidad: 1 });
  }

  guardarEnAlmacenamiento(CLAVE_CARRITO, bolsaCarrito);
  pintarCarrito();
  avisar(`«${libro.titulo}» sumado a tu carrito`, "#2E5E4E");
}

function modificarCantidad(id, cambio) {
  const articulo = bolsaCarrito.find((elemento) => elemento.id === id);
  const libro = librosCatalogo.find((elemento) => elemento.id === id);
  if (!articulo || !libro) return;

  const nuevaCantidad = articulo.cantidad + cambio;

  if (nuevaCantidad <= 0) {
    quitarArticulo(id);
    return;
  }
  if (nuevaCantidad > libro.stock) {
    avisar(`Solo quedan ${libro.stock} ejemplares`, "#8A3033");
    return;
  }

  articulo.cantidad = nuevaCantidad;
  guardarEnAlmacenamiento(CLAVE_CARRITO, bolsaCarrito);
  pintarCarrito();
}

function quitarArticulo(id) {
  const libro = librosCatalogo.find((elemento) => elemento.id === id);

  Swal.fire({
    title: "¿Sacarlo del carrito?",
    text: libro ? `«${libro.titulo}» dejará tu pedido.` : "",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, sacarlo",
    cancelButtonText: "Conservar",
    confirmButtonColor: "#D14E24",
    cancelButtonColor: "#17303A",
    customClass: { popup: "alerta-lupa" },
  }).then(({ isConfirmed }) => {
    if (!isConfirmed) return;
    bolsaCarrito = bolsaCarrito.filter((articulo) => articulo.id !== id);
    guardarEnAlmacenamiento(CLAVE_CARRITO, bolsaCarrito);
    pintarCarrito();
    avisar("Artículo fuera del carrito");
  });
}

function vaciarCarrito() {
  if (bolsaCarrito.length === 0) return;

  Swal.fire({
    title: "¿Vaciar el carrito?",
    text: "Se quitan todos los artículos del pedido.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar todo",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#D14E24",
    cancelButtonColor: "#17303A",
    customClass: { popup: "alerta-lupa" },
  }).then(({ isConfirmed }) => {
    if (!isConfirmed) return;
    bolsaCarrito = [];
    borrarDeAlmacenamiento(CLAVE_CARRITO);
    pintarCarrito();
    avisar("Carrito vaciado por completo");
  });
}

const calcularSubtotal = () =>
  bolsaCarrito.reduce((total, { id, cantidad }) => {
    const libro = librosCatalogo.find((elemento) => elemento.id === id);
    return libro ? total + libro.precio * cantidad : total;
  }, 0);

const costoEnvio = (subtotal) =>
  subtotal === 0 || subtotal >= UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;

function pintarArticuloBolsa({ id, cantidad }) {
  const libro = librosCatalogo.find((elemento) => elemento.id === id);
  if (!libro) return "";

  return `
  <article class="articulo-carrito" data-id="${id}">
    <img class="articulo-portada" src="${libro.imagen}" data-id="${id}" alt="Tapa de ${libro.titulo}">
    <div class="articulo-detalle">
      <h4>${libro.titulo}</h4>
      <p class="articulo-autor">${libro.autor}</p>
      <p class="articulo-precio-unitario">${formatearPrecio(libro.precio)} c/u</p>
      <div class="control-cantidad">
        <button data-accion="restar" aria-label="Quitar una unidad">
          <span class="material-symbols-outlined" style="font-size: 20px;">remove</span>
        </button>
        <span>${cantidad}</span>
        <button data-accion="sumar" aria-label="Sumar una unidad">
          <span class="material-symbols-outlined" style="font-size: 20px;">add</span>
        </button>
      </div>
    </div>
    <div class="articulo-columna">
      <button class="boton-quitar" data-accion="quitar" aria-label="Quitar ${libro.titulo} de la bolsa">
        <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
      </button>
      <p class="articulo-subtotal">${formatearPrecio(libro.precio * cantidad)}</p>
    </div>
  </article>`;
}

function pintarCarrito() {
  const cantidadArticulos = bolsaCarrito.reduce((suma, { cantidad }) => suma + cantidad, 0);

  contadorCarrito.textContent = cantidadArticulos;
  contadorCarrito.classList.toggle("oculto", cantidadArticulos === 0);

  tituloCantidad.textContent = cantidadArticulos > 0 ? `(${cantidadArticulos})` : "";

  if (bolsaCarrito.length === 0) {
    panelCuerpo.innerHTML = `
      <div class="bolsa-vacia">
        <span class="material-symbols-outlined bolsa-vacia-icono">shopping_bag</span>
        <h3>Tu carrito está vacío</h3>
        <p>Todavía no elegiste ningún libro. El catálogo te espera.</p>
        <button class="boton boton-contorno" data-accion="explorar">Ir al catálogo</button>
      </div>`;
    barraEnvio.classList.add("oculto");
    botonVaciar.disabled = true;
    botonConfirmar.disabled = true;
  } else {
    panelCuerpo.innerHTML = bolsaCarrito.map(pintarArticuloBolsa).join("");
    barraEnvio.classList.remove("oculto");
    botonVaciar.disabled = false;
    botonConfirmar.disabled = false;
  }

  const subtotal = calcularSubtotal();
  const envio = costoEnvio(subtotal);
  const total = subtotal + envio;
  const porcentaje = Math.min((subtotal / UMBRAL_ENVIO_GRATIS) * 100, 100);

  resumenSubtotal.textContent = formatearPrecio(subtotal);
  resumenEnvio.textContent =
    subtotal === 0 ? "—" : envio === 0 ? "Gratis" : formatearPrecio(envio);
  resumenTotal.textContent = formatearPrecio(total);
  progresoEnvio.style.width = `${porcentaje}%`;

  textoEnvio.textContent =
    envio === 0 && subtotal > 0
      ? "Conseguiste envío gratis"
      : `Te faltan ${formatearPrecio(UMBRAL_ENVIO_GRATIS - subtotal)} para el envío gratis`;
}

function generarResumenPedido() {
  const filas = bolsaCarrito
    .map(({ id, cantidad }) => {
      const libro = librosCatalogo.find((elemento) => elemento.id === id);
      if (!libro) return "";
      return `<li><span>${cantidad}x ${libro.titulo}</span><strong>${formatearPrecio(libro.precio * cantidad)}</strong></li>`;
    })
    .join("");

  const subtotal = calcularSubtotal();
  const envio = costoEnvio(subtotal);

  return `
    <ul class="resumen-pedido">${filas}</ul>
    <div class="resumen-lineas">
      <p><span>Subtotal</span><span>${formatearPrecio(subtotal)}</span></p>
      <p><span>Envío</span><span>${envio === 0 ? "Gratis" : formatearPrecio(envio)}</span></p>
      <p class="resumen-total"><span>Total</span><span>${formatearPrecio(subtotal + envio)}</span></p>
    </div>`;
}

async function confirmarCompra() {
  if (bolsaCarrito.length === 0) {
    avisar("Tu carrito está vacío: sumá algún libro primero", "#8A3033");
    return;
  }

  const subtotal = calcularSubtotal();
  const envio = costoEnvio(subtotal);
  const total = subtotal + envio;

  const { isConfirmed } = await Swal.fire({
    title: "Confirmar pedido",
    html: generarResumenPedido(),
    showCancelButton: true,
    confirmButtonText: "Confirmar compra",
    cancelButtonText: "Seguir mirando",
    confirmButtonColor: "#C88A0A",
    cancelButtonColor: "#17303A",
    customClass: { popup: "alerta-lupa", htmlContainer: "resumen-compra" },
  });

  if (!isConfirmed) return;

  Swal.fire({
    title: "Preparando tu pedido…",
    text: "Estamos envolviendo los libros con papel madera.",
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: { popup: "alerta-lupa" },
    didOpen: () => Swal.showLoading(),
  });

  await new Promise((resolver) => setTimeout(resolver, 1600));

  const numeroPedido = `LUPA-${Date.now().toString(36).toUpperCase()}`;

  await Swal.fire({
    icon: "success",
    title: "Pedido confirmado",
    html: `
      <p class="pedido-numero">Nº de pedido: <strong>${numeroPedido}</strong></p>
      <p>Total abonado: <strong>${formatearPrecio(total)}</strong></p>
      <p class="pedido-envio">${
        envio === 0 ? "Envío gratis: llega en 48 h" : "Llega en 2 a 4 días hábiles"
      }</p>`,
    confirmButtonText: "Gracias",
    confirmButtonColor: "#17303A",
    returnFocus: false,
    customClass: { popup: "alerta-lupa" },
  });

  bolsaCarrito = [];
  borrarDeAlmacenamiento(CLAVE_CARRITO);
  pintarCarrito();
  cerrarCarrito(false);
}

function registrarEventosCarrito() {
  botonAbrirCarrito.addEventListener("click", abrirCarrito);
  botonCerrarCarrito.addEventListener("click", cerrarCarrito);
  velo.addEventListener("click", cerrarCarrito);
  botonConfirmar.addEventListener("click", confirmarCompra);
  botonVaciar.addEventListener("click", vaciarCarrito);

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && panelCarrito.classList.contains("abierto")) {
      cerrarCarrito();
    }
  });

  panelCuerpo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;

    const accion = boton.dataset.accion;

    if (accion === "explorar") {
      cerrarCarrito();
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
      return;
    }

    const id = Number(boton.closest(".articulo-carrito").dataset.id);

    if (accion === "sumar") modificarCantidad(id, 1);
    if (accion === "restar") modificarCantidad(id, -1);
    if (accion === "quitar") quitarArticulo(id);
  });
}

registrarEventosCarrito();
pintarCarrito();