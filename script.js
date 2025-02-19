/* Iniciamos Variables basicamente con esto podemos cambiar opciones facilmente como el maximo intento etc  */
let palabraSecreta = "";
let intentos = 0;
const maxIntentos = 5;
let intentoActual = "";

/* Aqui tenemos basicamente crear contantes para el cambio de tema  */
document.addEventListener('DOMContentLoaded', async function () {
    const interruptorTema = document.getElementById('interruptor-tema');
    const contenedorWordle = document.getElementById('contenedor-wordle');
    const botonReiniciar = document.querySelector('.reiniciar');

    /* Aqui cambiamos el tema  */
    const temaActual = localStorage.getItem('tema') || 'light';
    document.documentElement.setAttribute('data-theme', temaActual);
    interruptorTema.checked = temaActual === 'dark';
/* Aqui cambia dando al boton */
    interruptorTema.addEventListener('change', function () {
        document.documentElement.setAttribute('data-theme', interruptorTema.checked ? 'dark' : 'light');
        localStorage.setItem('tema', interruptorTema.checked ? 'dark' : 'light');
    });


    

    async function cargarPalabras() {
        try {
            /* Aqui elegimos la palabra random   */
            const response = await fetch('palabra.json');
            const data = await response.json();
            /* Aqui hace lo de aleatorio */
            palabraSecreta = data.palabras[Math.floor(Math.random() * data.palabras.length)];
            /* Aqui lo ponemos la chuleta */
            console.log("Palabra secreta:", palabraSecreta);
            /*Con este podriamos poner palabras mas largas */
            generarCuadricula(palabraSecreta.length);
        } catch (error) {
            /* Aqui como en programacion la asignatura  para ver los errores  */
            console.error("Error cargando palabras:", error);
        }
    }

    /* Aqui creamos la cuadricula */
    function generarCuadricula(longitud) {
        contenedorWordle.innerHTML = "";
        for (let i = 0; i < maxIntentos; i++) {
            let fila = document.createElement('div');
            fila.classList.add('fila-wordle'); /* Aqui creamos la clase de la fila  y cojemos las cosas de css */
            fila.setAttribute('data-fila', i);
            for (let j = 0; j < longitud; j++) {
                let celda = document.createElement('input');
                celda.classList.add('celda');
                celda.setAttribute('maxlength', '1'); /* Aqui ponemos el maximo de letras que se pueden poner */
                celda.setAttribute('data-fila', i);/* Aqui ponemos la fila */
                celda.setAttribute('data-col', j);/* Aqui ponemos la columna */
                celda.readOnly = i !== 0; /* Aqui si es diferente de la fila no se puede escribir basicamente pa que no rompan nada  */
                fila.appendChild(celda);
            }
            contenedorWordle.appendChild(fila);
        }
        document.querySelector(`.celda[data-fila="0"][data-col="0"]`).focus();
    }

    /* Aqui es para que el usuario pueda escribir en la fila y las cosas basicamente para de letras validas que no pongan numero  */
    document.addEventListener('input', function (event) {
        let celdasActivas = document.querySelectorAll(`.celda[data-fila="${intentos}"]`); /* Aqui cojemos las celdas activas basicamente segun los intentos */
        let letrasValidas = /^[a-zA-ZáéíóúñÑ]$/;

        /* Aqui si el evento es igual a celda */
        if (event.target.classList.contains('celda')) {
            let valor = event.target.value.toLowerCase();
            let indiceColumna = parseInt(event.target.getAttribute('data-col'));

            if (!letrasValidas.test(valor)) { /* Aqui si no es una letra valida */
                event.target.value = "";
                return;
            }

            event.target.value = valor;

            /* Aqui si el indice de la columna es menor que la palabra secreta */
            if (indiceColumna < palabraSecreta.length - 1) {
                celdasActivas[indiceColumna + 1].focus();
            }
            actualizarIntento();
        }
    });

    /* Aqui es para borrar la ultima letra */ 
    document.addEventListener('keydown', function (event) {
        if (event.key === "Backspace") {
            let celdasActivas = document.querySelectorAll(`.celda[data-fila="${intentos}"]`);
            let celdasLlenas = Array.from(celdasActivas).filter(celda => celda.value !== "");
            let ultimoIndiceLleno = celdasLlenas.length - 1;
            /* Aqui si el ultimo indice lleno es mayor o igual a 0 pa que no borre mas */
            if (ultimoIndiceLleno >= 0) {
                celdasLlenas[ultimoIndiceLleno].value = "";
                celdasLlenas[ultimoIndiceLleno].focus();
                actualizarIntento();
            }
        }
    });

    /* Basicamente hace lo que dice actualizar el intento  */
    function actualizarIntento() {
        let celdasActivas = document.querySelectorAll(`.celda[data-fila="${intentos}"]`);
        intentoActual = Array.from(celdasActivas).map(celda => celda.value).join("");
    }

    /* Aqui es para validar el intento y poner el color segun el css*/
    function validarIntento() {
        let celdasActivas = document.querySelectorAll(`.celda[data-fila="${intentos}"]`);
        let palabraArray = palabraSecreta.split("");
/* Aqui si el intento actual es diferente a la palabra secreta */
        if (intentoActual.length !== palabraSecreta.length) {
            alert("La palabra debe tener " + palabraSecreta.length + " letras."); /* Aqui si la palabra no tiene la longitud correcta Por si acaso me lo intenta bugear */
            return;
        }
        /* Aqui es para poner los colores segun el css */
        for (let i = 0; i < palabraSecreta.length; i++) {
            let letra = intentoActual[i];
            if (letra === palabraSecreta[i]) {
                celdasActivas[i].classList.add('correcto');
            } else if (palabraArray.includes(letra)) {
                celdasActivas[i].classList.add('presente');
            } else {
                celdasActivas[i].classList.add('ausente');
            }
        }
        /* Aqui es para que si adivina la palabra salga un cartelito de los del los primeros dias  */
        if (intentoActual === palabraSecreta) {
            setTimeout(() => alert("Felicidades Adivinaste la palabra "), 100); /* Aqui si adivina la palabra y el numero el tiempo en que tarda en salir */
        } else {
            intentos++;
            intentoActual = "";
            if (intentos >= maxIntentos) {
                setTimeout(() => alert(`Perdiste La palabra era "${palabraSecreta}"`), 100);
            } else {
                /* Aqui es para que si no adivina la palabra se ponga la siguiente fila */
                let siguienteFila = document.querySelectorAll(`.celda[data-fila="${intentos}"]`);
                siguienteFila.forEach(celda => celda.readOnly = false);
                siguienteFila[0].focus();
            }
        }
    }

    /* Aqui es para que si le dan al enter validen el intento */
    document.addEventListener('keydown', function (event) {
        if (event.key === "Enter" && intentoActual.length === palabraSecreta.length) {
            validarIntento();
        }
    });

    /* Aqui es para que si le dan al boton de reiniciar se recargue la pagina */
    botonReiniciar.addEventListener('click', () => location.reload());

    /* Aqui es para que se carguen las palabras de nuevo */
    cargarPalabras();
});
