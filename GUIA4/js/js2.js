    // Establecer un acumulador
    let total = 0

    // Recuperar los controles de la pagina (DOM)
    const boton = document.querySelector("#btn-anadir");
    const totalTexto = document.querySelector("#total");

    // Implementacion de la funcion
    function mostrarTotal(){
        totalTexto.textContent ='S/.' + total.toFixed(2);
    }

    // realizar el calculo de total a traves de una funcion
    boton.addEventListener("click", function(){
        total = total + 0.50;
        mostrarTotal();
    });

    // DOMContentLoaded : el HTML termina de ejecutar 
    document.addEventListener('DOMContentLoaded', mostrarTotal);

