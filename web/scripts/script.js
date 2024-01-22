// Inicializar el mapa y establecer las coordenadas y el nivel de zoom
var map = L.map('mapid').setView([43.139, -2.20], 9);


// Añadir una capa de tiles de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

var lugares = [
  { "nombre": "Donosti", "latitud": 43.3183, "longitud": -1.9812, "regions": 'basque_country', "zones": 'donostialdea', "locations": 'donostia' },
  { "nombre": "Bilbao", "latitud": 43.2630, "longitud": -2.9350, "regions": 'basque_country', "zones": 'great_bilbao', "locations": 'bilbao' },
  { "nombre": "Vitoria", "latitud": 42.8599, "longitud": -2.6818, "regions": 'basque_country', "zones": 'vitoria_gasteiz', "locations": 'gasteiz' }
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
    cards = document.getElementsByClassName("carta");
    for (let card of cards) {
      if (lugar.nombre == card.className.split(" ")[1]) {
        if (card.style.display == "none") {
          
          card.classList.toggle('d-none');
          
        } else {
          card.classList.toggle('d-none');
        }
      }
    }
  })


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
    .then(response => marker.setTooltipContent(response.forecastText.SPANISH))

    .catch(err => console.error(err));
});
});

/*Esto es el gráfico en un futuro los datos tienen que ser consultas a la api*/

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