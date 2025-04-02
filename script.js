// Guardar los registros de ventas en localStorage
function agregarRegistro() {
    let nombre = document.getElementById('nombres').value;
    let apellido = document.getElementById('apellidos').value;
    let cedula = document.getElementById('cedula').value;
    let codigo = document.getElementById('codigo').value;
    let descripcion = document.getElementById('descripcion').value;
    let cantidad = document.getElementById('cantidad').value;
    let valor = document.getElementById('valor').value;

    if (!nombre || !apellido || !cedula || !codigo || !descripcion || !cantidad || !valor) {
        Swal.fire('¡Error!', 'Por favor, complete todos los campos.', 'error');
        return;
    }

    // Calcular el IVA y el subtotal
    let iva = (valor * cantidad) * 0.19;
    let subtotal = (valor * cantidad) + iva;

    let venta = {
        nombre: nombre,
        apellido: apellido,
        cedula: cedula,
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
    document.getElementById('ventaForm').reset();
    Swal.fire('¡Éxito!', 'Registro agregado con éxito.', 'success');
}

// Mostrar los datos de la factura
function mostrarFactura() {
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    let cliente = ventas[ventas.length - 1];

    // Mostrar los datos del cliente
    document.getElementById('clienteDatos').innerHTML = `
        <p><strong>Nombre:</strong> ${cliente.nombre} ${cliente.apellido}</p>
        <p><strong>Cédula:</strong> ${cliente.cedula}</p>
    `;

    // Mostrar los productos vendidos en la tabla
    let tablaProductos = document.getElementById('tablaProductos');
    ventas.forEach(venta => {
        let row = tablaProductos.insertRow();
        row.insertCell(0).textContent = venta.codigo;
        row.insertCell(1).textContent = venta.descripcion;
        row.insertCell(2).textContent = venta.cantidad;
        row.insertCell(3).textContent = `$${venta.valor}`;
        row.insertCell(4).textContent = `$${venta.iva}`;
        row.insertCell(5).textContent = `$${venta.subtotal}`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('totalFactura.html')) {
        mostrarFactura();
    }
});
