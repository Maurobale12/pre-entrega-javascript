document.getElementById('btnContinuar').addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = document.getElementById('edad').value;

    if (edad < 18) {
        mostrarMensajeEdad("Sos menor de edad, no puedes obtener un préstamo.");
        document.getElementById('formularioCredito').style.display = 'none';
    } else {
        mostrarMensajeEdad("");
        document.getElementById('datosUsuario').style.display = 'none';
        document.getElementById('formularioCredito').style.display = 'block';
    }
});

document.querySelectorAll('input[name="moneda"]').forEach((input) => {
    input.addEventListener('change', () => {
        const interesInput = document.getElementById('interes');
        switch (input.value) {
            case 'pesos':
                interesInput.value = 85;
                break;
            case 'dolares':
                interesInput.value = 105;
                break;
            case 'euros':
                interesInput.value = 110;
                break;
        }
    });
});

let pagosMensuales = [];

function inicializarVariables() {
    const monedaSeleccionada = document.querySelector('input[name="moneda"]:checked').value;
    monto = document.getElementById('monto').value;
    interes = document.getElementById('interes').value;
    años = document.getElementById('años').value;
    resultado = document.getElementById('resultado');
    tablaPagos = document.getElementById('tablaPagos').getElementsByTagName('tbody')[0];
}

function calcularCredito() {
    inicializarVariables();

    if (monto <= 0 || interes <= 0 || años <= 0) {
        mostrarMensaje("Por favor, ingrese valores positivos.");
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

    const moneda = document.querySelector('input[name="moneda"]:checked').value;
    mostrarMensaje(`Monto total a pagar en ${moneda}: $${(pagoMensual * mesesTotales).toFixed(2)}`);
    actualizarTablaPagos(pagosMensuales);
    guardarDatos();
}

function mostrarMensaje(mensaje) {
    const resultado = document.getElementById('resultado');
    resultado.textContent = mensaje;
}

function mostrarMensajeEdad(mensaje) {
    const mensajeEdad = document.getElementById('mensajeEdad');
    mensajeEdad.textContent = mensaje;
    mensajeEdad.style.display = mensaje ? 'block' : 'none';
}

function actualizarTablaPagos(pagosMensuales) {
    const tablaPagos = document.getElementById('tablaPagos').getElementsByTagName('tbody')[0];
    tablaPagos.innerHTML = ''; // Limpiar tabla

    pagosMensuales.forEach(pago => {
        let fila = tablaPagos.insertRow();
        fila.insertCell(0).textContent = pago.mes;
        fila.insertCell(1).textContent = pago.monto.toFixed(2);
        fila.insertCell(2).textContent = pago.saldo.toFixed(2);
    });
}

function guardarDatos() {
    const datos = {
        moneda: document.querySelector('input[name="moneda"]:checked').value,
        monto: document.getElementById('monto').value,
        interes: document.getElementById('interes').value,
        años: document.getElementById('años').value
    };
    localStorage.setItem('datosCredito', JSON.stringify(datos));
}

function cargarDatos() {
    const datos = JSON.parse(localStorage.getItem('datosCredito'));
    if (datos) {
        document.getElementById('moneda').value = datos.moneda;
        document.getElementById('monto').value = datos.monto;
        document.getElementById('interes').value = datos.interes;
        document.getElementById('años').value = datos.años;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});

document.getElementById('formularioCredito').addEventListener('submit', (event) => {
    event.preventDefault();
    calcularCredito();
});
