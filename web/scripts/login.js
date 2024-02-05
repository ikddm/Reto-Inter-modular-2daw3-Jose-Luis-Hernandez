const laravelApi = 'http://localhost:8082';


document.getElementById('formularioRegister').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar la presentación del formulario por defecto
    console.log("registro llego");

    const correo = document.getElementsByName('email')[0].value;
    const contrasena = document.getElementsByName('contrasena')[0].value;

    register(nombre, correo, contrasena);
});

document.getElementById('formularioInicioSesion').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar la presentación del formulario por defecto
    console.log("llego");

    const correo = document.getElementsByName('email')[0].value;
    const contrasena = document.getElementsByName('contrasena')[0].value;

    // Llama a la función correspondiente para manejar el inicio de sesión
    login(correo, contrasena);
});


function cambiarFormulario() {
    
    var formRegistro = document.getElementById('formularioRegister');
    var formInicioSesion = document.getElementById('formularioInicioSesion');

    
    formRegistro.classList.toggle('d-none'); 
    formInicioSesion.classList.toggle('d-none');
}


async function register(nombre, correo, contrasena) {

    try {
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

        if ([data["message"] == 'Successfully created user!']) {
            login(data["email"], data["password"]);
        }

    } catch (error) {
        console.error(error);
    }
};

async function login(correo, contrasena) {
    console.log(correo,contrasena);
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
        window.location.href = "http://localhost:8081/spa.html"
        
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
