// Productos disponibles
const productos = [
    { codigo: "P001", descripcion: "Laptop HP 14”", valor: 2500000 },
    { codigo: "P002", descripcion: "Mouse Inalámbrico Logitech", valor: 90000 },
    { codigo: "P003", descripcion: "Teclado Mecánico Redragon", valor: 180000 },
    { codigo: "P004", descripcion: "Monitor LG 24”", valor: 720000 },
    { codigo: "P005", descripcion: "Impresora Epson EcoTank", valor: 590000 },
    { codigo: "P006", descripcion: "Tablet Samsung A8", valor: 880000 },
    { codigo: "P007", descripcion: "Disco SSD 500GB", valor: 250000 },
    { codigo: "P008", descripcion: "Memoria RAM 8GB DDR4", valor: 180000 },
    { codigo: "P009", descripcion: "Cable HDMI 2m", valor: 35000 },
    { codigo: "P010", descripcion: "Cámara Web Full HD", valor: 120000 }
];


let facturaActual = localStorage.getItem('facturaActual')
    ? parseInt(localStorage.getItem('facturaActual'))
    : 1;

// Cargar número de factura automáticamente
document.addEventListener('DOMContentLoaded', function () {
    // Autocompletar producto
    const codigoInput = document.getElementById('codigo');
    if (codigoInput) {
        codigoInput.addEventListener('input', function () {
            const codigo = codigoInput.value.trim().toUpperCase();
            const producto = productos.find(p => p.codigo === codigo);
            if (producto) {
                document.getElementById('descripcion').value = producto.descripcion;
                document.getElementById('valor').value = producto.valor;
            } else {
                document.getElementById('descripcion').value = '';
                document.getElementById('valor').value = '';
            }
        });
    }

    // Cargar número de factura en el campo
    const inputFactura = document.getElementById('factura');
    if (inputFactura) {
        inputFactura.value = facturaActual;
    }
});



function cargarProducto() {
    const codigo = document.getElementById('codigo').value;
    const producto = productosBase[codigo];
    if (producto) {
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('valor').value = producto.valor;
    } else {
        document.getElementById('descripcion').value = '';
        document.getElementById('valor').value = '';
    }
}

function agregarRegistro() {
    const documento = document.getElementById('documento').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const factura = document.getElementById('factura').value;
    const codigo = document.getElementById('codigo').value;
    const descripcion = document.getElementById('descripcion').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const valor = parseFloat(document.getElementById('valor').value);

    if (!documento || !nombres || !apellidos || !codigo || !descripcion || !cantidad || !valor) {
        Swal.fire('¡Error!', 'Por favor, complete todos los campos.', 'error');
        return;
    }

    if (!documento || !nombres || !apellidos || !codigo || !descripcion || !cantidad || !valor) {
        Swal.fire('¡Error!', 'Por favor, complete todos los campos.', 'error');
        return;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad inválida',
            text: 'La cantidad debe ser un número entero mayor que cero.'
        });
        return;
    }


    const venta = {
        documento,
        nombres,
        apellidos,
        factura,
        codigo,
        descripcion,
        cantidad,
        valor,
        iva: (valor * cantidad) * 0.19,
        subtotal: (valor * cantidad) * 1.19,
        fecha: new Date().toLocaleDateString('es-CO')
    };

    // Guardar cliente
    localStorage.setItem('clienteActual', JSON.stringify({ documento, nombres, apellidos }));

    // Guardar producto en la factura
    const clave = `ventas_factura_${factura}`;
    const ventas = JSON.parse(localStorage.getItem(clave)) || [];
    ventas.push(venta);
    localStorage.setItem(clave, JSON.stringify(ventas));

    Swal.fire('Producto agregado', '¿Desea continuar agregando productos?', 'success');

    ['codigo', 'descripcion', 'cantidad', 'valor'].forEach(id => document.getElementById(id).value = '');
}

function mostrarFactura() {
    const factura = facturaActual;
    const ventas = JSON.parse(localStorage.getItem(`ventas_factura_${factura}`)) || [];
    const cliente = JSON.parse(localStorage.getItem('clienteActual')) || {};

    let tabla = '';
    let total = 0;
    ventas.forEach(v => {
        tabla += `
        <tr>
          <td>${v.fecha}</td>
          <td>${v.codigo}</td>
          <td>${v.descripcion}</td>
          <td>${v.cantidad}</td>
          <td>${formatearMoneda(v.valor)}</td>
          <td>${formatearMoneda(v.iva)}</td>
          <td>${formatearMoneda(v.subtotal)}</td>
        </tr>
      `;
        total += v.subtotal;
    });

    document.getElementById('tablaProductos').innerHTML = tabla;
    document.getElementById('totalFactura').textContent = formatearMoneda(total);

    if (cliente.documento) {
        document.getElementById('datosCliente').innerHTML = `
        <strong>Cliente:</strong> ${cliente.nombres} ${cliente.apellidos} - <strong>Documento:</strong> ${cliente.documento}
      `;
    }
}

function finalizarFactura() {
    const clave = `ventas_factura_${facturaActual}`;
    const ventas = JSON.parse(localStorage.getItem(clave));
    const cliente = JSON.parse(localStorage.getItem('clienteActual'));

    if (!ventas || ventas.length === 0) {
        Swal.fire('Factura vacía', 'Agregue productos antes de finalizar.', 'warning');
        return;
    }

    const total = ventas.reduce((sum, v) => sum + v.subtotal, 0);
    const resumen = { factura: facturaActual, cliente, total };

    const historial = JSON.parse(localStorage.getItem('historialFacturas')) || [];
    historial.push(resumen);
    localStorage.setItem('historialFacturas', JSON.stringify(historial));

    Swal.fire('Factura finalizada', `Factura #${facturaActual} registrada.`, 'success');

    localStorage.removeItem(clave);
    localStorage.removeItem('clienteActual');
    facturaActual++;
    localStorage.setItem('facturaActual', facturaActual);

    setTimeout(() => window.location.href = 'index.html', 1500);
}

function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historialFacturas')) || [];
    let html = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th># Factura</th>
            <th>Cliente</th>
            <th>Documento</th>
            <th>Total Pagado</th>
          </tr>
        </thead>
        <tbody>
    `;
    historial.forEach(f => {
        html += `
        <tr>
          <td>${f.factura}</td>
          <td>${f.cliente.nombres} ${f.cliente.apellidos}</td>
          <td>${f.cliente.documento}</td>
          <td>${formatearMoneda(f.total)}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    document.getElementById('historialFacturas').innerHTML = html;
}

function formatearMoneda(valor) {
    return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
}
