function alertaDatos(){
    alert("Sus datos seran guardados bajo la responsabilidad de JLCompany")
}

function login(){
    let email= document.getElementsByName("email");
    let Contrasena= document.getElementsByName("Contrasena");
    
    const data= {
        email: email,
        Contrasena: Contrasena
    };
    fetch('http://localhost:8082/api/auth/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'applications/json',
        },
        body:JSON.stringify(data),
    }
    )}


    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })