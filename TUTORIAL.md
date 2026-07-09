# Manual de Aprendizaje: Desarrollo Web, Maquetación y Despliegue de una Tienda Virtual (ShopMaster)

Este recurso educativo ha sido diseñado para estudiantes y emprendedores que desean iniciarse en el desarrollo de software y comercio electrónico, guiados por el **Ing. Juancito Peña**. Aquí aprenderás la historia, el código y los pasos exactos para crear y desplegar tu propia tienda en línea.

---

## Sección 1: Fundamentos y Evolución Histórica de la Web

Para entender cómo funciona nuestra tienda virtual, primero debemos comprender las tecnologías que la sostienen. A continuación, se detallan en su orden de aparición histórica:

### 1. HTML (HyperText Markup Language) - 1991
*   **¿Qué es?** Creado por Tim Berners-Lee en 1991, HTML es el lenguaje de marcado estándar que define la estructura y el esqueleto de cualquier página web. Utiliza "etiquetas" para indicar dónde van los textos, las imágenes, los botones y los enlaces.
*   **En este proyecto:** Define los contenedores principales de la tienda, como la barra de navegación, la cabecera, la cuadrícula donde se cargan las tarjetas de los productos, la estructura lateral del carrito y las ventanas emergentes (modales) de pago y confirmación.

### 2. JavaScript (JS) - 1995
*   **¿Qué es?** Creado por Brendan Eich en 1995, JavaScript es el lenguaje de programación que le da interactividad y dinamismo a la web. Permite que la página reaccione a las acciones del usuario, realice cálculos y consulte bases de datos externas.
*   **En este proyecto:** Se encarga de hacer la petición web a la API de productos, agregar o quitar elementos al carrito, calcular subtotales y totales, validar el formulario de pago y llamar a la librería jsPDF para generar el ticket físico.

### 3. CSS (Cascading Style Sheets) - 1996
*   **¿Qué es?** Creado por Håkon Wium Lie en 1996, CSS es el lenguaje encargado del diseño visual y la estética de la página (colores, fuentes, espacios y animaciones). Separa el contenido (HTML) de la presentación visual.
*   **En este proyecto:** Define el look-and-feel premium de la tienda (sombras, gradientes, bordes redondeados y efectos hover al pasar el cursor) y da un diseño tecnológico y limpio al footer.

### 4. Bootstrap - 2011
*   **¿Qué es?** Desarrollado originalmente por ingenieros de Twitter y lanzado en 2011, Bootstrap es el framework CSS más popular del mundo. Proporciona componentes de diseño prefabricados y un sistema de cuadrícula (grid) flexible que hace que las páginas se adapten solas a pantallas de teléfonos, tablets y computadoras (diseño adaptativo o *responsive*).
*   **En este proyecto:** Nos permite organizar rápidamente la tienda en columnas, estructurar las modales emergentes y los formularios de pago de forma moderna sin escribir cientos de líneas de estilos a mano.

### 5. Font Awesome - 2012
*   **¿Qué es?** Lanzado en 2012, es un conjunto de herramientas de iconos vectoriales muy popular que permite insertar gráficos limpios y escalables en botones y textos.
*   **En este proyecto:** Proporciona los iconos visuales de carrito (🛒), lupa (🔍), basura (🗑️), candados de seguridad (🔒), tarjetas de crédito (💳) y los logotipos de redes sociales.

### 6. Fetch API y FakeStoreAPI
*   **¿Qué son?** **Fetch API** es una función moderna de JavaScript para realizar solicitudes de red de forma asíncrona. **FakeStoreAPI** es un servicio web público gratuito que simula una base de datos real de comercio electrónico proporcionando información de productos (imagen, título, precio, categoría y descripción) en formato JSON.
*   **En este proyecto:** JavaScript realiza una petición fetch a la API para obtener el listado de productos reales y pintarlos de forma dinámica en la pantalla al cargar la página.

### 7. jsPDF
*   **¿Qué es?** Una librería de JavaScript muy potente que permite generar documentos PDF directamente en el navegador del cliente.
*   **En este proyecto:** Toma los datos de la compra del carrito de compras y genera en un clic una representación exacta de un ticket térmico de 80 mm de ancho con fuente monoespaciada para su posterior impresión física.

---

## Sección 2: Estructura del Código Explicada

El proyecto está compuesto por tres archivos principales e independientes colocados en la misma carpeta del proyecto, además de una imagen de portada:

