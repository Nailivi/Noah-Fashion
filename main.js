document.addEventListener('DOMContentLoaded', () => {

    // 1. Cargar carrito guardado en localStorage o iniciar vacío
    let carrito = JSON.parse(localStorage.getItem('carritoModaUrbana')) || [];

    // Selección de elementos del DOM
    const cartButtons = document.querySelectorAll('.cart-btn');
    const modalCarrito = document.getElementById('carrito-modal');
    const cerrarModal = document.getElementById('close-cart');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarritoElement = document.getElementById('total-carrito');
    const btnVaciar = document.getElementById('vaciar-carrito');
    const btnFinalizar = document.getElementById('finalizar-compra');

    // 2. Función para guardar en localStorage y actualizar la pantalla
    function actualizarCarritoUI() {
        // Guardar estado actual
        localStorage.setItem('carritoModaUrbana', JSON.stringify(carrito));

        // Actualizar contador en la cabecera (en todas las páginas)
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        cartButtons.forEach(btn => {
            btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${totalItems})`;
        });

        // Renderizar la lista dentro del modal
        if (listaCarrito) {
            listaCarrito.innerHTML = '';

            if (carrito.length === 0) {
                listaCarrito.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
                if (totalCarritoElement) totalCarritoElement.textContent = '$0';
                return;
            }

            let totalAcumulado = 0;

            carrito.forEach((producto, index) => {
                // Convertir precio texto (ej: "$89.000") a número entero para la suma
                const precioNumerico = parseInt(producto.precio.replace(/[^0-9]/g, '')) || 0;
                totalAcumulado += precioNumerico * producto.cantidad;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${producto.titulo}</strong>
                        <span>${producto.precio} x ${producto.cantidad}</span>
                    </div>
                    <button class="btn-remove" data-index="${index}">&times;</button>
                `;
                listaCarrito.appendChild(itemDiv);
            });

            if (totalCarritoElement) {
                totalCarritoElement.textContent = `$${totalAcumulado.toLocaleString('es-CO')}`;
            }
        }
    }

    // 3. Capturar clics en "Agregar al carrito"
    document.querySelectorAll('.btn-add').forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();

            const tarjeta = e.target.closest('.product-card') || e.target.closest('article');

            if (tarjeta) {
                const titulo = tarjeta.querySelector('h3') ? tarjeta.querySelector('h3').textContent.trim() : 'Producto Moda Urbana';
                const precio = tarjeta.querySelector('.price') ? tarjeta.querySelector('.price').textContent.trim() : '$0';

                // Verificar si el producto ya está en el carrito
                const existe = carrito.find(item => item.titulo === titulo);

                if (existe) {
                    existe.cantidad++;
                } else {
                    carrito.push({
                        titulo: titulo,
                        precio: precio,
                        cantidad: 1
                    });
                }

                actualizarCarritoUI();

                // Notificación amigable
                alert(`¡"${titulo}" agregado al carrito!`);
            }
        });
    });

    // 4. Abrir modal del carrito al hacer clic en el botón de la cabecera
    cartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalCarrito) {
                modalCarrito.style.display = 'flex';
            }
        });
    });

    // 5. Cerrar modal del carrito
    if (cerrarModal) {
        cerrarModal.addEventListener('click', (e) => {
            e.preventDefault();
            modalCarrito.style.display = 'none';
        });
    }

    // 6. Eliminar un producto individual del carrito
    if (listaCarrito) {
        listaCarrito.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove')) {
                const index = e.target.getAttribute('data-index');
                carrito.splice(index, 1);
                actualizarCarritoUI();
            }
        });
    }

    // 7. Vaciar carrito completo
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if (carrito.length > 0 && confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                carrito = [];
                actualizarCarritoUI();
            }
        });
    }
    
    // 8. Finalizar compra e integrar con WhatsApp
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
                return;
        }

        // Configura aquí el número de teléfono de la asesora (con código de país, ej: 57 para Colombia)
        const numeroTelefono = "573203135812"; 

        // Construcción del mensaje de texto
        let mensaje = "¡Hola! Quisiera concretar la compra de los siguientes productos de la tienda Noah Fashion:\n\n";
        let totalAcumulado = 0;

        carrito.forEach((producto, index) => {
            const precioNumerico = parseInt(producto.precio.replace(/[^0-9]/g, '')) || 0;
            const subtotal = precioNumerico * producto.cantidad;
            totalAcumulado += subtotal;

            mensaje += `${index + 1}. *${producto.titulo}*\n`;
            mensaje += `   - Cantidad: ${producto.cantidad}\n`;
            mensaje += `   - Precio unitario: ${producto.precio}\n\n`;
        });

        mensaje += `*Total estimado:* $${totalAcumulado.toLocaleString('es-CO')}\n\n`;
        mensaje += "Quedo atento/a para coordinar el pago y la dirección de envío. ¡Muchas gracias!";

        // Codificar el texto para la URL de WhatsApp (convierte espacios y saltos de línea a formato seguro)
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`;

        // Abrir el chat de WhatsApp en una pestaña nueva
        window.open(urlWhatsApp, '_blank');

        // Limpiar el carrito local tras enviar el pedido
        carrito = [];
        actualizarCarritoUI();
        modalCarrito.style.display = 'none';
    });
}

    // Carga inicial al abrir la página
    actualizarCarritoUI();
});

// Abrir y cerrar Modales de Ayuda (Envíos y Tallas)
document.querySelectorAll('.open-help-modal').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        const targetModal = document.getElementById(targetId);
        if (targetModal) {
            targetModal.style.display = 'flex';
        }
    });
});

// Cerrar modales de ayuda al presionar 'X'
document.querySelectorAll('.close-help').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.closest('.search-modal').style.display = 'none';
    });
});