<h1 id="offcorss-assistant">Offcorss Assistant</h1>



<h2 id="dependencias-principales">Dependencias principales</h2>

<ul>
<li><a href="https://git-scm.com/">Git</a></li>
<li><a href="https://nodejs.org/es/">NodeJS</a></li>
<li><a href="https://www.npmjs.com/">NPM</a> <code>Normalmente viene incluído en node.</code></li>
<li><a href="https://www.mongodb.com/es">Mongodb</a></li>
<li><a href="http://sass-lang.com/">Sass</a></li>
</ul>

<h2 id="instalación">Instalación</h2>

<ol>
<li>Clonar el repositorio <code>git clone &lt;urlDelRepositorio&gt;</code></li>
<li>Instalar las dependencias principales</li>
<li>Ejecutar el comando <code>npm install</code> desde el archivo clonado.</li>
<li><a href="#configuración">Configurar</a> la base de datos y publicarla con el comando <code>mongod --auth</code></li>
<li>Ejecutar la aplicación con el comando <code>npm start</code></li>
</ol>

<hr>

<p><div class="toc">
<ul>
<li><a href="#offcorss-assistant">Offcorss Assistant</a><ul>
<li><a href="#dependencias-principales">Dependencias principales</a></li>
<li><a href="#instalación">Instalación</a></li>
<li><a href="#front-1">Front</a><ul>
<li><ul>
<li><a href="#crear-una-nueva-vista"> Crear una nueva vista</a></li>
<li><a href="#visualizar-una-vista"> Visualizar una vista</a></li>
<li><a href="#js"> JS</a></li>
<li><a href="#scss"> SCSS</a></li>
<li><a href="#admin"> Admin</a></li>
<li><a href="#persistencia"> Persistencia</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#back">Back</a><ul>
<li><ul>
<li><a href="#node"> Node</a></li>
<li><a href="#express"> Express</a></li>
<li><a href="#router"> Router</a></li>
<li><a href="#manage-document-synchronization"> Manage document synchronization</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#base-de-datos">Base de datos</a><ul>
<li><ul>
<li><a href="#configuración"> Configuración</a></li>
<li><a href="#update-a-publication"> Update a publication</a></li>
<li><a href="#manage-document-publication"> Manage document publication</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</p>

<hr>

<h2 id="front">Front</h2>

<p>El front es renderizado desde <code>./views/index.jade</code>  por express, utilizando el archivo  <code>./public/js/main.js</code> para la carga de cada vista, en este archivo main.js se llevarán todas las variables necesarias para el funcionamiento de la aplicación.</p>

<dl>
<dt>En este archivo <code>index.jade</code> vienen las librerias js externas :</dt>
<dd><a href="http://api.jquery.com/">jQuery</a>

<blockquote>
  <code>./public/js/jquery-3.2.1.min.js</code>
</blockquote></dd>

<dd><a href="https://api.jquery.com/category/forms/">jQuery forms</a>

<blockquote>
  <code>./public/js/jquery.form.min.js</code>
</blockquote></dd>

<dd><a href="http://bootstrapdocs.com/v3.0.3/docs/">Bootstrap 3</a>

