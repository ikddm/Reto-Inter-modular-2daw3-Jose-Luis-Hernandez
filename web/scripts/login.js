let urlActual = (new URL(window.location.origin)).hostname;
const laravelApi = "http://" + urlActual + "";
const spa = `${laravelApi}:8081/spa.html`;

// Esto se utiliza para escuchar el evento del envio del formulario de registro
document.getElementById('formularioRegister').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementsByName('nombre')[0].value;
    const correo = document.getElementsByName('email')[0].value;
    const contrasena = document.getElementsByName('contrasena')[0].value;


    register(nombre, correo, contrasena);
});

// Esto se utiliza para escuchar el evento del envio del formulario de login
document.getElementById('formularioInicioSesion').addEventListener('submit', function (event) {
    event.preventDefault();


    const correo = document.getElementsByName('correo')[0].value;
    const contrasena = document.getElementsByName('contrasenalog')[0].value;


    login(correo, contrasena);
});
//Función para alternar entre ambos formularios
function cambiarFormulario() {

    var formRegistro = document.getElementById('formularioRegister');
    var formInicioSesion = document.getElementById('formularioInicioSesion');


    formRegistro.classList.toggle('d-none');
    formInicioSesion.classList.toggle('d-none');
}

/*Función para registrarse, recibimos 3 parametros que hemos recuperado en el evento de escucha 
hace un fetch a el servidor laravel y tras crear el usuario llama a la función login para logear
sin necesidad de escribir el correo y la contraseña de nuevo*/
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

/*Función para logear, recibimos 2 parametros que hemos recuperado en el evento de escucha 
hace un fetch a el servidor laravel y seteamos en el session storage el token bearer que nos da laravel*/

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
/*Función para cerrar sesion, se recoge el item de la session storage y tras verificar
que es correcto cierra sesión*/
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
