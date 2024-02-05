// Creación del mapa Leaflet
var map = L.map('mapid').setView([43.139, -2.20], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Array de lugares con información geográfica
var lugares = [
  { "nombre": "Donostia", "latitud": 43.3183, "longitud": -1.9812, "regions": 'basque_country', "zones": 'donostialdea', "locations": 'donostia' },
  { "nombre": "Bilbao", "latitud": 43.2630, "longitud": -2.9350, "regions": 'basque_country', "zones": 'great_bilbao', "locations": 'bilbao' },
  { "nombre": "Vitoria-Gasteiz", "latitud": 42.8599, "longitud": -2.6818, "regions": 'basque_country', "zones": 'vitoria_gasteiz', "locations": 'gasteiz' },
  { "nombre": "Bermeo", "latitud":43.420258, "longitud": -2.722540, "regions": 'basque_country', "zones": 'coast_zone', "locations": 'bermeo' },
  { "nombre": "Irun", "latitud": 43.34056, "longitud": -1.7816524, "regions": 'basque_country', "zones": 'coast_zone', "locations": 'irun' },
];

// Iteración sobre lugares para agregar marcadores al mapa
lugares.forEach(lugar => {
  var marker = L.marker([lugar.latitud, lugar.longitud]).addTo(map);
  marker._icon.classList.add("tooltips");

  // Eventos para mostrar y ocultar información al hacer clic y pasar el ratón sobre un marcador
  marker.on('click', function () {
    marker._icon.classList.toggle("huechange");
    cards = document.getElementsByClassName("carta");
    for (let card of cards) {
      if (lugar.nombre == card.className.split(" ")[1]) {
        card.classList.toggle('d-none');
      }
    }
  });

  marker.on('mouseover', async function (event) {
    let regions = lugar.regions;
    let zones = lugar.zones;
    let locations = lugar.locations;
    let fechaHoy= conseguirFechaFormateada();
    let fechaManana = obtenerFechaDiaSiguiente();

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE2Mzk3NDc5MDcsImVtYWlsIjoiaWtkZG1AcGxhaWF1bmRpLm5ldCJ9.TWKW-eX7m9_JzLBvSac45d7bBvnPXkDBsGAbeHpkQN1mug_EDAlV_eEoQ9k1WSa0PadHc8dAAhptsO-XtyNIXK4VE91ffFOWF7IA17DTr3eT2cIuB08vsKJ5dn10JK_kldR8bL3ZPioNAYux0GKvXlBWfIJ8_kHqE_Ji5j6NjxgqCN8cxNMx6QQplf7PhvLVTi6QsNUQGbZ-2T2UKZ3dln9Fcy1s4Kwp_Wb058V943zPJFr43SURDjZ9qpTQR7HVgDgDU2EiM6GU4HOgKBfAiU-zVgr7soVPTeo-6GJ6nbNxBPQ2NCDwNf5ZsqcAPpMbqAc5kQeoGQVfCHDOJZblqA'
      }
    };

    fetch(`https://api.euskadi.eus/euskalmet/weather/regions/${regions}/zones/${zones}/locations/${locations}/forecast/at/${fechaHoy}/for/${fechaManana}`, options)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(buffer);
        const data = JSON.parse(text);
        const prediccion = data.forecastText.SPANISH;
        console.log(data);

        marker.bindTooltip(prediccion,{ className: 'custom-tooltip' }).openTooltip();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });

  // Close the tooltip when the mouse leaves the marker
  marker.on('mouseout', function () {
    marker.closeTooltip();
  });
});

