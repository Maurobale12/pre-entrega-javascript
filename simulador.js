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

let pagosMensuales = [];

function inicializarVariables() {
    monto = document.getElementById('monto').value;
    interes = document.getElementById('interes').value;
    años = document.getElementById('años').value;
    resultado = document.getElementById('resultado');
    tablaPagos = document.getElementById('tablaPagos').getElementsByTagName('tbody')[0];
}

function calcularCredito() {
    inicializarVariables();

    if (monto <= 0 || interes <= 0 || años <= 0) {
        resultado.textContent = "Por favor, ingrese valores positivos.";
        return;
    }

    let montoTotal = parseFloat(monto);
    const interesMensual = parseFloat(interes) / 100 / 12;
    const mesesTotales = parseInt(años) * 12;
    let saldoRestante = montoTotal;
    let pagoMensual = montoTotal * interesMensual / (1 - Math.pow(1 + interesMensual, -mesesTotales));

    tablaPagos.innerHTML = ''; // Limpiar tabla
    pagosMensuales = []; // Limpiar array

    for (let i = 1; i <= mesesTotales; i++) {
        saldoRestante -= pagoMensual - saldoRestante * interesMensual;
        let fila = tablaPagos.insertRow();
        fila.insertCell(0).textContent = i;
        fila.insertCell(1).textContent = pagoMensual.toFixed(2);
        fila.insertCell(2).textContent = saldoRestante.toFixed(2);
        pagosMensuales.push({ mes: i, monto: pagoMensual, saldo: saldoRestante });
    }

    resultado.textContent = `Monto total a pagar: $${(pagoMensual * mesesTotales).toFixed(2)}`;
}

function buscarPago(mes) {
    return pagosMensuales.find(pago => pago.mes === mes);
}

function filtrarPagos(minMonto) {
    return pagosMensuales.filter(pago => pago.monto >= minMonto);
}
