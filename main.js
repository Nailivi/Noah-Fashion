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

    // 8. Finalizar compra (Simulación)
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('El carrito está vacío.');
            } else {
                alert('¡Gracias por tu compra! Tu pedido ha sido procesado con éxito.');
                carrito = [];
                actualizarCarritoUI();
                modalCarrito.style.display = 'none';
            }
        });
    }

    // Carga inicial al abrir la página
    actualizarCarritoUI();
});