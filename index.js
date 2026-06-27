// Inicializar Tooltips de Bootstrap para las descripciones breves al pasar el cursor
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Lógica del Selector de Color e Intercambio de Imágenes
const mainImg = document.getElementById('mainProductImg');
const modalImg = document.getElementById('modalProductImg');
const colorDots = document.querySelectorAll('.color-dot');

colorDots.forEach(dot => {
    dot.addEventListener('click', function() {
        // Remover clase activa de todos los puntos de color
        colorDots.forEach(d => d.classList.remove('active'));
        
        // Añadir clase activa al punto seleccionado
        this.classList.add('active');
        
        // Obtener el color seleccionado del atributo data-color
        const color = this.getAttribute('data-color');
        let newSrc = "";

        // CORREGIDO: Todas las rutas apuntan ahora de manera exacta a archivos .jpg reales
        if (color === "blanco") {
            newSrc = "img/Jordan blanco con gris.jpg";
        } else if (color === "negro") {
            newSrc = "img/Jordan negro.jpg";
        } else if (color === "amarillo") {
            newSrc = "img/Jordan dorado con blanco.jpg";
        } else if (color === "rojo") {
            newSrc = "img/Jordan rojo con negro.jpg";
        }
        
        // Cambiar la imagen de la card principal y del modal dinámicamente
        if (newSrc !== "") {
            mainImg.src = newSrc;
            if (modalImg) {
                modalImg.src = newSrc;
            }
        }
    });
});