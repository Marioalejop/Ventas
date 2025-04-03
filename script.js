// Guardar los registros de ventas en localStorage
function agregarRegistro() {
    let documento = document.getElementById('documento').value;
    let nombre = document.getElementById('nombres').value;
    let apellido = document.getElementById('apellidos').value;
    let factura = document.getElementById('factura').value;
    let codigo = document.getElementById('codigo').value;
    let descripcion = document.getElementById('descripcion').value;
    let cantidad = document.getElementById('cantidad').value;
    let valor = document.getElementById('valor').value;

    if (!documento || !nombre || !apellido || !factura || !codigo || !descripcion || !cantidad || !valor) {
        Swal.fire('¡Error!', 'Por favor, complete todos los campos.', 'error');
        return;
    }

    // Calcular el IVA y el subtotal
    let iva = (valor * cantidad) * 0.19;
    let subtotal = (valor * cantidad) + iva;

    let venta = {
        nombre: nombre,
        apellido: apellido,
        factura: factura,
        documento: documento,
        codigo: codigo,
        descripcion: descripcion,
        cantidad: cantidad,
        valor: valor,
        iva: iva,
        subtotal: subtotal
    };

    // Verificar si ya existe un registro de ventas en localStorage
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    ventas.push(venta);

    // Guardar los datos en localStorage
    localStorage.setItem('ventas', JSON.stringify(ventas));

    // Limpiar el formulario
    document.getElementById('productoForm').reset();
    Swal.fire('¡Éxito!', 'Registro agregado con éxito.', 'success');

}

// Mostrar los datos de la factura
function mostrarFactura() {
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    let cliente = ventas[ventas.length - 1];

    // Mostrar los datos del cliente
    document.getElementById('clienteDatos').innerHTML = `
        <p><strong>Nombre:</strong> ${cliente.nombre}</p>
        <p><strong>Apellido:</strong> ${cliente.apellido}</p>
        <p><strong>Documento:</strong> ${cliente.documento}</p>
    `;

    // Mostrar los productos vendidos en la tabla
    let tablaProductos = document.getElementById('tablaProductos');
    ventas.forEach(venta => {
        console.log(venta.factura);
        let row = tablaProductos.insertRow();
        row.insertCell(0).textContent = venta.factura;
        row.insertCell(1).textContent = venta.codigo;
        row.insertCell(2).textContent = venta.descripcion;
        row.insertCell(3).textContent = venta.cantidad;
        row.insertCell(4).textContent = `$${venta.valor}`;
        row.insertCell(5).textContent = `$${venta.iva}`;
        row.insertCell(6).textContent = `$${venta.subtotal}`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('totalFactura.html')) {
        mostrarFactura();
    }
});

function finalizarFactura() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas finalizar la factura?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Eliminando datos de localStorage..."); // Verifica si entra en el bloque de confirmación
            localStorage.removeItem('ventas');
            Swal.fire('¡Factura Finalizada!', 'Los datos de la factura han sido eliminados.', 'success');
            setTimeout(() => {
                console.log("Redirigiendo al menú principal..."); // Verifica si se ejecuta la redirección
                window.location.href = 'index.html';
            }, 2000);
        }
    });
}