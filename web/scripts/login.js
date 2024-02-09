let urlActual = (new URL(window.location.origin)).hostname;
const laravelApi = "http://" + urlActual + "";
const spa = `${laravelApi}:8081/spa.html`;

document.getElementById('formularioRegister').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementsByName('nombre')[0].value;
    const correo = document.getElementsByName('email')[0].value;
    const contrasena = document.getElementsByName('contrasena')[0].value;


    register(nombre, correo, contrasena);
});


document.getElementById('formularioInicioSesion').addEventListener('submit', function (event) {
    event.preventDefault();


    const correo = document.getElementsByName('correo')[0].value;
    const contrasena = document.getElementsByName('contrasenalog')[0].value;


    login(correo, contrasena);
});
/*
document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.querySelector(".nav-link");
    logoutButton.addEventListener("click", logout);
    console.log("llego");
})
*/

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

        if (!respuesta.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await respuesta.json();

        if (respuesta.status === 401) {
            console.log("Error: Unauthorized access");
        } else {
            console.log(data);
            sessionStorage.setItem('accessToken', data.access_token);
            window.location = spa;
            

        }
    } catch (error) {
        console.error("Error:", error.message);
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
