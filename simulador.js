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
        fetch('datos.json')
            .then(response => response.json())
            .then(data => {
                interesInput.value = data.tasas[input.value];
            })
            .catch(error => console.error('Error al cargar el JSON:', error));
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

    tablaPagos.innerHTML = ''; 
    pagosMensuales = []; 

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
    actualizarGrafico();
    mostrarFormularioSolicitud();
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
    tablaPagos.innerHTML = ''; 

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

function actualizarGrafico() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: pagosMensuales.map(pago => pago.mes),
            datasets: [{
                label: 'Saldo Restante',
                data: pagosMensuales.map(pago => pago.saldo),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function mostrarFormularioSolicitud() {
    document.getElementById('formularioSolicitud').style.display = 'block';
}

document.getElementById('formularioCredito').addEventListener('submit', (event) => {
    event.preventDefault();
    calcularCredito();
});

document.getElementById('formularioSolicitud').addEventListener('submit', (event) => {
    event.preventDefault();
    mostrarMensajeSolicitud();
});

function mostrarMensajeSolicitud() {
    const mensajeSolicitud = document.getElementById('mensajeSolicitud');
    mensajeSolicitud.innerHTML = `
        <h2>Solicitud Enviada</h2>
        <p>Gracias por enviar tu solicitud. Nos pondremos en contacto luego de revisar tu VERAZ.</p>
    `;
    mensajeSolicitud.style.display = 'block';
    document.getElementById('formularioSolicitud').style.display = 'none';
}
