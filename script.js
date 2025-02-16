const form = document.querySelector("form"),
        nextBtn = form.querySelector(".nextBtn"),
        backBtn = form.querySelector(".backBtn"),
        allInput = form.querySelectorAll(".first input");





nextBtn.addEventListener("click", ()=> {
    allInput.forEach(input => {
        if(input.value != ""){
            form.classList.add('secActive');
        }else{
            form.classList.remove('secActive');


        }
    })
})

backBtn.addEventListener("click", () => form.classList.remove('secActive'));



document.addEventListener('DOMContentLoaded', function() {
    const cantidad = document.querySelector('input[placeholder="Cantidad"]');
    const precioUnitario = document.querySelector('input[placeholder="Precio por unidad"]');
    const iva = document.querySelector('input[placeholder="Porcentaje de IVA"]');
    const descuento = document.querySelector('input[placeholder="Porcentaje de descuento"]');
    const total = document.querySelector('input[readonly]');

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
    }

    [cantidad, precioUnitario, iva, descuento].forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
});