```
📂 Tienda-virtual
 ┣ 📄 index.html
 ┣ 📄 styles.css
 ┣ 📄 app.js
 ┗ 📷 FOTO_PORTADA_JUANCITO.png
```

### 1. El Esqueleto: `index.html`
El archivo principal que enlaza todas las hojas de estilo y scripts. Incluye la estructura de la grilla de productos, el menú lateral (offcanvas) del carrito de compras, los modales de la pasarela de pago y de perfil, y el footer adaptativo con la información del Ing. Juancito Peña.

### 2. El Estilo: `styles.css`
Define variables CSS reutilizables (`--primary-color`, `--secondary-color`) para lograr una paleta uniforme (azul eléctrico de confianza y verde de compra exitosa). Posee clases personalizadas para la simulación física de la tarjeta de crédito, el diseño flotante del botón del carrito con animaciones de rebote y un footer tecnológico oscuro con insignias personalizadas para las habilidades académicas y de programación.

### 3. El Cerebro: `app.js`
Consulta la API al iniciar mediante una función asíncrona. Maneja la reactividad de la interfaz de usuario: cuando un usuario añade un producto, actualiza el `localStorage` (permitiendo que el carrito no se borre al recargar la página), calcula precios finales, simula el retraso del pago con un spinner y genera el PDF de forma dinámica ajustando la altura del lienzo según la cantidad de productos facturados.

---

## Sección 3: Guía de Uso en Visual Studio Code (Para Principiantes)

Si eres un estudiante sin conocimientos previos en programación, sigue estos pasos sencillos para abrir y ejecutar este proyecto en tu computadora:

