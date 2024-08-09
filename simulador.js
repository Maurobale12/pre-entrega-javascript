

console.log("¡Hola! Bienvenido al simulador de créditos.");
const nombre = prompt("Por favor, ingrese su nombre:");
const apellido = prompt("Por favor, ingrese su apellido:");
const edad = prompt("Por favor, ingrese su edad:");

if (edad < 18) {
    alert("Usted es menor de edad.");
    document.getElementById('formularioCredito').style.display = 'none';
} else {
    console.log(`Hola ${nombre} ${apellido}, gracias por usar nuestro simulador.`);
}

function calcularCredito() {
    const monto = document.getElementById('monto').value;
    const interes = document.getElementById('interes').value;
    const años = document.getElementById('años').value;
    const resultado = document.getElementById('resultado');

    if (monto <= 0 || interes <= 0 || años <= 0) {
        resultado.textContent = "Por favor, ingrese valores positivos.";
        return;
    }

    let montoTotal = parseFloat(monto);
    const interesMensual = parseFloat(interes) / 100 / 12;
    const mesesTotales = parseInt(años) * 12;

    for (let i = 0; i < mesesTotales; i++) {
        montoTotal += montoTotal * interesMensual;
    }

    resultado.textContent = `Monto total a pagar: $${montoTotal.toFixed(2)}`;
}


