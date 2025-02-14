document.addEventListener('DOMContentLoaded', async function() {
    const themeSwitch = document.getElementById('theme-switch');
    const wordleContainer = document.getElementById('wordle-container');
    const refreshButton = document.querySelector('.refresh');
    let palabraSecreta = "";
    let intentos = 0;
    const maxIntentos = 5;
    let intentoActual = "";

    // Configuración del tema
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', function() {
        if (themeSwitch.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Cargar palabras desde JSON
    async function cargarPalabras() {
        try {
            const response = await fetch('palabra.json');
            const data = await response.json();
            palabraSecreta = data.palabras[Math.floor(Math.random() * data.palabras.length)];
            console.log("Palabra secreta:", palabraSecreta); // Para depuración
            generarCuadricula(palabraSecreta.length);
        } catch (error) {
            console.error("Error cargando palabras:", error);
        }
    }

    // Generar la cuadrícula
    function generarCuadricula(longitud) {
        wordleContainer.innerHTML = ""; 
        for (let i = 0; i < maxIntentos; i++) {
            for (let j = 0; j < longitud; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                cell.setAttribute('contenteditable', i === 0); // Solo la primera fila editable
                wordleContainer.appendChild(cell);
            }
        }
    }

    // Capturar input del usuario
    document.addEventListener('keydown', function(event) {
        let activeCells = document.querySelectorAll(`.cell[data-row="${intentos}"]`);
        let letrasValidas = /^[a-zA-Záéíóúñ]$/;

        if (event.key === "Enter" && intentoActual.length === palabraSecreta.length) {
            validarIntento();
        } else if (letrasValidas.test(event.key) && intentoActual.length < palabraSecreta.length) {
            activeCells[intentoActual.length].textContent = event.key.toLowerCase();
            intentoActual += event.key.toLowerCase();
        } else if (event.key === "Backspace" && intentoActual.length > 0) {
            intentoActual = intentoActual.slice(0, -1);
            activeCells[intentoActual.length].textContent = "";
        }
    });

    // Validar el intento
    function validarIntento() {
        let activeCells = document.querySelectorAll(`.cell[data-row="${intentos}"]`);
        let palabraArray = palabraSecreta.split("");

        for (let i = 0; i < palabraSecreta.length; i++) {
            let letra = intentoActual[i];
            if (letra === palabraSecreta[i]) {
                activeCells[i].classList.add('correct');
            } else if (palabraArray.includes(letra)) {
                activeCells[i].classList.add('present');
            } else {
                activeCells[i].classList.add('absent');
            }
        }

        // Revisar si ganó o perdió
        if (intentoActual === palabraSecreta) {
            setTimeout(() => alert("¡Felicidades! Adivinaste la palabra 🎉"), 100);
        } else {
            intentos++;
            intentoActual = "";
            if (intentos >= maxIntentos) {
                setTimeout(() => alert(`¡Perdiste! La palabra era "${palabraSecreta}"`), 100);
            } else {
                let nextRow = document.querySelectorAll(`.cell[data-row="${intentos}"]`);
                nextRow.forEach(cell => cell.setAttribute('contenteditable', 'true'));
            }
        }
    }

    // Reiniciar el juego
    refreshButton.addEventListener('click', () => location.reload());

    // Cargar palabras y preparar juego
    cargarPalabras();
});
