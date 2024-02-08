const  urlActual = (new URL(window.location.origin)).hostname;
const laravelApi = "http://" + urlActual + "";


document.addEventListener('DOMContentLoaded', async function () {
  mostrarAnimacionCarga(); // Mostrar la animación de carga antes de iniciar la creación del mapa
  await generarCards();
  inicializarMapa();
  cargarBalizasGuardadas();

  setInterval(generarCards, 5000);
});

async function generarCards() {
  try {
    const response = await fetch(`${laravelApi}:8082/api/obtenerZonas`);
    if (!response.ok) {
      throw new Error('Error en la solicitud de datos');
    }
    const data = await response.json();

    data.forEach(lugar => {
      let lugarNombre = lugar.nombre_ciudad.split("/");
      let cartaExistente = document.querySelector('.carta.' + lugarNombre[0]);

      if (cartaExistente) {
        actualizarInformacionCarta(cartaExistente, lugar);
      } else {
        crearNuevaCarta(lugar, lugarNombre[0]);
      }
    });

    // Ocultar la animación de carga después de cargar los datos
    ocultarAnimacionCarga();
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    // Ocultar la animación de carga en caso de error
    ocultarAnimacionCarga();
  }
}

function actualizarInformacionCarta(carta, lugar) {
  carta.querySelector('.temperatura').textContent = `Temperatura: ${lugar.temperatura_actual} °C`;
  carta.querySelector('.humedad').textContent = `Humedad: ${lugar.humedad} %`;
  carta.querySelector('.viento').textContent = `Viento: ${lugar.viento} m/s`;
  carta.querySelector('.nublado').textContent = `Estado del cielo: ${lugar.estado_cielo}`;
  carta.querySelector('.lluvia').textContent = `Precipitación: ${lugar.precipitacion} mm`;
}

function crearNuevaCarta(lugar, lugarNombre) {
  var nuevaCarta = document.createElement('div');
  nuevaCarta.classList.add('carta', lugarNombre, 'col-sm-12', 'col-md-4', 'rounded-5');
  nuevaCarta.classList.add('d-none');

  nuevaCarta.innerHTML = `
    <div class="card mb-4" ondragover="allowDrop(event)" ondrop="dropItem(event)">
        <img src="images/gestion-del-tiempo-810x455.webp" class="card-img-top" alt="...">
        <div class="card-body">
            <h4 class="card-title text-center">${lugarNombre}</h4>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item temperatura">Temperatura: ${lugar.temperatura_actual} °C</li>
            <li class="list-group-item humedad">Humedad: ${lugar.humedad} %</li>
            <li class="list-group-item viento border-1 border-dark border-dashed bg-dark-subtle d-none ">Viento: ${lugar.viento} m/s</li>
            <li class="list-group-item nublado border-1 border-dark border-dashed bg-dark-subtle d-none ">Estado del cielo: ${lugar.estado_cielo}</li>
            <li class="list-group-item lluvia border-1 border-dark border-dashed bg-dark-subtle d-none "> Precipitación: ${lugar.precipitacion} mm</li>
        </ul>
        <div class="card-body text-xl-center descripcionesCard" style="background-color: #FC6736 !important;">
            <p>Añade tus items arrastrándolos a las cartas! y pulsa para borrarlos! </p>
        </div>
    </div>
  `;
  document.getElementById('contenedorDeCartas').appendChild(nuevaCarta);
}

function inicializarMapa() {
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
    { "nombre": "Bermeo", "latitud": 43.420258, "longitud": -2.722540, "regions": 'basque_country', "zones": 'coast_zone', "locations": 'bermeo' },
    { "nombre": "Irun", "latitud": 43.34056, "longitud": -1.7816524, "regions": 'basque_country', "zones": 'coast_zone', "locations": 'irun' },
  ];

  // Iteración sobre lugares para agregar marcadores al mapa
  lugares.forEach(lugar => {
    // Crear un marcador con un atributo title
    var marker = L.marker([lugar.latitud, lugar.longitud], { title: lugar.nombre }).addTo(map);
    marker._icon.classList.add("tooltips");

    // Eventos para mostrar y ocultar información al hacer clic y pasar el ratón sobre un marcador
    marker.on('click', function () {
      toggleInformacionCarta(lugar.nombre);
      toggleClaseHuechange(marker, lugar.nombre);
    });

    marker.on('mouseover', async function () {
      mostrarPrediccionTiempo(marker, lugar);
    });

    // Cerrar el tooltip cuando el mouse sale del marcador
    marker.on('mouseout', function () {
      marker.closeTooltip();
    });
  });


}

function toggleInformacionCarta(nombreLugar) {
  let carta = document.querySelector(`.carta.${nombreLugar}`);
  if (carta) {
    carta.classList.toggle('d-none');
  }
}

function toggleClaseHuechange(marker, nombreLugar) {
  marker._icon.classList.toggle("huechange");
  if (marker._icon.classList.contains("huechange")) {
    guardarEliminarBaliza(nombreLugar, 'guardar');
  } else {
    guardarEliminarBaliza(nombreLugar, 'eliminar');
  }
}

