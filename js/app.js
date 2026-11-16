
"use strict";

// SEMANA 03 - Gestión de reposiciones
// Alessandra Penny

let reposiciones = [];
let siguienteId = 9;

// Elementos del formulario
const formulario = document.querySelector("#form-reposicion");
const productoInput = document.querySelector("#producto");
const cantidadInput = document.querySelector("#cantidad");
const responsableInput = document.querySelector("#responsable");

// Elementos de la lista
const buscar = document.querySelector("#buscar");
const lista = document.querySelector("#lista-reposiciones");
const contador = document.querySelector("#contador");

// Elementos de la pantalla RP-008
const boton = document.querySelector(".boton_reposicion");
const estadoTexto = document.querySelector(".texto_englobado");

// 1. Validar los datos
function validarFormulario() {
    let valido = true;

    const producto = productoInput.value.trim();
    const cantidad = Number(cantidadInput.value);
    const responsable = responsableInput.value.trim();

    document.querySelector("#error-producto").textContent = "";
    document.querySelector("#error-cantidad").textContent = "";
    document.querySelector("#error-responsable").textContent = "";

    if (producto.length < 3) {
        document.querySelector("#error-producto").textContent =
            "Ingresa un producto de al menos 3 caracteres.";
        valido = false;
    }

    if (
        cantidadInput.value.trim() === "" ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        document.querySelector("#error-cantidad").textContent =
            "Ingresa una cantidad entera mayor que cero.";
        valido = false;
    }

    if (responsable.length < 3) {
        document.querySelector("#error-responsable").textContent =
            "Ingresa el nombre del responsable.";
        valido = false;
    }

    return valido;
}

// 2. Registrar reposiciones
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const reposicion = {
        id: siguienteId++,
        producto: productoInput.value.trim(),
        cantidad: Number(cantidadInput.value),
        responsable: responsableInput.value.trim(),
        estado: "Generada"
    };

    reposiciones.push(reposicion);

    formulario.reset();
    mostrarReposiciones();
});

// 3. Mostrar la lista
function mostrarReposiciones() {
    lista.replaceChildren();

    const consulta = buscar.value.trim().toLowerCase();

    const visibles = reposiciones.filter(function (r) {
        return r.producto.toLowerCase().includes(consulta);
    });

    contador.textContent =
        "Total de reposiciones: " + reposiciones.length;

    if (visibles.length === 0) {
        const mensaje = document.createElement("p");

        mensaje.textContent =
            reposiciones.length === 0
                ? "No hay reposiciones registradas."
                : "No se encontraron coincidencias.";

        lista.append(mensaje);
        return;
    }

    visibles.forEach(function (reposicion) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-reposicion";

        const titulo = document.createElement("h3");
        titulo.textContent =
            "RP-" + String(reposicion.id).padStart(3, "0") +
            " · " + reposicion.producto;

        const detalle = document.createElement("p");
        detalle.textContent =
            "Cantidad: " + reposicion.cantidad +
            " cuchareables";

        const responsable = document.createElement("p");
        responsable.textContent =
            "Responsable: " + reposicion.responsable;

        const estado = document.createElement("p");
        estado.textContent = "Estado: " + reposicion.estado;

        // 4. Cambiar estado
        const botonEstado = document.createElement("button");
        botonEstado.type = "button";
        botonEstado.textContent = "Cambiar estado";

        botonEstado.addEventListener("click", function () {
            if (reposicion.estado === "Generada") {
                reposicion.estado = "Programada";
            } else if (reposicion.estado === "Programada") {
                reposicion.estado = "Completada";
            } else {
                reposicion.estado = "Generada";
            }

            mostrarReposiciones();
        });

        // 5. Eliminar por ID
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "boton-eliminar";

        botonEliminar.addEventListener("click", function () {
            const confirmar = confirm(
                "¿Eliminar la reposición RP-" +
                String(reposicion.id).padStart(3, "0") + "?"
            );

            if (!confirmar) {
                return;
            }

            reposiciones = reposiciones.filter(function (r) {
                return r.id !== reposicion.id;
            });

            mostrarReposiciones();
        });

        tarjeta.append(
            titulo,
            detalle,
            responsable,
            estado,
            botonEstado,
            botonEliminar
        );

        lista.append(tarjeta);
    });
}

// 6. Buscar sin eliminar registros
buscar.addEventListener("input", mostrarReposiciones);

// 7. Integrar el botón RP-008 existente
if (boton && estadoTexto) {
    boton.addEventListener("click", function () {
        const yaExiste = reposiciones.some(function (r) {
            return r.id === 8;
        });

        if (yaExiste) {
            return;
        }

        const reposicionInicial = {
            id: 8,
            producto: "Chocolate intenso",
            cantidad: 41,
            responsable: "Por asignar",
            estado: "Programada"
        };

        reposiciones.push(reposicionInicial);

        estadoTexto.textContent = "Reposición programada";
        boton.textContent = "Reposición programada";
        boton.disabled = true;

        mostrarReposiciones();

        alert("Reposición RP-008 programada correctamente");
    });
}

// 8. Dibujar el estado inicial
mostrarReposiciones();
