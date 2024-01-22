const laravelApi = 'http://localhost:8082';


document.getElementById('formularioRegister').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const nombre = document.getElementsByName('nombre')[0].value;
    const correo = document.getElementsByName('email')[0].value;
    const contrasena = document.getElementsByName('contrasena')[0].value;

    register(nombre, correo, contrasena);
});

function cambiarFormulario() {
    
    var formRegistro = document.getElementById('formularioRegister');
    var formInicioSesion = document.getElementById('formularioInicioSesion');

    
    formRegistro.classList.toggle('d-none'); 
    formInicioSesion.classList.toggle('d-none');
}


async function register(nombre, correo, contrasena) {

    try {
        console.log("llego");
        let respuesta = await fetch(laravelApi + "/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: nombre,
                email: correo,
                password: contrasena
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        let data = await respuesta.json();
        console.log(data);

        if ([data["message"] == 'Successfully created user!']) {
            console.log(data["email"], data["password"]);
            login(data["email"], data["password"]);
            window.location.href = "http://localhost:8080/spa.html"
        }

    } catch (error) {
        console.error(error);
    }
};

async function login(correo, contrasena) {

    try {
        let respuesta = await fetch(laravelApi + "/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: correo,
                password: contrasena,
                remember_me: 1
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'X-Requested-With': 'XMLHttpRequest',
                'Access-Control-Allow-Origin': '*'
            }
        });
        let data = await respuesta.json();
    
        
    } catch (error) {
        console.error(error);
    }
}

async function logout() {
    try {
        let respuesta = await fetch(laravelApi + "/api/auth/logout", {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            }
        });

        let data = await respuesta.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

// aqui va ir una funcionalidad sobre que en base a que estacion de año este la foto de fondo cambiara 