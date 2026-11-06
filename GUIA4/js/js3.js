// Recuperar los controles del HTML
const notas = document.querySelector('#notas');
const contador = document.querySelector('#contador');

// Implementar el evento para el textarea
notas.addEventListener('input', (evento) => {
    const largo = evento.target.value.length;
    contador.textContent = `${largo} / 200`;

    // Abrir la consola (F12) para ver los datos del evento
    console.log(evento.type, evento.target.id, largo);
})