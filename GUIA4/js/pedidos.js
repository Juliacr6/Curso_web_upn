// ===== 3. Estado del pedido y utilidades =====
const pedido = []; // cada ítem: { nombre, precio, cantidad }

const lista = document.getElementById('lista-pedido');
const totalTexto = document.getElementById('total');
const mensajeVacio = document.getElementById('pedido-vacio');
const aviso = document.getElementById('aviso');
const tituloPedido = document.getElementById('titulo-pedido');
const sugerenciaMantequilla = document.getElementById('sugerencia-mantequilla');
const btnMantequilla = document.getElementById('btn-mantequilla');
const btnVaciar = document.getElementById('btn-vaciar');

function soles(monto) {
  return 'S/ ' + monto.toFixed(2);
}

function calcularTotal() {
  return pedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

function anunciar(mensaje) {
  aviso.textContent = mensaje;
}

// ===== 4. Dibujar la lista con el DOM =====
function render() {
  lista.replaceChildren(); // borra los <li> anteriores

  for (const item of pedido) {
    const li = document.createElement('li');

    const texto = document.createElement('span');
    const subtotal = soles(item.precio * item.cantidad);
    texto.textContent = `${item.cantidad} × ${item.nombre} · ${subtotal}`;

    // Contenedor de botones (+, -, Quitar)
    const controles = document.createElement('div');
    controles.className = 'controles-item';

    // Botón Restar (-)
    const restarBtn = document.createElement('button');
    restarBtn.type = 'button';
    restarBtn.className = 'btn-restar';
    restarBtn.dataset.nombre = item.nombre;
    restarBtn.textContent = '−';
    restarBtn.setAttribute('aria-label', `Restar un ${item.nombre}`);

    // Botón Sumar (+)
    const sumarBtn = document.createElement('button');
    sumarBtn.type = 'button';
    sumarBtn.className = 'btn-sumar';
    sumarBtn.dataset.nombre = item.nombre;
    sumarBtn.textContent = '+';
    sumarBtn.setAttribute('aria-label', `Sumar un ${item.nombre}`);

    // Botón Quitar
    const quitarBtn = document.createElement('button');
    quitarBtn.type = 'button';
    quitarBtn.className = 'btn-quitar';
    quitarBtn.dataset.nombre = item.nombre;
    quitarBtn.textContent = 'Quitar';
    quitarBtn.setAttribute('aria-label', `Quitar ${item.nombre}`);

    controles.append(restarBtn, sumarBtn, quitarBtn);
    li.append(texto, controles);
    lista.append(li);
  }

  totalTexto.textContent = soles(calcularTotal());
  mensajeVacio.hidden = pedido.length > 0;
  if (btnVaciar) btnVaciar.hidden = pedido.length === 0;

  // Sugerencia honesta: mostrar si hay pan en la canasta
  if (sugerenciaMantequilla) {
    const tienePan = pedido.some((item) => item.nombre.toLowerCase().includes('pan'));
    sugerenciaMantequilla.hidden = !tienePan;
  }
}

// ===== 5. Añadir y quitar con lógica de negocio =====
function agregar(nombre, precio) {
  const existente = pedido.find((item) => item.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    pedido.push({ nombre, precio, cantidad: 1 });
  }
  render();
  anunciar(`Se añadió ${nombre}. Total: ${soles(calcularTotal())}.`);
}

function restarCantidad(nombre) {
  const item = pedido.find((i) => i.nombre === nombre);
  if (!item) return;

  item.cantidad--;
  if (item.cantidad <= 0) {
    quitar(nombre);
  } else {
    render();
    anunciar(`Se redujo la cantidad de ${nombre}. Total: ${soles(calcularTotal())}.`);
  }
}

function quitar(nombre) {
  const posicion = pedido.findIndex((item) => item.nombre === nombre);
  if (posicion === -1) return;
  pedido.splice(posicion, 1);
  render();
  anunciar(`Se quitó ${nombre}. Total: ${soles(calcularTotal())}.`);
  tituloPedido.focus(); // El foco no se pierde
}

function vaciarPedido() {
  if (pedido.length === 0) return;
  const seguro = confirm('¿Estás seguro de que deseas vaciar toda tu canasta?');
  if (seguro) {
    pedido.length = 0;
    render();
    anunciar('Se ha vaciado todo el pedido.');
    tituloPedido.focus();
  }
}

// ===== Delegación de Eventos =====

// Oyente para los botones "Añadir" del catálogo
const catalogo = document.querySelector('.catalogo');
if (catalogo) {
  catalogo.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-anadir');
    if (!boton) return;
    const producto = boton.closest('.producto');
    agregar(producto.dataset.nombre, Number(producto.dataset.precio));
  });
}

// Oyente para la lista del pedido (+, -, Quitar)
if (lista) {
  lista.addEventListener('click', (evento) => {
    const btnQuitar = evento.target.closest('.btn-quitar');
    const btnSumar = evento.target.closest('.btn-sumar');
    const btnRestar = evento.target.closest('.btn-restar');

    if (btnQuitar) quitar(btnQuitar.dataset.nombre);
    if (btnSumar) {
      const item = pedido.find((i) => i.nombre === btnSumar.dataset.nombre);
      if (item) agregar(item.nombre, item.precio);
    }
    if (btnRestar) restarCantidad(btnRestar.dataset.nombre);
  });
}

// Evento para Vaciar Pedido
if (btnVaciar) {
  btnVaciar.addEventListener('click', vaciarPedido);
}

// Evento para la Sugerencia Honesta (Mantequilla)
if (btnMantequilla) {
  btnMantequilla.addEventListener('click', () => {
    agregar('Mantequilla', 2.50);
  });
}

// Inicializar estado de la pantalla
render();