var map = L.map('mapid').setView([43.139, -2.20], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

var lugares = [
  { "nombre": "Donostia", "latitud": 43.3183, "longitud": -1.9812, "regions": 'basque_country', "zones": 'donostialdea', "locations": 'donostia' },
  { "nombre": "Bilbao", "latitud": 43.2630, "longitud": -2.9350, "regions": 'basque_country', "zones": 'great_bilbao', "locations": 'bilbao' },
  { "nombre": "Vitoria-Gasteiz", "latitud": 42.8599, "longitud": -2.6818, "regions": 'basque_country', "zones": 'vitoria_gasteiz', "locations": 'gasteiz' }
];

lugares.forEach(lugar => {
  var marker = L.marker([lugar.latitud, lugar.longitud]).addTo(map);
  marker.bindTooltip(lugar.nombre, {
    permanent: false,
    direction: 'top',
    offset: L.point(0, -20),
    className: 'tooltips'
  });

  marker.on('click', function () {
    marker
    cards = document.getElementsByClassName("carta");
    for (let card of cards) {
      if (lugar.nombre == card.className.split(" ")[1]) {
        console.log(lugar.nombre);
        if (card.style.display == "none") {
          card.classList.toggle('d-none');
        } else {
          card.classList.toggle('d-none');
        }
      }
    }
  });

  marker.on('mouseover', async function () {
    let regions = lugar.regions;
    let zones = lugar.zones;
    let locations = lugar.locations;

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE2Mzk3NDc5MDcsImVtYWlsIjoiaWtkZG1AcGxhaWF1bmRpLm5ldCJ9.TWKW-eX7m9_JzLBvSac45d7bBvnPXkDBsGAbeHpkQN1mug_EDAlV_eEoQ9k1WSa0PadHc8dAAhptsO-XtyNIXK4VE91ffFOWF7IA17DTr3eT2cIuB08vsKJ5dn10JK_kldR8bL3ZPioNAYux0GKvXlBWfIJ8_kHqE_Ji5j6NjxgqCN8cxNMx6QQplf7PhvLVTi6QsNUQGbZ-2T2UKZ3dln9Fcy1s4Kwp_Wb058V943zPJFr43SURDjZ9qpTQR7HVgDgDU2EiM6GU4HOgKBfAiU-zVgr7soVPTeo-6GJ6nbNxBPQ2NCDwNf5ZsqcAPpMbqAc5kQeoGQVfCHDOJZblqA'
      }
    };

   fetch(`https://api.euskadi.eus/euskalmet/weather/regions/${regions}/zones/${zones}/locations/${locations}/forecast/at/2024/01/22/for/20240123`, options)
    .then(response => response.json())
    .then(response => {
      let prediccion = response.forecastText.SPANISH;
      marker.setTooltipContent(prediccion);
    })
  });
});

function generarCards() {
  // Llamar al fetch una vez fuera del bucle para obtener los datos comunes
  fetch(`http://localhost:8082/api/obtenerZonas`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Iterar sobre cada lugar y verificar si la carta ya existe
      data.forEach(lugar => {
        let lugarNombre = lugar.nombre_ciudad.split("/");
        let cartaExistente = document.querySelector('.carta.' + lugarNombre[0]);

        if (cartaExistente) {
          // Si la carta ya existe, actualiza su contenido
          cartaExistente.querySelector('.temperatura').textContent = `Temperatura: ${lugar.temperatura_actual} °C`;
          cartaExistente.querySelector('.humedad').textContent = `Humedad: ${lugar.humedad} %`;
        } else {
          // Si la carta no existe, crea una nueva
          var nuevaCarta = document.createElement('div');
          nuevaCarta.classList.add('carta', lugarNombre[0], 'col-sm-12', 'col-md-4', 'rounded-5');
          nuevaCarta.classList.add('d-none');

          nuevaCarta.innerHTML = `
            <div class="card mb-4">
              <img src="images/gestion-del-tiempo-810x455.webp" class="card-img-top" alt="...">
              <div class="card-body">
                <h4 class="card-title text-center">${lugarNombre[0]}</h4>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item temperatura">Temperatura: ${lugar.temperatura_actual} °C</li>
                <li class="list-group-item humedad">Humedad: ${lugar.humedad} %</li>
              </ul>
              <div class="card-body text-xl-center bg-secondary text-white">
                <p>Añade tus items arrastrándolos a las cartas!</p>
              </div>
            </div>
          `;
          document.getElementById('contenedorDeCartas').appendChild(nuevaCarta);
        }
      });
    })
    .catch(error => {
      console.error('Error al obtener los datos comunes:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  // Llamando a la función generarCards después de que el DOM ha sido completamente cargado
  generarCards();
  setInterval(generarCards, 5000);
});

/* Esto es el gráfico en un futuro los datos tienen que ser consultas a la api */

const xValues = [100, 200, 300, 400, 500, 600, 700];

new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      data: [100, 465, 677, 200],
      borderColor: "red",
      fill: false
    }, {
      data: [100, 156, 677, 400],
      borderColor: "green",
      fill: false
    }, {
      data: [100, 200, 765, 895],
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: { display: false }
  }
});

/*
// que el fondo cambie solo 
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const images = [
    'url(images/wallpaper1.jpg)',
    'url(images/wallpaper2.jpg)',
    // Add more image paths as needed
  ];
  let currentImageIndex = 0;

  function changeBackground() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const imagePath = images[currentImageIndex];
    body.style.backgroundImage = imagePath;
  }

  // Set the initial background
  changeBackground();

  // Call the function every 5000 milliseconds (5 seconds) after the initial setting
  setInterval(changeBackground, 12000);
});
*/