### Paso 1: Descargar e Instalar Visual Studio Code (VS Code)
1.  Ingresa al sitio oficial: [https://code.visualstudio.com/](https://code.visualstudio.com/).
2.  Descarga el instalador correspondiente a tu sistema operativo (Windows, macOS o Linux) y ejecútalo siguiendo los pasos por defecto.

### Paso 2: Crear los Archivos en tu Computadora
1.  Crea una nueva carpeta vacía en tu escritorio llamada `Tienda-virtual`.
2.  Coloca dentro de esa carpeta la foto del creador con el nombre exacto: `FOTO_PORTADA_JUANCITO.png`.
3.  Abre Visual Studio Code.
4.  Haz clic en **File** (Archivo) -> **Open Folder** (Abrir carpeta) y selecciona la carpeta `Tienda-virtual` que acabas de crear.
5.  En la barra lateral izquierda, haz clic en el botón de **New File** (Nuevo archivo) y crea tres archivos independientes con los nombres:
    *   `index.html`
    *   `styles.css`
    *   `app.js`
6.  Copia y pega el código correspondiente proporcionado en este manual dentro de cada archivo y presiona `Ctrl + S` (o `Cmd + S` en Mac) para guardar cada uno.

### Paso 3: Instalar y Usar la Extensión "Live Server"
Dado que los navegadores bloquean ciertas solicitudes locales de archivos por seguridad, necesitamos un servidor de desarrollo local para ver la página web en acción:
1.  En la barra lateral izquierda de VS Code, haz clic en el icono de **Extensions** (Extensiones) representado por 4 cuadrados.
2.  En la barra de búsqueda superior, escribe **Live Server** (el creador oficial es Ritwick Dey).
3.  Haz clic en el botón verde **Install** (Instalar).
4.  Una vez instalado, abre tu archivo `index.html`.
5.  En la esquina inferior derecha de la ventana de VS Code verás un botón que dice **Go Live**. Haz clic en él.
6.  Automáticamente se abrirá tu navegador predeterminado mostrando la tienda virtual en la dirección `http://127.0.0.1:5500/index.html`. ¡Cualquier cambio que guardes en el código se reflejará al instante!

---

## Sección 4: Cómo Desplegar el Proyecto en GitHub (Método Manual Sin Comandos)

Para que cualquier persona en el mundo pueda ver tu tienda virtual desde su celular o computadora, la publicaremos en internet usando **GitHub Pages**. Haremos todo de manera visual:

### Paso 1: Crear una Cuenta en GitHub
1.  Ingresa a [https://github.com/](https://github.com/).
2.  Haz clic en **Sign up** (Registrarse) en la parte superior derecha.
3.  Introduce tu correo electrónico, crea una contraseña segura y elige un nombre de usuario. Sigue los pasos de verificación y confirma tu cuenta desde tu correo.

### Paso 2: Crear un Nuevo Repositorio
1.  Inicia sesión en GitHub.
2.  En la página de inicio o en la esquina superior derecha, haz clic en el botón **+** y luego selecciona **New repository** (Nuevo repositorio).
3.  Asigna un nombre al repositorio, por ejemplo: `tienda-virtual`.
4.  Asegúrate de dejar la opción en **Public** (Público) para que la página pueda ser vista en línea.
5.  Deja todas las demás opciones marcadas por defecto (no agregues archivos README ni licencias por ahora).
6.  Haz clic en el botón verde **Create repository** (Crear repositorio).

### Paso 3: Subir los Archivos (Arrastrar y Soltar)
1.  Al crearse el repositorio, verás una pantalla con instrucciones. Busca un texto que dice: *"...or upload an existing file"* (o subir un archivo existente) y haz clic en el enlace **upload an existing file**.
2.  Abre la carpeta del proyecto `Tienda-virtual` en tu explorador de archivos de Windows o Finder en Mac.
3.  Selecciona todos los archivos del proyecto (`index.html`, `styles.css`, `app.js` y `FOTO_PORTADA_JUANCITO.png`).
4.  Arrastra los archivos seleccionados con el mouse y suéltalos en la zona indicada de la página web de GitHub.
5.  Espera a que todos los archivos se carguen por completo.
6.  En la parte inferior de la página, en la sección **Commit changes**, haz clic en el botón verde **Commit changes** (Confirmar cambios). Tu repositorio ahora mostrará los archivos cargados.

### Paso 4: Publicar con GitHub Pages
1.  Dentro de tu repositorio de GitHub, haz clic en la pestaña **Settings** (Configuración) ubicada en el menú superior del repositorio.
2.  En la barra lateral izquierda, busca la sección **Pages** (dentro de "Code and automation").
3.  En la sección **Build and deployment**, localiza la opción **Branch** (Rama).
4.  Cambia el menú desplegable que dice `None` por `main` (o `master`).
5.  Deja la carpeta en `/ (root)` y haz clic en el botón **Save** (Guardar).
6.  Espera aproximadamente 1 a 2 minutos y refresca la página de Settings. En la parte superior de la sección de GitHub Pages verás un recuadro con un mensaje de color verde que dice: *"Your site is live at..."* seguido de un enlace como `https://tu-usuario.github.io/tienda-virtual/`.
7.  Haz clic en el enlace. ¡Tu tienda virtual ya está publicada y lista para ser compartida!

---

## Sección 5: Cómo Desplegar el Proyecto en Vercel

Vercel es una plataforma de nube líder para alojar aplicaciones web rápidas de manera gratuita. Conectarla con GitHub nos permite automatizar el despliegue.

### Paso 1: Crear una Cuenta en Vercel
1.  Ingresa a [https://vercel.com/](https://vercel.com/).
2.  Haz clic en **Sign up** (Registrarse).
3.  Selecciona la opción **Continue with GitHub** (esto es crucial, ya que facilitará la importación).
4.  Autoriza a Vercel a conectarse con tu cuenta de GitHub completando los pasos de autenticación.

### Paso 2: Vincular Vercel con tu Repositorio de GitHub
1.  Al ingresar al panel de control (Dashboard) de Vercel, haz clic en el botón **Add New...** y luego en **Project** (Proyecto).
2.  Vercel te mostrará una lista de los repositorios de tu cuenta de GitHub (si es la primera vez, es posible que debas hacer clic en "Adjust GitHub App Permissions" para darle acceso al repositorio `tienda-virtual`).
3.  Busca tu repositorio `tienda-virtual` en la lista y haz clic en el botón **Import** (Importar) que se encuentra a su lado.

### Paso 3: Configurar e Importar el Proyecto
1.  En la pantalla de configuración del proyecto de Vercel, deja todas las opciones de configuración por defecto, ya que es un sitio HTML/CSS/JS estático clásico.
2.  Haz clic en el botón **Deploy** (Desplegar).
3.  Vercel compilará y desplegará tu proyecto en cuestión de segundos. Al finalizar, verás una animación de confeti y una miniatura interactiva de tu sitio.
4.  Haz clic sobre la vista previa para ir al enlace público generado (por ejemplo, `https://tienda-virtual-tuservidor.vercel.app`).
5.  Cualquier cambio futuro que subas a tu GitHub (haciendo un commit de nuevos archivos) actualizará tu sitio web en Vercel de forma automática al instante.

---

Este manual representa la sinergia perfecta entre el diseño premium, el desarrollo de sistemas distribuidos a nivel académico y la facilidad de implementación de negocios impulsada por el **Ing. Juancito Peña**.
