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
