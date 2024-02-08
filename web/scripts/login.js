
const  urlActual = (new URL(window.location.origin)).hostname;
const laravelApi = "http://" + urlActual + "";

document.getElementById('formularioRegister').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const nombre = document.getElementsByName('nombre')[0].value;
    const correo = document.getElementsByName('email')[0].value;
    const contrasena = document.getElementsByName('contrasena')[0].value;

    // Call the register function with the retrieved data
    register(nombre, correo, contrasena);
});


document.getElementById('formularioInicioSesion').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar la presentación del formulario por defecto


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
        let respuesta = await fetch(laravelApi + ":8082/api/auth/register", {
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
            login(data["email"], data["password"]);
        }
        console.log(data);

    } catch (error) {
        console.error(error);
    }
};

async function login(correo, contrasena) {
    console.log(correo, contrasena);
    try {
        let respuesta = await fetch(laravelApi + ":8082/api/auth/login", {
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
        window.location.href = laravelApi + ":80/spa.html"

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