function mostrarPrediccionTiempo(marker, lugar) {
  let regions = lugar.regions;
  let zones = lugar.zones;
  let locations = lugar.locations;
  let fechaHoy = conseguirFechaFormateada();
  let fechaManana = obtenerFechaDiaSiguiente();

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE2Mzk3NDc5MDcsImVtYWlsIjoiaWtkZG1AcGxhaWF1bmRpLm5ldCJ9.TWKW-eX7m9_JzLBvSac45d7bBvnPXkDBsGAbeHpkQN1mug_EDAlV_eEoQ9k1WSa0PadHc8dAAhptsO-XtyNIXK4VE91ffFOWF7IA17DTr3eT2cIuB08vsKJ5dn10JK_kldR8bL3ZPioNAYux0GKvXlBWfIJ8_kHqE_Ji5j6NjxgqCN8cxNMx6QQplf7PhvLVTi6QsNUQGbZ-2T2UKZ3dln9Fcy1s4Kwp_Wb058V943zPJFr43SURDjZ9qpTQR7HVgDgDU2EiM6GU4HOgKBfAiU-zVgr7soVPTeo-6GJ6nbNxBPQ2NCDwNf5ZsqcAPpMbqAc5kQeoGQVfCHDOJZblqA'
    }
  };

  fetch(`https://api.euskadi.eus/euskalmet/weather/regions/${regions}/zones/${zones}/locations/${locations}/forecast/at/${fechaHoy}/for/${fechaManana}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud de pronóstico del tiempo');
      }
      return response.arrayBuffer();
    })
    .then(buffer => {
      const decoder = new TextDecoder('iso-8859-1');
      const text = decoder.decode(buffer);
      const data = JSON.parse(text);
      const prediccion = data.forecastText.SPANISH;

      marker.bindTooltip(prediccion, { className: 'custom-tooltip' }).openTooltip();
    })
    .catch(error => {
      console.error('Error al obtener el pronóstico del tiempo:', error);
      marker.bindTooltip('No se pudo obtener el pronóstico del tiempo', { className: 'custom-tooltip' }).openTooltip();
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
    // Asigna el manejador de eventos de clic al elemento mostrado
    elementoMostrar.addEventListener('click', eliminarItem);
  }
}

// Función para manejar el evento de clic en un ítem dentro de la carta
function eliminarItem(event) {
  // Oculta el elemento que ha sido clicado
  event.target.classList.add('d-none');
}

// Función para guardar o eliminar el estado de la baliza en localStorage
function guardarEliminarBaliza(nombreLugar, accion) {
  let balizas = obtenerBalizasGuardadas();
  if (accion === 'guardar') {
    if (!balizas.includes(nombreLugar)) {
      balizas.push(nombreLugar);
      // Añadir la clase huechange al marcador correspondiente
      let marker = document.querySelector(`.leaflet-marker-pane .tooltips[title="${nombreLugar}"]`);
      if (marker) {
        marker.classList.add('huechange');
      }
    }
  } else if (accion === 'eliminar') {
    let index = balizas.indexOf(nombreLugar);
    if (index !== -1) {
      balizas.splice(index, 1);
      // Eliminar la clase huechange del marcador correspondiente
      let marker = document.querySelector(`.leaflet-marker-pane .tooltips[title="${nombreLugar}"]`);
      console.log(marker);
      if (marker) {
        marker.classList.remove('huechange');
      }
    }
  }
  localStorage.setItem('balizas', JSON.stringify(balizas));
}

// Función para cargar las balizas marcadas guardadas en localStorage
function cargarBalizasGuardadas() {
  let balizas = obtenerBalizasGuardadas();
  balizas.forEach(nombreLugar => {
    let marker = document.querySelector(`.leaflet-marker-pane .tooltips[title="${nombreLugar}"]`);
    console.log(marker);
    if (marker) {
      console.log("llego a cambiar el color");
      marker.classList.add('huechange');
    }
  });
  regenerarCards();
  console.log("balizasGuardadas : ", balizas)
}

// Función para obtener las balizas marcadas guardadas en localStorage
function obtenerBalizasGuardadas() {
  return JSON.parse(localStorage.getItem('balizas')) || [];
}

function regenerarCards() {
  let cartas = obtenerBalizasGuardadas();
  cartas.forEach(cartaNombre => {
    if (document.getElementsByClassName(cartaNombre).length > 0) {
      document.getElementsByClassName(cartaNombre)[0].classList.toggle('d-none');
    }
  });
}

// Función para mostrar la animación de carga
function mostrarAnimacionCarga() {
  var loadingAnimation = document.getElementById('loadingAnimation');
  var animacionCarga = document.createElement('div');
  animacionCarga.classList.add('loader'); // Asegúrate de que la clase loader esté definida en tu CSS
  loadingAnimation.appendChild(animacionCarga);
  loadingAnimation.classList.remove('d-none');
}

// Función para ocultar la animación de carga
function ocultarAnimacionCarga() {
  var loadingAnimation = document.getElementById('loadingAnimation');
  // Eliminar la animación de carga
  loadingAnimation.classList.add('d-none');
}

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

const xValues = [100, 200, 300, 400, 500, 600, 700];

new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      data: [860, 1140, 1060, 1060, 1070, 1110, 1330],
      borderColor: "red",
      fill: false
    }, {
      data: [160, 400, 600, 600, 700, 750, 970],
      borderColor: "green",
      fill: false
    }, {
      data: [460, 540, 540, 560, 580, 620, 650],
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: { display: false }
  }
});
