function genPDF() {
        const today = new Date();
        const autGeneracion = Math.floor(Math.random() * today.getMilliseconds());
        const vigInit = today.toISOString().split('T')[0];
        const vigFinal = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()).toISOString().split('T')[0];
        const nombreCliente = document.getElementById('NombreCliente').value;
        const cedula = document.getElementById('Cedula').value;
        const direccion = document.getElementById('Direccion').value;
        const ciudad = document.getElementById('Ciudad').value;
        const telefono = document.getElementById('Telefono').value;
        const formaPago = document.getElementById('FormaPago').value;
        const medioPago = document.getElementById('MedioPago').value;
        const fechaEmision = vigInit
        const horaFactura = today.toLocaleTimeString('es-CO', { hour12: false });
        const codigo = document.getElementById('Codigo').value;
        const descripcion = document.getElementById('Descripcion').value;
        const bod = document.getElementById('BOD').value;
        const cantidad = document.getElementById('Cantidad').value;
        const costoUnitario = document.getElementById('CostoUnitario').value;
        const ivaRate = document.getElementById('IVA').value;
        const costoTotal = document.getElementById('CostoTotal').value;
        const notaNumber = document.getElementById('notaNumber').value;
        const valorBruto = document.getElementById('valorBruto').value;
        const descuento = document.getElementById('descuento').value;
        const subtotal = document.getElementById('subtotal').value;
        const iva = document.getElementById('iva').value;
        const retenciones = document.getElementById('retenciones').value;
        const totalPagar = document.getElementById('totalPagar').value;
        const valorEnLetras = document.getElementById('valorEnLetras').value;
        const fechaEmisionFirma = vigInit;
        const htmlToPDF = genFactura({
                        autGeneracion,
                        vigInit,
                        vigFinal,
                        NombreCliente: nombreCliente,
                        Cedula: cedula,
                        Direccion: direccion,
                        Ciudad: ciudad,
                        Telefono: telefono,
                        FormaPago: formaPago,
                        MedioPago: medioPago,
                        FechaEmision: fechaEmision,
                        HoraFactura: horaFactura,
                        Codigo: codigo,
                        Descripcion: descripcion,
                        BOD: bod,
                        Cantidad: cantidad,
                        CostoUnitario: costoUnitario,
                        IVA: ivaRate,
                        CostoTotal: costoTotal,
                        notaNumber: notaNumber,
                        valorBruto: valorBruto,
                        descuento: descuento,
                        subtotal: subtotal,
                        iva: iva,
                        retenciones: retenciones,
                        totalPagar: totalPagar,
                        valorEnLetras: valorEnLetras,
                        fechaEmision: fechaEmisionFirma
                });
        document.body.innerHTML = htmlToPDF;
}

function printFinally() {

        const element = document.getElementById('bill');
        console.log(element);
        html2pdf().from(element).save();
    
}

function genFactura({
    autGeneracion,
    vigInit,
    vigFinal,
    NombreCliente,
    Cedula,
    Direccion,
    Ciudad,
    Telefono,
    FormaPago,
    MedioPago,
    FechaEmision,
    HoraFactura,
    Codigo,
    Descripcion,
    BOD,
    Cantidad,
    CostoUnitario,
    IVA,
    CostoTotal,
    notaNumber,
    valorBruto,
    descuento,
    subtotal,
    iva,
    retenciones,
    totalPagar,
    valorEnLetras,
    fechaEmision // variable usada en la firma (puede ser la misma que FechaEmision o distinta)
}) {
    return `<!DOCTYPE html>
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
                Autorización Numeración de Facturación No. ${autGeneracion}<br>
                Rango desde: FEV10001 hasta: FEV30000<br>
                Vigencia desde: ${vigInit} hasta: ${vigFinal} - 24 Meses
                <br>Responsables del impuesto sobre las ventas IVA</br>
            </p>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div style="text-align: left;">
                <p>
                    <strong>NOMBRE CLIENTE:</strong> ${NombreCliente}<br>
                    <strong>CEDULA DE CIUDADANIA:</strong> ${Cedula}<br>
                    <strong>DIRECCION:</strong> ${Direccion}<br>
                    <strong>CIUDAD:</strong> ${Ciudad}<br>
                    <strong>TELEFONO:</strong> ${Telefono}<br>
                    <strong>FORMA DE PAGO:</strong> ${FormaPago}<br>
                    <strong>MEDIO DE PAGO:</strong> ${MedioPago}
                </p>
            </div>
            <div style="text-align: right;">
                <p>
                    <strong>Fecha de emisión:</strong> ${FechaEmision}<br>
                    <strong>Hora factura:</strong> ${HoraFactura}
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
                    <td>${Codigo}</td>
                    <td>${Descripcion}</td>
                    <td>${BOD}</td>
                    <td>${Cantidad}</td>
                    <td>${CostoUnitario}</td>
                    <td>${IVA}</td>
                    <td>${CostoTotal}</td>
                </tr>
            </tbody>
        </table>
        <table class="notes-table">
            <tr>
                <td style="vertical-align: top;">
                    <strong>Notas: ${notaNumber}</strong>
                </td>
                <td>
                    <div style="margin-bottom: 4px;"><span>VALOR BRUTO:</span> ${valorBruto}</div>
                    <div style="margin-bottom: 4px;"><span>DESCUENTO:</span> ${descuento}</div>
                    <div style="margin-bottom: 4px;"><span>SUBTOTAL:</span> ${subtotal}</div>
                    <div style="margin-bottom: 4px;"><span>IVA:</span> ${iva}</div>
                    <div style="margin-bottom: 4px;"><span>RETENCIONES:</span> ${retenciones}</div>
                    <div><span>TOTAL A PAGAR:</span> ${totalPagar}</div>
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <td>
                    <strong>VALOR EN LETRAS:</strong> ${valorEnLetras} M/CTE
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
            <p><strong>FECHA:</strong> ${fechaEmision}</p>
            <p><strong>Factura generada por software</strong></p>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="./script.js"></script>
</body>
</html>`;
}

