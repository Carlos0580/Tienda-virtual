// ShopMaster SPA Logic Controller
// Developed for Ing. Juancito Peña's course in IA and Systems
// Author: Antigravity AI Code Assistant

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // State management & global variables
    // -------------------------------------------------------------
    let products = [];
    let cart = JSON.parse(localStorage.getItem("shopmaster_cart")) || [];
    let currentSelectedProduct = null;

    // API URL
    const API_URL = "https://fakestoreapi.com/products";

    // Bootstrap Modal & Offcanvas Instances
    let productDetailModal = null;
    let paymentModal = null;
    let successModal = null;
    let profileModal = null;
    let cartOffcanvas = null;

    // Initialize elements
    const productsContainer = document.getElementById("products-container");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartCountBadge = document.getElementById("cart-count-badge");
    const cartTotalAmount = document.getElementById("cart-total-amount");
    const checkoutBtn = document.getElementById("checkout-btn");
    const toastContainer = document.getElementById("toast-container");

    // Initialize Bootstrap components
    try {
        productDetailModal = new bootstrap.Modal(document.getElementById("productDetailModal"));
        paymentModal = new bootstrap.Modal(document.getElementById("paymentModal"));
        successModal = new bootstrap.Modal(document.getElementById("successModal"));
        profileModal = new bootstrap.Modal(document.getElementById("profileModal"));
        cartOffcanvas = new bootstrap.Offcanvas(document.getElementById("cartOffcanvas"));
    } catch (e) {
        console.error("Bootstrap initialization error", e);
    }

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // -------------------------------------------------------------
    // Fetch and Render Products
    // -------------------------------------------------------------
    async function fetchProducts() {
        showSkeletonLoader();
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Error en la conexión a la API");
            products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
            showErrorMessage();
        }
    }

    function showSkeletonLoader() {
        productsContainer.innerHTML = "";
        for (let i = 0; i < 8; i++) {
            productsContainer.innerHTML += `
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <div class="shimmer-card">
                        <div class="shimmer w-100 mb-3" style="height: 180px; border-radius: 0.5rem;"></div>
                        <div class="shimmer w-75 mb-2" style="height: 20px;"></div>
                        <div class="shimmer w-50 mb-4" style="height: 15px;"></div>
                        <div class="shimmer w-100" style="height: 38px; border-radius: 0.5rem;"></div>
                    </div>
                </div>
            `;
        }
    }

    function showErrorMessage() {
        productsContainer.innerHTML = `
            <div class="col-12 text-center my-5 py-5">
                <i class="fa-solid fa-triangle-exclamation text-danger mb-3" style="font-size: 3rem;"></i>
                <h3>No se pudieron cargar los productos</h3>
                <p class="text-muted">Por favor, revisa tu conexión a internet o intenta de nuevo más tarde.</p>
                <button class="btn btn-primary-custom mt-3" id="retry-btn">
                    <i class="fa-solid fa-rotate-right me-2"></i>Reintentar
                </button>
            </div>
        `;
        document.getElementById("retry-btn")?.addEventListener("click", fetchProducts);
    }

    function renderProducts(productList) {
        productsContainer.innerHTML = "";
        if (productList.length === 0) {
            productsContainer.innerHTML = `<div class="col-12 text-center"><p class="text-muted">No se encontraron productos.</p></div>`;
            return;
        }

        productList.forEach(product => {
            const productCol = document.createElement("div");
            productCol.className = "col-12 col-md-6 col-lg-3 mb-4";
            productCol.innerHTML = `
                <div class="card product-card">
                    <span class="category-badge">${product.category}</span>
                    <div class="product-img-wrapper">
                        <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
                    </div>
                    <div class="product-body">
                        <h5 class="product-title" title="${product.title}">${product.title}</h5>
                        <p class="product-desc">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="price-tag">$${product.price.toFixed(2)}</span>
                            <button class="btn btn-outline-custom view-more-btn" data-id="${product.id}">
                                <i class="fa-solid fa-eye me-1"></i> Ver más
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productCol);
        });

        // Add events to "Ver más" buttons
        document.querySelectorAll(".view-more-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.getAttribute("data-id"));
                openProductDetails(productId);
            });
        });
    }

    // -------------------------------------------------------------
    // Product Details Modal Logic
    // -------------------------------------------------------------
    function openProductDetails(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        currentSelectedProduct = product;

        document.getElementById("modal-product-title").innerText = product.title;
        document.getElementById("modal-product-img").src = product.image;
        document.getElementById("modal-product-img").alt = product.title;
        document.getElementById("modal-product-category").innerHTML = `<i class="fa-solid fa-tag me-2 text-primary"></i>Categoría: <strong>${product.category}</strong>`;
        document.getElementById("modal-product-price").innerText = `$${product.price.toFixed(2)}`;
        document.getElementById("modal-product-description").innerText = product.description;
        document.getElementById("modal-qty-select").value = "1";

        productDetailModal.show();
    }

    // Quantity selector in detail modal
    document.getElementById("modal-qty-minus").addEventListener("click", () => {
        const qtySelect = document.getElementById("modal-qty-select");
        let val = parseInt(qtySelect.value);
        if (val > 1) qtySelect.value = val - 1;
    });

    document.getElementById("modal-qty-plus").addEventListener("click", () => {
        const qtySelect = document.getElementById("modal-qty-select");
        let val = parseInt(qtySelect.value);
        qtySelect.value = val + 1;
    });

    // Add to cart from modal
    document.getElementById("modal-add-to-cart-btn").addEventListener("click", () => {
        if (!currentSelectedProduct) return;

        const qty = parseInt(document.getElementById("modal-qty-select").value);
        addToCart(currentSelectedProduct, qty);
        productDetailModal.hide();
    });

    // -------------------------------------------------------------
    // Shopping Cart Operations
    // -------------------------------------------------------------
    function addToCart(product, quantity = 1) {
        const existingItem = cart.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                product: product,
                quantity: quantity
            });
        }

        updateCart();
        showToast(`🛍️ ${product.title.substring(0, 20)}... agregado al carrito.`);
        
        // Trigger bounce animation on floating button
        const floatBtn = document.getElementById("floating-cart-trigger");
        floatBtn.classList.add("cart-bounce");
        setTimeout(() => {
            floatBtn.classList.remove("cart-bounce");
        }, 400);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.product.id !== productId);
        updateCart();
        showToast("🗑️ Producto eliminado del carrito.");
    }

    function changeQuantity(productId, delta) {
        const item = cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCart();
            }
        }
    }

    function updateCart() {
        localStorage.setItem("shopmaster_cart", JSON.stringify(cart));
        renderCartItems();
        calculateCartTotals();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="fa-solid fa-cart-shopping text-muted mb-3" style="font-size: 2.5rem; opacity: 0.5;"></i>
                    <p class="text-muted">Tu carrito está vacío</p>
                </div>
            `;
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;

        cart.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title" title="${item.product.title}">${item.product.title}</div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="cart-item-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
                        <div class="qty-control">
                            <button class="qty-btn dec-qty-btn" data-id="${item.product.id}">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn inc-qty-btn" data-id="${item.product.id}">+</button>
                        </div>
                    </div>
                </div>
                <button class="btn btn-link text-danger remove-item-btn ms-2" data-id="${item.product.id}" title="Eliminar artículo">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        // Add events to quantity buttons
        document.querySelectorAll(".dec-qty-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.getAttribute("data-id"));
                changeQuantity(id, -1);
            });
        });

        document.querySelectorAll(".inc-qty-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.getAttribute("data-id"));
                changeQuantity(id, 1);
            });
        });

        // Add events to delete buttons
        document.querySelectorAll(".remove-item-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.getAttribute("data-id"));
                removeFromCart(id);
            });
        });
    }

    function calculateCartTotals() {
        let totalItems = 0;
        let totalSum = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalSum += item.product.price * item.quantity;
        });

        cartCountBadge.innerText = totalItems;
        cartTotalAmount.innerText = `$${totalSum.toFixed(2)}`;

        // Show/hide floating badge
        if (totalItems > 0) {
            cartCountBadge.style.display = "flex";
        } else {
            cartCountBadge.style.display = "none";
        }
    }

    // -------------------------------------------------------------
    // Payment Gateway Simulation
    // -------------------------------------------------------------
    checkoutBtn.addEventListener("click", () => {
        cartOffcanvas.hide();
        // Set payment amount display
        document.getElementById("payment-amount").innerText = cartTotalAmount.innerText;
        // Open payment modal
        paymentModal.show();
    });

    // Payment Form Formatting and Inputs
    const cardNameInput = document.getElementById("card-name");
    const cardNumberInput = document.getElementById("card-number");
    const cardExpiryInput = document.getElementById("card-expiry");
    const cardCvvInput = document.getElementById("card-cvv");
    const paymentForm = document.getElementById("payment-form");

    // Format card number with spaces (#### #### #### ####)
    cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = "";
        for (let i = 0; i < value.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += " ";
            }
            formatted += value[i];
        }
        e.target.value = formatted;

        // Sync with virtual card mockup
        document.getElementById("vcard-number").innerText = formatted || "•••• •••• •••• ••••";
    });

    // Format Expiry (MM/YY)
    cardExpiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/[^0-9]/gi, '');
        if (value.length > 2) {
            e.target.value = value.substring(0, 2) + "/" + value.substring(2, 4);
        } else {
            e.target.value = value;
        }

        // Sync with virtual card mockup
        document.getElementById("vcard-expiry").innerText = e.target.value || "MM/YY";
    });

    // Sync cardholder name with virtual card mockup
    cardNameInput.addEventListener("input", (e) => {
        document.getElementById("vcard-holder").innerText = e.target.value.toUpperCase() || "NOMBRE COMPLET0";
    });

    // Limit CVV to 3 digits
    cardCvvInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/gi, '').substring(0, 3);
    });

    // Form submission validation
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Perform validation
        const nameVal = cardNameInput.value.trim();
        const numVal = cardNumberInput.value.replace(/\s+/g, '');
        const expiryVal = cardExpiryInput.value;
        const cvvVal = cardCvvInput.value;

        let isValid = true;

        if (nameVal.length < 3) {
            showInputError(cardNameInput, "Ingresa tu nombre completo.");
            isValid = false;
        } else {
            clearInputError(cardNameInput);
        }

        if (numVal.length !== 16) {
            showInputError(cardNumberInput, "El número de tarjeta debe tener 16 dígitos.");
            isValid = false;
        } else {
            clearInputError(cardNumberInput);
        }

        // Validate MM/YY
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(expiryVal)) {
            showInputError(cardExpiryInput, "Formato MM/YY incorrecto.");
            isValid = false;
        } else {
            // Check expiry date is in future
            const parts = expiryVal.split("/");
            const expiryMonth = parseInt(parts[0], 10);
            const expiryYear = parseInt("20" + parts[1], 10);
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();

            if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                showInputError(cardExpiryInput, "La tarjeta está vencida.");
                isValid = false;
            } else {
                clearInputError(cardExpiryInput);
            }
        }

        if (cvvVal.length !== 3) {
            showInputError(cardCvvInput, "El CVV debe tener 3 dígitos.");
            isValid = false;
        } else {
            clearInputError(cardCvvInput);
        }

        if (!isValid) return;

        // Payment approved simulation
        processPayment(nameVal);
    });

    function showInputError(input, message) {
        input.classList.add("is-invalid");
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.innerText = message;
        }
    }

    function clearInputError(input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    }

    function processPayment(customerName) {
        // Show loading spinner on payment button
        const submitBtn = paymentForm.querySelector("button[type='submit']");
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando pago...`;

        setTimeout(() => {
            // Success workflow
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;

            // Generate receipt variables
            const finalReceiptData = {
                clientName: customerName,
                date: new Date().toLocaleString(),
                ticketNumber: "TK-" + Math.floor(100000 + Math.random() * 900000),
                items: [...cart],
                total: parseFloat(cartTotalAmount.innerText.replace("$", ""))
            };

            // Save receipt info in global variable for PDF generation
            window.latestReceipt = finalReceiptData;

            // Clear Cart
            cart = [];
            updateCart();

            // Reset form
            paymentForm.reset();
            cardNameInput.classList.remove("is-valid", "is-invalid");
            cardNumberInput.classList.remove("is-valid", "is-invalid");
            cardExpiryInput.classList.remove("is-valid", "is-invalid");
            cardCvvInput.classList.remove("is-valid", "is-invalid");
            document.getElementById("vcard-number").innerText = "•••• •••• •••• ••••";
            document.getElementById("vcard-expiry").innerText = "MM/YY";
            document.getElementById("vcard-holder").innerText = "NOMBRE COMPLETO";

            // Toggle modals
            paymentModal.hide();
            successModal.show();

            showToast("✅ ¡Pago procesado con éxito!");
        }, 2000);
    }

    // -------------------------------------------------------------
    // PDF Thermal Receipt Generation
    // -------------------------------------------------------------
    document.getElementById("download-ticket-btn").addEventListener("click", () => {
        generatePDFReceipt(window.latestReceipt);
    });

    function generatePDFReceipt(data) {
        if (!data) {
            showToast("❌ Error al generar el ticket.");
            return;
        }

        const { jsPDF } = window.jspdf;
        
        // Settings for 80mm thermal paper
        // 80mm = ~226pt width. We can set page width directly in mm.
        const paperWidth = 80;
        
        // Calculate page height dynamically based on items
        // Header ~ 40mm, items ~ 7mm each, footer ~ 40mm
        const headerHeight = 45;
        const itemsHeight = data.items.length * 8;
        const footerHeight = 45;
        const paperHeight = headerHeight + itemsHeight + footerHeight;

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [paperWidth, paperHeight]
        });

        // Set monospace courier font
        doc.setFont('courier', 'normal');
        doc.setFontSize(8);

        let y = 10;
        const margin = 5;
        const contentWidth = paperWidth - (margin * 2); // 70mm

        // Center helper function
        const centerText = (text, posY) => {
            const textWidth = doc.getTextWidth(text);
            const posX = (paperWidth - textWidth) / 2;
            doc.text(text, posX, posY);
        };

        // Header
        doc.setFont('courier', 'bold');
        doc.setFontSize(11);
        centerText("SHOPMASTER STORE", y);
        y += 4;
        
        doc.setFontSize(8);
        centerText("RIF: J-99887766-5", y);
        y += 4;
        centerText("Av. Universitaria #456", y);
        y += 4;
        centerText("Santo Domingo, RD", y);
        y += 5;

        // Divider
        doc.setFont('courier', 'normal');
        doc.text("------------------------------------------", margin, y);
        y += 4;

        // Ticket Details
        doc.text(`TICKET:   ${data.ticketNumber}`, margin, y);
        y += 4;
        doc.text(`FECHA:    ${data.date}`, margin, y);
        y += 4;
        doc.text(`CLIENTE:  ${data.clientName.toUpperCase().substring(0, 25)}`, margin, y);
        y += 5;

        // Divider
        doc.text("------------------------------------------", margin, y);
        y += 4;

        // Columns headers
        doc.setFont('courier', 'bold');
        doc.text("CANT  PRODUCTO                    TOTAL", margin, y);
        y += 4;
        doc.text("------------------------------------------", margin, y);
        y += 4;

        // Items List
        doc.setFont('courier', 'normal');
        data.items.forEach(item => {
            const qty = item.quantity.toString().padEnd(5, ' ');
            const priceVal = (item.product.price * item.quantity).toFixed(2);
            
            // Format product title to fit (max 20 chars)
            let title = item.product.title;
            if (title.length > 20) {
                title = title.substring(0, 17) + "...";
            }
            title = title.padEnd(21, ' ');

            const line = `${qty}${title} $${priceVal.padStart(8, ' ')}`;
            doc.text(line, margin, y);
            y += 6;
        });

        // Divider
        doc.text("------------------------------------------", margin, y);
        y += 4;

        // Subtotal & Total
        const subtotalVal = (data.total * 0.82).toFixed(2);
        const itbisVal = (data.total * 0.18).toFixed(2);
        const totalVal = data.total.toFixed(2);

        doc.text(`SUBTOTAL:               $${subtotalVal.padStart(10, ' ')}`, margin, y);
        y += 4;
        doc.text(`ITBIS (18%):            $${itbisVal.padStart(10, ' ')}`, margin, y);
        y += 4;
        
        doc.setFont('courier', 'bold');
        doc.setFontSize(9);
        doc.text(`TOTAL A PAGAR:          $${totalVal.padStart(10, ' ')}`, margin, y);
        y += 6;

        // Footer message
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        centerText("¡Gracias por su compra!", y);
        y += 4;
        centerText("Para devoluciones, presente este ticket.", y);
        y += 4;
        centerText("Soporte: info@shopmaster.com", y);
        y += 4;
        doc.setFont('courier', 'italic');
        centerText("Desarrollado con IA por Juancito Pena", y);

        // Save file
        doc.save(`Ticket_${data.ticketNumber}.pdf`);
        showToast("📥 Ticket descargado en PDF.");
    }

    // -------------------------------------------------------------
    // Global Toast Messages
    // -------------------------------------------------------------
    function showToast(message) {
        const toastId = "toast-" + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-dark border-0 mb-2 shadow" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML("beforeend", toastHtml);
        const toastElement = document.getElementById(toastId);
        
        try {
            const bsToast = new bootstrap.Toast(toastElement);
            bsToast.show();
            
            // Remove from DOM after hide
            toastElement.addEventListener("hidden.bs.toast", () => {
                toastElement.remove();
            });
        } catch (e) {
            console.error("Toast component error", e);
        }
    }

    // Start Application
    fetchProducts();
    updateCart();
});
