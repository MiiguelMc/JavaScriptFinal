document.addEventListener('DOMContentLoaded', function() {
  const themeSwitch = document.getElementById('theme-switch');
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

  // // Cargar palabras y seleccionar una aleatoria
  // fetch('palabra.json')
  //   .then(response => response.json())
  //   .then(data => {
  //     const palabras = data.palabras;
  //     iniciarJuego(palabras);
  //   });

  // function iniciarJuego(palabras) {
  //   const palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
  //   let intentos = 0;
  //   const maxIntentos = 5;
  //   const wordleContainer = document.getElementById('wordle-container');
  //   wordleContainer.innerHTML = '';

  //   for (let i = 0; i < maxIntentos; i++) {
  //     for (let j = 0; j < palabraSecreta.length; j++) {
  //       const cell = document.createElement('div');
  //       cell.classList.add('cell');
  //       cell.setAttribute('contenteditable', 'true');
  //       cell.setAttribute('data-row', i);
  //       cell.setAttribute('data-col', j);
  //       wordleContainer.appendChild(cell);
  //     }
  //   }

  //   document.addEventListener('keydown', function(event) {
  //     if (event.key === 'Enter') {
  //       validarIntento(palabraSecreta, intentos);
  //       intentos++;
  //       if (intentos >= maxIntentos) {
  //         alert('Has agotado tus intentos. La palabra era: ' + palabraSecreta);
  //         reiniciarJuego();
  //       }
  //     }
  //   });
  // }

  // function validarIntento(palabraSecreta, intento) {
  //   const wordleContainer = document.getElementById('wordle-container');
  //   const cells = wordleContainer.querySelectorAll(`[data-row="${intento}"]`);
  //   let intentoPalabra = '';

  //   cells.forEach(cell => {
  //     intentoPalabra += cell.textContent.toLowerCase();
  //   });

  //   if (intentoPalabra.length !== palabraSecreta.length) {
  //     alert('Completa todas las letras antes de validar.');
  //     return;
  //   }

  //   cells.forEach((cell, index) => {
  //     const letra = cell.textContent.toLowerCase();
  //     if (letra === palabraSecreta[index]) {
  //       cell.classList.add('correct');
  //     } else if (palabraSecreta.includes(letra)) {
  //       cell.classList.add('present');
  //     } else {
  //       cell.classList.add('absent');
  //     }
  //   });

  //   if (intentoPalabra === palabraSecreta) {
  //     alert('¡Felicidades! Has adivinado la palabra.');
  //     reiniciarJuego();
  //   }
  // }

   window.reiniciarJuego = function() {
    location.reload();
}});
let refresh = document.getElementsByClassName('refresh');
refresh.addEventListener('click', _ => {
            location.reload();
});