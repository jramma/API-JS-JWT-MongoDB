# API-JS-JWT-MongoDB

Esta clase es un servidor de Express que se conecta a una base de datos MongoDB usando Mongoose para manejar la autenticación de usuarios con bcrypt para el hashing de contraseñas y jsonwebtoken para generar tokens JWT. Aquí está el desglose de su funcionalidad:

1. **Importación de módulos y configuración inicial**: Se importan los módulos necesarios (`express`, `mongoose`, `bcrypt`, `jsonwebtoken`, `express-jwt`) y se define el modelo de usuario. Se establece una conexión con una base de datos MongoDB y se inicializa una aplicación de Express.

2. **Middleware para parsear JSON**: Se utiliza `express.json()` para permitir que la aplicación maneje solicitudes JSON.

3. **Configuración de JWT**: Se configura `expressJwt` para validar tokens JWT usando un secreto almacenado en `process.env.SECRET` y se define una función `singToken` para firmar tokens.

4. **Registro de usuarios**: En la ruta `/register`, se verifica si el usuario ya existe en la base de datos. Si no existe, se hashea la contraseña con `bcrypt`, se crea un nuevo usuario y se genera un token JWT que se envía al cliente.

5. **Inicio de sesión de usuarios**: En la ruta `/login`, se busca al usuario por email. Si el usuario existe y la contraseña es correcta (usando `bcrypt.compare`), se firma un nuevo token JWT y se envía al cliente.

6. **Middleware para encontrar y asignar usuario**: `findAndAssignUser` busca al usuario en la base de datos usando el ID del token JWT y lo asigna al objeto `req` para su uso en rutas posteriores.

7. **Autenticación**: Se define un middleware `isAuthenticated` que utiliza `validateJwt` para validar el token JWT y luego `findAndAssignUser` para asignar el usuario al objeto `req`.

8. **Ruta de perfil**: La ruta `/profile` utiliza el middleware `isAuthenticated` para asegurar que solo los usuarios autenticados puedan acceder. Sin embargo, actualmente lanza un error intencionalmente.

9. **Manejo de errores**: Se definen dos middlewares de manejo de errores al final de la cadena de middlewares para capturar y responder a cualquier error que ocurra durante el procesamiento de las solicitudes.

10. **Inicio del servidor**: Finalmente, se inicia el servidor Express en el puerto 3000.

Este código proporciona una base para un sistema de autenticación y registro de usuarios utilizando tecnologías populares en el ecosistema de Node.js.