// Función para generar dinámicamente las cartas con información meteorológica
function generarCards() {
  fetch(`http://localhost:8082/api/obtenerZonas`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(lugar => {
        let lugarNombre = lugar.nombre_ciudad.split("/");
        let cartaExistente = document.querySelector('.carta.' + lugarNombre[0]);

        if (cartaExistente) {
          cartaExistente.querySelector('.temperatura').textContent = `Temperatura: ${lugar.temperatura_actual} °C`;
          cartaExistente.querySelector('.humedad').textContent = `Humedad: ${lugar.humedad} %`;
          cartaExistente.querySelector('.viento').textContent = `Viento: ${lugar.viento} m/s`;
          cartaExistente.querySelector('.nublado').textContent = `Estado del cielo: ${lugar.estado_cielo}`;
          cartaExistente.querySelector('.lluvia').textContent = `Precipitación: ${lugar.precipitacion} mm`;
        } else {
          var nuevaCarta = document.createElement('div');
          nuevaCarta.classList.add('carta', lugarNombre[0], 'col-sm-12', 'col-md-4', 'rounded-5');
          nuevaCarta.classList.add('d-none');

          nuevaCarta.innerHTML = `
            <div class="card mb-4" ondragover="allowDrop(event)" ondrop="dropItem(event)">
              <img src="images/gestion-del-tiempo-810x455.webp" class="card-img-top" alt="...">
              <div class="card-body">
                <h4 class="card-title text-center">${lugarNombre[0]}</h4>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item temperatura">Temperatura: ${lugar.temperatura_actual} °C</li>
                <li class="list-group-item humedad">Humedad: ${lugar.humedad} %</li>
                <li class="list-group-item viento d-none">Viento: ${lugar.viento} m/s</li>
                <li class="list-group-item nublado d-none ">Estado del cielo: ${lugar.estado_cielo}</li>
                <li class="list-group-item lluvia d-none ">Precipitación: ${lugar.precipitacion} mm</li>
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

// Función para permitir el arrastre sobre la carta
function allowDrop(event) {
  event.preventDefault();
}

// Función para manejar el evento de soltar el ítem en la carta
function dropItem(event) {
  event.preventDefault();

  // Obtén el tipo de ícono soltado a partir del atributo "data-tipo"
  const tipoIcono = event.dataTransfer.getData('text/plain').replace(/^.*[\\/]/, '').replace(/\..+$/, '');

  // Obtén el elemento correspondiente dentro de la carta actual
  const carta = event.currentTarget;

  // Encuentra el elemento con la clase igual al tipo de ícono
  const elementoMostrar = carta.querySelector(`.${tipoIcono}`);

  // Verifica que el elemento exista antes de intentar acceder a su classList
  if (elementoMostrar) {
    // Cambia la clase para mostrar el elemento
    elementoMostrar.classList.remove('d-none');
  }
}
// Evento que se dispara al cargar la página para generar las cartas inicialmente y actualizarlas periódicamente
document.addEventListener('DOMContentLoaded', function () {
  generarCards();
  setInterval(generarCards, 5000);
});

/*
Código para crear un gráfico con ChartJS
*/

const xValues = [100, 200, 300, 400, 500, 600, 700];

new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [
      { data: [100, 465, 677, 200], borderColor: "red", fill: false },
      { data: [100, 156, 677, 400], borderColor: "green", fill: false },
      { data: [100, 200, 765, 895], borderColor: "blue", fill: false }
    ]
  },
  options: {
    legend: { display: false }
  }
});



function conseguirFechaFormateada() {
  var fechaHoy = new Date();
  var year = fechaHoy.getFullYear();
  var month = String(fechaHoy.getMonth() + 1).padStart(2, '0');
  var day = String(fechaHoy.getDate()).padStart(2, '0');

  var fechaFormateada = year + '/' + month + '/' + day;

  return fechaFormateada;
}

function obtenerFechaDiaSiguiente() {
  var fechaHoy = new Date();
  fechaHoy.setDate(fechaHoy.getDate() + 1); 
  var year = fechaHoy.getFullYear();
  var month = String(fechaHoy.getMonth() + 1).padStart(2, '0');
  var day = String(fechaHoy.getDate()).padStart(2, '0');

  var fechaFormateada = year + month + day;

  return fechaFormateada;
}