<blockquote>
  <code>script(src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa', crossorigin='</code> <br>
  <code>link(href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', rel='stylesheet', integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u', crossorigin='anonymous')</code> <br>
  <code>./public/css/font-awesome.min.css</code>
</blockquote></dd>

<dd><a href="http://kenwheeler.github.io/slick/">Slick</a>

<blockquote>
  <code>./public/css/slick.css</code> <br>
   <code>./public/css/slick-theme.css</code> <br>
   <code>./public/js/slick.min.js</code>
</blockquote></dd>

<dd><a href="https://momentjs.com/docs/">momentjs</a>

<blockquote>
  <code>./public/js/moment-with-locales.js</code>
</blockquote></dd>
</dl>

<blockquote>
  <p><strong>Notas:</strong></p>
  
  <ul>
  <li>Cada vista es un archivo html ubidado en la carpeta <code>./public/views/</code> .</li>
  <li>Cada vista tiene un <a href="#scss">Módulo</a> scss encargado de darle los estilos específicos a esa vista, este módulo está ubicado en la carpeta <code>./public/scss/modules/</code> .</li>
  <li>Cada vista debe ser cargada desde el <a href="#js">array de vistas</a> en el archivo <code>./public/js/main.js</code>.</li>
  </ul>
</blockquote>

<hr>



<h4 id="crear-una-nueva-vista"><i class="icon-plus"></i> Crear una nueva vista</h4>

<p>Las vistas deben ser creadas en html, se le pueden agregar cualquier tipo de librerías externas a cada vista específica o se le puede agregar al archivo <code>index.jade</code> para utilizarlas de forma global en cada vista. <br>
Se recomienda darle una clase o id a cada vista para facilitar el referenciamiento en el <code>js</code> y en el <code>scss</code>.</p>

<p>Para crear una nueva vista se debe :</p>

<blockquote>
  <ul>
  <li><p>Crear un nuevo archivo html en la carpeta <code>./public/views/</code></p>
  
  <blockquote>
    <p>– Por ejemplo, crearemos un archivo llamado <code>ejemplo.html</code></p>
  </blockquote></li>
  <li><p>Agregar el nombre de el nuevo archivo al <a href="#js">array de vistas</a> sin la terminación <code>.html</code></p></li>
  <li><code>var divs = ['gender', 'name', 'age', 'size', 'sizePrimi', 'occasion', 'weather', 'color', 'personality', 'result' 'ejemplo'];</code></li>
  </ul>
</blockquote>

<hr>



<h4 id="visualizar-una-vista"><i class="icon-eye"></i> Visualizar una vista</h4>

<p>Para cargar una vista, la aplicación tiene una función base <code>loadView(cur)</code> que acepta como parámetro un objeto <code>jQuery</code> que hace referencia al tag <code>html</code> en el cual se quiera renderizar la vista.</p>

<blockquote>
  <p><strong>Ejemplos</strong></p>
  
  <ul>
  <li><code>loadView($('#ejemplo'));</code></li>
  </ul>
</blockquote>

<p>La forma correcta de cargar una vista es utilizar las funciones <code>next(cur)</code> o <code>previous(cur)</code> que acepta como parámetro un <code>String</code> con el nombre de la vista sin la terminación <code>.html</code>, este <code>String</code> es recibido por la función <code>loadView(cur)</code> o por convención, la variable <code>current</code> que contiente el <code>String</code> de la vista actual.</p>

<blockquote>
  <p><strong>Ejemplos</strong></p>
  
  <ul>
  <li><code>next(current);</code></li>
  <li><code>next('ejemplo');</code></li>
  <li><code>next(divs[10]);</code></li>
  <li><code>previous(current);</code></li>
  <li><code>previous('ejemplo');</code></li>
  <li><code>previous(divs[10]);</code></li>
  </ul>
  
  <blockquote>
    <p><strong>Cada función tiene una animación</strong></p>
    
    <ul>
    <li><code>next()</code> desliza la vista actual hacia la izquierda y desliza la nueva vista desde la derecha hacia el centro.</li>
    <li><code>previous()</code> desliza la vista actual hacia la derecha y desliza la nueva vista desde la izquierda hacia el centro.</li>
    </ul>
  </blockquote>
</blockquote>

<hr>



<h4 id="js"><i class="icon-code"></i> JS</h4>

<p>El archivo principal <code>main.js</code> es el que se encarga de toda la lógica del front, está ubicado en <code>./public/js/main.js</code> y toma como referencia el archivo <code>./public/js/variables.js</code> para cargar variables como <code>divs</code> la cuál contiene un <code>array</code> con los <code>String</code> de cada vista disponible en la aplicación, este archivo también contiene todas las variables que mostrarán varios <code>String</code> a lo largo de la aplicación, los cuales serán editables desde el modo administrador. <br>
En este archivo <code>main.js</code> se lleva un rastreo de todas las variables necesarias en cada vista.</p>

<blockquote>
  <p><strong>loadView()</strong> <br>
  Esta función hace un llamado al <a href="https://www.w3schools.com/jquery/jquery_ajax_load.asp">método <code>.load()</code> de <code>jQuery</code> </a> el cuál tiene un callback en el cual se define la lógica de cada vista mediante un <code>if (current == 'ejemplo')</code>; si se cumple esta condición, la vista <code>ejemplo.html</code> cargó exitosamente y la aplicación procerderá a ejecutar la lógica dentro de el condicional sobre esta vista, pudiendo así utilizar las variables globales en cualquier vista.</p>
</blockquote>



<h4 id="scss"><i class="icon-pencil"></i> SCSS</h4>

<p>El <code>SCSS</code> se encarga de compilar todos los estilos <code>css</code> de la aplicación en la carpeta <code>./public/css/main.css</code>, esto se logra por medio del archivo <code>main.scss</code> ubicado en <code>./public/scss/main.scss</code>, este archivo contiene los estilos del <code>index.jade</code> y carga todos los módulos de la carpeta <code>./public/scss/modules</code> en la cuál estarán los archivos <code>scss</code> de cada vista y algunos archivos globales como <code>_variables.scss</code> que contiene todas las variables de estilo que se utilizarán a lo largo de la aplicación.</p>

<blockquote>
  <p><strong>Nota</strong> <br>
  Para compilar una vez estos archivos se debe instalar <a href="http://sass-lang.com/install">Sass</a> y correr el comando <code>sass --update scss:css</code> en la carpeta <code>./public</code>, o correr el comando <code>sass --watch scss:css</code> para que compile cuando hayan cambios en cualquier <code>scss</code>.</p>
</blockquote>



<h4 id="admin"><i class="icon-cog"></i> Admin</h4>

<p>Para acceder al admin debemos ir a la ruta <code>/admin</code>, en esta ruta el archivo <code>index.jade</code> retorna la variable <code>var admin = true</code> y el <code>main.js</code> verifica a través del <code>LocalStorage</code> si hay una sesión activa, en caso tal de que haya una sesión activa, el <code>main.js</code> carga el front con la barra de administrador o de call-center de acuerdo al rol. <br>
En caso tal de que no haya una sesión activa, el main.js carga la vista de inicio de sesión donde se podrá ingresar con las credenciales.</p>

<blockquote>
  <p>En la ruta principal <code>/</code> el archivo <code>index.jade</code> retorna la variable <code>var admin = false</code>.</p>
</blockquote>



<h4 id="persistencia"><i class="icon-hdd"></i> Persistencia</h4>

<p>Por defecto está desactivada, en caso de estar activada, esta función permitiría que el cliente avanzar a lo largo de al aplicación, cerrar la pestaña, volver a ingresar y continuar donde estaba siempre y cuando sea en el mismo navegador.</p>

<blockquote>
  <p>Se puede activar la función de persistencia cambiando la variable <code>persistency</code> en el archivo <code>main.js</code> a <code>true</code>.</p>
</blockquote>

<hr>



<h2 id="back">Back</h2>

<p>Se utiliza <a href="https://nodejs.org/es/docs/">NodeJS</a> con <a href="http://expressjs.com/es/api.html">express</a> para servir la aplicación, la API REST y renderizar el <code>index.jade</code> </p>

<h4 id="node-express"><i class="icon-refresh"></i> Node &amp; express</h4>

<p>Todas las configuraciones del servidor que corre por express están en el archivo <code>./offcorssAssistantBack.js</code> , acá se configura el router y cada ruta.</p>

<blockquote>
  <p>Para más información referirse a la <a href="https://nodejs.org/es/docs/">documentación</a>.</p>
</blockquote>



<h4 id="express-router"><i class="icon-refresh"></i> Express router</h4>

<p>Cada ruta se define en la carpeta <code>./routes</code> y se debe importar en el archivo <code>./offcorssAssistantBack.js</code> asignándole su ruta.</p>

<blockquote>
  <p>Para más información referirse a la <a href="https://expressjs.com/en/guide/routing.html">documentación</a>.</p>
</blockquote>

<hr>

<h2 id="base-de-datos">Base de datos</h2>

<p>Se utiliza <a href="https://docs.mongodb.com/">MongoDB</a> como motor de base de datos para el manejo de datos de la aplicación.</p>

<h4 id="configuración"><i class="icon-cog"></i> Configuración</h4>

<p>Para configurar la base de datos se debe <a href="https://docs.mongodb.com/manual/reference/method/db.createUser/">crear</a> un usuario en la base de datos admin con los accesos necesarios para la aplicación (root, userAdminAnyDatabase, dbAdminAnyDatabase). <br>
Luego de haber creado los accesos, se debe modificar la variable <code>mongoURL</code> en el archivo <code>./routes/db.js</code>, la cadena de conexión deberá quedar así <code> <br>
var mongoURL = process.env.MONGODB_URI || <br>
    process.env.MONGOHQ_URL || <br>
    'mongodb://&lt;user&gt;:&lt;pwd&gt;@localhost:27017/assistant?authSource=admin'; <br>
</code></p>

<h4 id="integración-con-la-api-rest-express-de-la-aplicación"><i class="icon-upload"></i> Integración con la API REST express de la aplicación</h4>

<p>La aplicación dedica una ruta de <code>express Router</code> a lo que tenga que ver con llamados a la base de datos, esta ruta <code>/db</code> contenida en el archivo <code>/routes/db.js</code> utiliza <a href="http://mongoosejs.com/">mongoose</a> para el manejo de llamados desde <code>node</code> y <code>express</code>, también importa los modelos ubicados dentro de la misma carpeta para la manipulación de cada colección dentro de la base de datos. <br>
Utiliza también <a href="https://www.npmjs.com/package/crypto">crypto</a> para verificar contraseñas del administrador.</p>

<blockquote>
  <p><strong><a href="https://robomongo.org/">Robomongo</a></strong> <br>
  Se recomienda el uso de esta aplicación para la visualización y manipulación de la base de datos en una forma gráfica y amigable al usuario.</p>
</blockquote>
