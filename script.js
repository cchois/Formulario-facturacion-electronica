const form = document.querySelector("form"),
      nextBtn = form.querySelector(".nextBtn"),
      backBtn = form.querySelector(".backBtn"),
      firstFormInputs = form.querySelectorAll(".form.first input[required], .form.first select[required]"),
      secondFormInputs = form.querySelectorAll(".form.second input[required], .form.second select[required]"),
      submitBtn = form.querySelector(".submit");

const nitRut = document.querySelector("#NIT\\/RUT input"),
      telefono = document.querySelector("#Teléfono input"),
      email = document.querySelector("#Correo\\ Electrónico input"),
      emaill = document.querySelector("#Correo\\ Electrónicoo input"),
      numeroFactura = document.querySelector("#Número\\ de\\ Factura input");

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
    const telefono = document.querySelector("#Teléfono input");
    if (telefono && (!/^[0-9]+$/.test(telefono.value) || telefono.value.length < 7)) {
        alert("El teléfono debe contener solo números y tener al menos 7 dígitos.");
        telefono.focus();
        event.preventDefault();
        return;
    }

    // Add email validation
    const email = document.querySelector("#Correo\\ Electrónico input");
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

    if (numeroFactura && (!/^[0-9]+$/.test(numeroFactura.value) || parseInt(numeroFactura.value) <= 0)) {
        alert("El número de factura debe ser un número .");
        numeroFactura.focus();
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

        

document.addEventListener('DOMContentLoaded', function() {
    const cantidad = document.querySelector('input[placeholder="Cantidad"]');
    const precioUnitario = document.querySelector('input[placeholder="Precio por unidad"]');
    const iva = document.querySelector('input[placeholder="Porcentaje de IVA"]');
    const descuento = document.querySelector('input[placeholder="Porcentaje de descuento"]');
    const total = document.getElementById('totalAmount');

    function calculateTotal() {
        const cant = parseFloat(cantidad.value) || 0;
        const precio = parseFloat(precioUnitario.value) || 0;
        const ivaValue = parseFloat(iva.value) || 0;
        const descValue = parseFloat(descuento.value) || 0;

        const subtotal = cant * precio;
        const ivaAmount = subtotal * (ivaValue / 100);
        const descAmount = subtotal * (descValue / 100);
        const finalTotal = subtotal + ivaAmount - descAmount;

        total.value = finalTotal.toFixed(2);
        // Force display update
        total.dispatchEvent(new Event('change'));
    }

    [cantidad, precioUnitario, iva, descuento].forEach(input => {
        input.addEventListener('input', calculateTotal);
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
    const descripcion = document.querySelector('input[placeholder="Descripción del producto"]').value;
    const cantidad = document.querySelector('input[placeholder="Cantidad"]').value;
    const precioUnitario = document.querySelector('input[placeholder="Precio por unidad"]').value;
    const iva = document.querySelector('input[placeholder="Porcentaje de IVA"]').value;
    const total = document.getElementById('totalAmount').value;

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
        descripcion,
        cantidad,
        precioUnitario,
        iva,
        total
    });

    document.body.innerHTML = htmlToPDF;
}

function printFinally() {
    const element = document.getElementById('bill');
    html2pdf().from(element).save();
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
    descripcion,
    cantidad,
    precioUnitario,
    iva,
    total
}) {
    return `
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
            justify-content: space-between; 
            align-items: center; 
            padding: 10px; 
            background-color: #0078d7; 
            margin-bottom: 20px; 
            border-radius: 4px;
        }
        #bar button {
            background-color: #fff;
            color: #0078d7;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }
        #bar button:hover {
            background-color: #e6e6e6;
        }
        /* Estilos para pantallas en orientación vertical */
        @media (orientation: portrait) {
            #bar {
                flex-direction: column;
                align-items: stretch;
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
    </style>
</head>
<body>
    <div id="bar">
        <button onclick="window.print()">Imprimir</button>
        <button onclick="location.reload()">Volver</button>
    </div>
    <div id="bill">
        <div style="position: relative;">
            <img src="./images/logo.png" alt="Logo" style="position: absolute; left: 0; height: 80px;">
            <h2 style="text-align: center; margin: 0;">SMART GLASS S.A.S</h2>
        </div>
        <div style="text-align: center;">
            <p style="margin: 0;">CL 147 # 58 C – 95<br>
            NIT: 000.000.000-0</p>
            <p style="margin: 0; font-size: 11px;">
                Autorización Numeración de Facturación No. <br>
                Rango desde: FEV10001 hasta: FEV30000<br>
                Vigencia desde: hasta:  - 24 Meses
                <br>Responsables del impuesto sobre las ventas IVA</br>
            </p>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div style="text-align: left;">
                <p>
                    <strong>NOMBRE CLIENTE:</strong><br>
                    <strong>CEDULA DE CIUDADANIA:</strong> <br>
                    <strong>DIRECCION:</strong><br>
                    <strong>CIUDAD:</strong> <br>
                    <strong>TELEFONO:</strong><br>
                    <strong>FORMA DE PAGO:</strong> <br>
                    <strong>MEDIO DE PAGO:</strong>
                </p>
            </div>
            <div style="text-align: right;">
                <p>
                    <strong>Fecha de emisión:</strong> <br>
                    <strong>Hora factura:</strong> 
                </p>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>CODIGO</th>
                    <th>DESCRIPCION</th>
                    <th>BOD</th>
                    <th>CANT</th>
                    <th>COSTO UNITARIO</th>
                    <th>IVA</th>
                    <th>COSTO TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td</td>
                </tr>
            </tbody>
        </table>
        <table class="notes-table">
            <tr>
                <td style="vertical-align: top;">
                    <strong>Notas: </strong>
                </td>
                <td>
                    <div style="margin-bottom: 4px;"><span>VALOR BRUTO:</span> }</div>
                    <div style="margin-bottom: 4px;"><span>DESCUENTO:</span> </div>
                    <div style="margin-bottom: 4px;"><span>SUBTOTAL:</span> </div>
                    <div style="margin-bottom: 4px;"><span>IVA:</span> </div>
                    <div style="margin-bottom: 4px;"><span>RETENCIONES:</span> </div>
                    <div><span>TOTAL A PAGAR:</span></div>
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <td>
                    <strong>VALOR EN LETRAS:</strong>  M/CTE
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
    <script src="./script.js"></script>
</body>
</html>`;
}
