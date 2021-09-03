const express = require("express");
const routerProd = require('./router.js');

const app = express()
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const { Router } = express

/* ------------------------------------------------------ */
/* Cargo router */
app.use('/api/productos', routerProd)


/* ------------------------------------------------------ */
/* Server Listen */
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
