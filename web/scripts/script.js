  // Inicializar el mapa y establecer las coordenadas y el nivel de zoom
  var map = L.map('mapid').setView([43.139, -2.20], 9);


  // Añadir una capa de tiles de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

    var lugares = [
        { "nombre": "Donosti", "latitud": 43.3183, "longitud": -1.9812 },
        { "nombre": "Bilbao", "latitud": 43.2630, "longitud": -2.9350 },
        { "nombre": "Vitoria", "latitud": 42.8595, "longitud": -2.6818 }
    ]

lugares.forEach(lugar => {
    var marker = L.marker([lugar.latitud, lugar.longitud]).addTo(map);
    marker.bindTooltip(lugar.nombre, {
        permanent: false,
        direction: 'top',
        offset: L.point(0, -20)
    });
    marker.on('click', function() {
    console.log('Click' +lugar.nombre);
});
});

const xValues = [100,200,300,400,500,600,700];

new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{ 
        data: [100,465,677,200],
      borderColor: "red",
      fill: false
    }, { 
        data: [100,156,677,400],
      borderColor: "green",
      fill: false
    }, { 
      data: [100,200,765,895],
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: {display: false}
  }
});


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
