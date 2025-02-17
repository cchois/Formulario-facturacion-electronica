document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector("form"),
        nextBtn = form.querySelector(".nextBtn"),
        backBtn = form.querySelector(".backBtn"),
        firstFormInputs = form.querySelectorAll(".form.first input[required], .form.first select[required]"),
        secondFormInputs = form.querySelectorAll(".form.second input[required], .form.second select[required]"),
        submitBtn = form.querySelector(".submitBtn"),
        productTable = document.getElementById("productTable"),
        addProductBtn = document.getElementById("addProductBtn");

    const nitRut = document.querySelector("#NIT\\/RUT input"),
        telefono = document.querySelector("#Teléfono input"),
        email = document.querySelector("#Correo\\ Electrónico input"),
        numeroFactura = document.querySelector("#Número\\ de\\ Factura input"),
        direccion = document.querySelector('input[placeholder="Dirección del cliente"]');

    nextBtn.addEventListener("click", (event) => {
        for (const input of firstFormInputs) {
            if (input.value.trim() === "") {
                alert(`El campo "${input.previousElementSibling.textContent}" es obligatorio.`);
                input.focus();
                event.preventDefault();
                return;
            }
        }

        // Add phone validation
        if (telefono && (!/^[0-9]+$/.test(telefono.value) || telefono.value.length < 10)) {
            alert("El teléfono debe contener solo números y tener al menos 10 dígitos.");
            telefono.focus();
            event.preventDefault();
            return;
        }

        // Add email validation
        if (email && !/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email.value)) {
            alert("Por favor ingrese un correo electrónico válido.");
            email.focus();
            event.preventDefault();
            return;
        }

        // Add NIT/RUT validation
        if (nitRut && (!/^[0-9]+$/.test(nitRut.value) || parseInt(nitRut.value) <= 0)) {
            alert("El NIT/RUT debe ser un número válido.");
            nitRut.focus();
            event.preventDefault();
            return;
        }

        // Add invoice number validation
        if (numeroFactura && (!/^[0-9]+$/.test(numeroFactura.value) || parseInt(numeroFactura.value) <= 0)) {
            alert("El número de factura debe ser un número válido.");
            numeroFactura.focus();
            event.preventDefault();
            return;
        }

        // Add address validation
        if (direccion && direccion.value.trim() === "") {
            alert("La dirección es obligatoria.");
            direccion.focus();
            event.preventDefault();
            return;
        }

        form.classList.add('secActive');
    });

    backBtn.addEventListener("click", () => form.classList.remove('secActive'));

    submitBtn.addEventListener("click", (event) => {
        for (const input of secondFormInputs) {
            if (input.value.trim() === "") {
                alert(`El campo "${input.previousElementSibling.textContent}" es obligatorio.`);
                input.focus();
                event.preventDefault();
                return;
            }
        }
        genPDF();
        alert("Formulario enviado con éxito.");
    });

    const calculateRowTotal = (row) => {
        const cantidad = parseFloat(row.querySelector('input[placeholder="Cantidad"]').value) || 0;
        const precioUnitario = parseFloat(row.querySelector('input[placeholder="Precio por unidad"]').value) || 0;
        const iva = parseFloat(row.querySelector('input[placeholder="Porcentaje de IVA"]').value) || 0;
        const descuento = parseFloat(row.querySelector('input[placeholder="Porcentaje de descuento"]').value) || 0;

        const subtotal = cantidad * precioUnitario;
        const ivaAmount = subtotal * (iva / 100);
        const descAmount = subtotal * (descuento / 100);
        const total = subtotal + ivaAmount - descAmount;

        row.querySelector('.product-total').value = total.toFixed(2);
    };

    const addProductRow = () => {
        const newRow = document.createElement('tr');
        newRow.classList.add('product-row');
        newRow.innerHTML = `
            <td><input type="text" placeholder="Código del producto" required></td>
            <td><input type="text" placeholder="Descripción del producto" required></td>
            <td><input type="number" placeholder="Cantidad" required></td>
            <td><input type="number" placeholder="Precio por unidad" required></td>
            <td><input type="number" placeholder="Porcentaje de IVA" required></td>
            <td><input type="number" placeholder="Porcentaje de descuento"></td>
            <td><input type="number" class="product-total" readonly></td>
            <td><button type="button" class="removeBtn">Eliminar</button></td>
        `;
        productTable.querySelector('tbody').appendChild(newRow);

        newRow.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => calculateRowTotal(newRow));
        });

        newRow.querySelector('.removeBtn').addEventListener('click', () => {
            newRow.remove();
        });
    };

    addProductBtn.addEventListener('click', addProductRow);

    document.querySelectorAll('.product-row').forEach(row => {
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => calculateRowTotal(row));
        });
    });

    window.addEventListener('load', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        document.getElementById('fechaEmision').value = currentDateTime;
    });

    function genPDF() {
        const today = new Date();
        const autGeneracion = Math.floor(Math.random() * today.getMilliseconds());
        const vigInit = today.toISOString().split('T')[0];
        const vigFinal = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()).toISOString().split('T')[0];

        const nombreCliente = document.querySelector('.first input[placeholder="Nombre del cliente"]').value;
        const nitRut = document.querySelector('#NIT\\/RUT input').value;
        const direccion = document.querySelector('input[placeholder="Dirección del cliente"]').value;
        const ciudad = document.querySelector('input[placeholder="Ciudad del cliente"]').value;
        const telefono = document.querySelector('#Teléfono input').value;
        const formaPago = document.querySelector('select').value;
        const fechaEmision = document.getElementById('fechaEmision').value;

        const productos = [];
        document.querySelectorAll('.product-row').forEach(row => {
            const descripcion = row.querySelector('input[placeholder="Descripción del producto"]').value;
            const cantidad = row.querySelector('input[placeholder="Cantidad"]').value;
            const precioUnitario = row.querySelector('input[placeholder="Precio por unidad"]').value;
            const iva = row.querySelector('input[placeholder="Porcentaje de IVA"]').value;
            const descuento = row.querySelector('input[placeholder="Porcentaje de descuento"]').value;
            const total = row.querySelector('.product-total').value;
            productos.push({ descripcion, cantidad, precioUnitario, iva, descuento, total });
        });

        const htmlToPDF = genFactura({
            autGeneracion,
            vigInit,
            vigFinal,
            nombreCliente,
            nitRut,
            direccion,
            ciudad,
            telefono,
            formaPago,
            fechaEmision,
            horaFactura: today.toLocaleTimeString('es-CO', { hour12: false }),
            productos
        });

        document.body.innerHTML = htmlToPDF;
    }

    function genFactura({
        autGeneracion,
        vigInit,
        vigFinal,
        nombreCliente,
        nitRut,
        direccion,
        ciudad,
        telefono,
        formaPago,
        fechaEmision,
        horaFactura,
        productos
    }) {

        const totals = productos.reduce((acc, producto) => {
            const subtotal = producto.cantidad * producto.precioUnitario;
            const ivaAmount = subtotal * (producto.iva / 100);
            const descAmount = subtotal * (producto.descuento / 100);
            return {
                valorBruto: acc.valorBruto + subtotal,
                iva: acc.iva + ivaAmount,
                descuento: acc.descuento + descAmount,
                subtotal: acc.subtotal + subtotal,
                total: acc.total + Number(producto.total)
            };
        }, { valorBruto: 0, iva: 0, descuento: 0, subtotal: 0, total: 0 });

        const productRows = productos.map(producto => `
            <tr>
                <td>${producto.descripcion}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precioUnitario}</td>
                <td>${producto.iva}%</td>
                <td>$${Number(producto.total).toLocaleString('es-CO')}</td>
            </tr>
        `).join('');

        const valorEnLetras = numeroALetras(totals.total);

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Factura Electrónica</title>
        <style>
        /* Forzar orientación portrait para impresión */
        @page {
            size: A4 portrait;
            margin: 20mm;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f8;
            margin: 20px;
            color: #333;
        }
        h2, h1 {
            font-weight: 600;
            margin: 0;
            color: #1a1a1a;
        }
        p {
            margin: 5px 0;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #0078d7;
            color: #fff;
            font-weight: 600;
        }
        .notes-table {
            margin-top: 15px;
        }
        .signature {
            margin-top: 20px;
            word-wrap: break-word;
        }
        #bar { 
            display: flex; 
            justify-content: flex-end; 
            align-items: center; 
            padding: 10px; 
            background-color:rgb(238, 242, 245); 
            margin-bottom: 20px; 
            border-radius: 4px;
            position: absolute; /* Añadir esta línea */
            top: 10px; /* Ajustar según sea necesario */
            right: 10px; /* Ajustar según sea necesario */
        }
        #bar button {
            background-color: #fff;
            color: #0078d7;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            margin-left: 10px;
        }
        #bar button:hover {
            background-color: #e6e6e6;
        }
        /* Estilos para pantallas en orientación vertical */
        @media (orientation: portrait) {
            #bar {
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
            }
            img {
            height: 60px;
            margin: 0 auto;
            display: block;
            }
            .signature {
            flex-direction: column;
            align-items: center;
            }
            body {
            font-size: 14px;
            }
        }
        /* Ocultar los botones durante la impresión */
        @media print {
            #bar {
                display: none;
            }
        }
        </style>
    </head>
    <body>
        <div id="bar">
        <button onclick="window.print()">Imprimir</button>
        <button onclick="location.reload()">Volver</button>
        </div>
        <div id="bill">
        <div style="position: relative;">
            <img src="./images/logo.jpeg" alt="Logo" style="position: absolute; left: 0; height: 50px;">
            <h2 style="text-align: center; margin: 0;"> GLASS MACHINE S.A.S</h2>
        </div>
        <div style="text-align: center;">
            <p style="margin: 0;">CL 147 # 58 C – 95<br>
            NIT: 901.230.065-2</p>
            <p style="margin: 0; font-size: 11px;">
            Autorización Numeración de Facturación No. ${autGeneracion} <br>
            Rango desde: FEV10001 hasta: FEV30000<br>
            Vigencia desde:${vigInit} hasta: ${vigFinal}
            <br>Responsables del impuesto sobre las ventas IVA</br>
            </p>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div style="text-align: left;">
            <p>
                <strong>NOMBRE CLIENTE:</strong> ${nombreCliente}<br>
                <strong>NIT/Rut:</strong> ${nitRut} <br>
                <strong>DIRECCION:</strong ${direccion}><br>
                <strong>CIUDAD:</strong> ${ciudad} <br>
                <strong>TELEFONO:</strong> ${telefono}<br>
                <strong>FORMA DE PAGO:</strong> ${formaPago} <br>
            </p>
            </div>
            <div style="text-align: right;">
            <p>
                <strong>Fecha de emisión:</strong>${fechaEmision} <br>
                <strong>Hora factura:</strong> ${horaFactura}
            </p>
            </div>
        </div>
        <table>
            <thead>
            <tr>

                <th>DESCRIPCION</th>
                <th>CANT</th>
                <th>COSTO UNITARIO</th>
                <th>IVA</th>
                <th>COSTO TOTAL</th>
            </tr>
            </thead>
            <tbody>
            ${productRows}
            </tbody>
        </table>
        <table class="notes-table">
            <tr>
            <td style="vertical-align: top;">
                <strong>Notas: </strong>
            </td>
            <td>
                <div style="margin-bottom: 4px;"><span>VALOR BRUTO:</span> ${totals.valorBruto.toLocaleString('es-CO')}</div>
                <div style="margin-bottom: 4px;"><span>DESCUENTO:</span> ${totals.descuento.toLocaleString('es-CO')}</div>
                <div style="margin-bottom: 4px;"><span>SUBTOTAL:</span> ${totals.subtotal.toLocaleString('es-CO')}</div>
                <div style="margin-bottom: 4px;"><span>IVA:</span> ${totals.iva.toLocaleString('es-CO')}</div>
                <div><span>TOTAL A PAGAR:</span> ${totals.total.toLocaleString('es-CO')}</div>
            </td>
            </tr>
        </table>
        <table>
            <tr>
            <td>
                <strong>VALOR EN LETRAS:</strong> ${valorEnLetras.toUpperCase()} PESOS 
            </td>
            </tr>
        </table>
        <div style="display: flex; justify-content: space-around; margin-top: 80px;">
            <div style="text-align: center; width: 30%;">
            <div style="border-top: 1px solid #000; margin-bottom: 5px;"></div>
            <p>Manifestamos que ACEPTAMOS ESTA FACTURA</p>
            </div>
            <div style="text-align: center; width: 30%;">
            <div style="border-top: 1px solid #000; margin-bottom: 5px;"></div>
            <p>Recibo la factura</p>
            </div>
            <div style="text-align: center; width: 30%;">
            <div style="border-top: 1px solid #000; margin-bottom: 5px;"></div>
            <p>Emisor</p>
            </div>
        </div>
        <div class="signature" style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
            <p><strong>FECHA:</strong> </p>
            <p><strong>Factura generada por software</strong></p>
        </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script>
        window.onload = function() {
            const element = document.body;
            html2pdf().from(element).save('factura.pdf').then(() => {
            location.reload();
            });
        };
        </script>
    </body>
    </html>`;

        return htmlContent;
    }

    function numeroALetras(num) {
        num = Math.floor(num); // Redondear hacia abajo
        if (num === 0) return "cero";
        if (num > 50000000) return "Número demasiado grande";
    
        const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
        const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
        const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
        const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
    
        function convertirMenorMil(n) {
            if (n === 0) return "";
            if (n < 10) return unidades[n];
            if (n < 20) return especiales[n - 10];
            if (n < 100) return decenas[Math.floor(n / 10)] + (n % 10 !== 0 ? " y " + unidades[n % 10] : "");
            if (n === 100) return "cien";
            return centenas[Math.floor(n / 100)] + (n % 100 !== 0 ? " " + convertirMenorMil(n % 100) : "");
        }
    
        let resultado = "";
        let millones = Math.floor(num / 1000000);
        let restoMillones = num % 1000000;
        let miles = Math.floor(restoMillones / 1000);
        let restoMiles = restoMillones % 1000;
    
        if (millones > 0) {
            resultado += (millones === 1 ? "un millón" : convertirMenorMil(millones) + " millones") + " ";
        }
        if (miles > 0) {
            resultado += (miles === 1 ? "mil" : convertirMenorMil(miles) + " mil") + " ";
        }
        if (restoMiles > 0) {
            resultado += convertirMenorMil(restoMiles) + " ";
        }
    
        return resultado.trim();
    }
    
});

