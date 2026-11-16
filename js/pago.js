
let pagos = [];
let siguienteId = 1;

const formulario = document.querySelector('#form-pago');
const tarjeta = document.querySelector('#tarjeta');
const cvv = document.querySelector('#cvv');

// Crear mensaje general.
const mensaje = document.createElement('p');
mensaje.id = 'mensaje';
formulario.after(mensaje);

// Crear seccion de pagos registrados.
const seccion = document.createElement('section');
const titulo = document.createElement('h3');
titulo.textContent = 'Pagos registrados';

const buscar = document.createElement('input');
buscar.type = 'search';
buscar.placeholder = 'Buscar por numero de tarjeta';

const contador = document.createElement('p');
const lista = document.createElement('div');

seccion.append(titulo, buscar, contador, lista);
mensaje.after(seccion);

// Limpiar mensajes al modificar los campos.
formulario.addEventListener('input', () => {
    mensaje.textContent = '';
});

// Validar y registrar el pago.
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const errores = {};

    // Validar numero de tarjeta.
    const numeroTarjeta = tarjeta.value.replace(/\s/g, '');

    if (!/^\d{16}$/.test(numeroTarjeta)) {
        errores.tarjeta = 'Ingresa un numero de tarjeta de 16 digitos.';
    }

    // Validar CVV.
    if (!/^\d{3,4}$/.test(cvv.value)) {
        errores.cvv = 'Ingresa un CVV de 3 o 4 digitos.';
    }

    // Mostrar errores junto a cada campo.
    for (const campo of ['tarjeta', 'cvv']) {
        let error = document.querySelector('#error-' + campo);

        if (!error) {
            error = document.createElement('p');
            error.id = 'error-' + campo;
            error.className = 'error';
            document.querySelector('#' + campo).after(error);
        }

        error.textContent = errores[campo] || '';

        document.querySelector('#' + campo)
            .setAttribute('aria-invalid', String(Boolean(errores[campo])));
    }

    // Comprobar si existen errores.
    const campos = Object.keys(errores);

    if (campos.length > 0) {
        mensaje.textContent = 'Revisa los campos indicados.';
        document.querySelector('#' + campos[0]).focus();
        return;
    }

    // Construir el objeto y agregarlo al arreglo.
    // No almacenamos el numero completo ni el CVV.
    pagos.push({
        id: siguienteId++,
        tarjeta: '**** **** **** ' + numeroTarjeta.slice(-4),
        estado: 'Registrado'
    });

    mensaje.textContent = 'Registro realizado correctamente.';

    formulario.reset();

    mostrarPagos();
});

// Mostrar los pagos registrados.
function mostrarPagos() {

    const consulta = buscar.value.trim().toLowerCase();

    const visibles = pagos.filter(p =>
        p.tarjeta.toLowerCase().includes(consulta)
    );

    lista.replaceChildren();

    contador.textContent =
        `${pagos.length} registrados. ${visibles.length} visibles.`;

    if (visibles.length === 0) {
        lista.textContent = 'No hay pagos que mostrar.';
    }

    // Recorrer cada pago del arreglo.
    visibles.forEach(pago => {

        const fila = document.createElement('article');

        const titulo = document.createElement('h4');
        titulo.textContent = `Pago ${pago.id}`;

        const detalle = document.createElement('p');
        detalle.textContent =
            `${pago.tarjeta} - ${pago.estado}`;

        // Boton para cambiar el estado.
        const estado = document.createElement('button');
        estado.type = 'button';

        estado.textContent =
            pago.estado === 'Registrado'
                ? 'Marcar revisado'
                : 'Reabrir';

        estado.addEventListener('click', () => {

            pago.estado =
                pago.estado === 'Registrado'
                    ? 'Revisado'
                    : 'Registrado';

            mostrarPagos();
        });

        // Boton para eliminar.
        const eliminar = document.createElement('button');
        eliminar.type = 'button';
        eliminar.textContent = 'Eliminar';

        eliminar.addEventListener('click', () => {

            if (!confirm('¿Eliminar este registro?')) return;

            pagos = pagos.filter(p => p.id !== pago.id);

            mostrarPagos();
        });

        fila.append(titulo, detalle, estado, eliminar);

        lista.append(fila);
    });
}

// Buscar pagos.
buscar.addEventListener('input', mostrarPagos);

// Mostrar lista inicial.
mostrarPagos();
