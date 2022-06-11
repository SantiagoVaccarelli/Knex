const express = require('express');
const http = require('http');
const app = express();

const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const ContenedorDB = require('./contenedorDB');
const ContenedorDBChat = require('./contenedorDBChat');

const server = http.createServer(app);
const io = new Server(server);

const dotenv = require("dotenv");
const db = require('../db');

const contenedor = new ContenedorDB();
const chat = new ContenedorDBChat();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.engine('handlebars', engine({
    extname: '.handlebars',
    defaultLayout: 'index.handlebars',
    layoutsDir: __dirname + '/views/layouts'
}))

app.get('/products', async(req, res) => {
    const productos = await contenedor.getAll();
    res.render('pages/list', {productos})
})

app.post('/products', async(req,res) => {
    const body = req.body;
    console.log(body)
    await contenedor.save(body);
    res.redirect('/');
})

app.get('/', (req,res) => {
    res.render('pages/form', {})
})

io.on('connection', async(socket) => {
    console.log('Un usuario se ha conectado')
    
    const productos = await contenedor.getAll();
    socket.emit('cargarProductos', productos)
    
    const mensajes = await chat.getAll();
    socket.emit('cargarMensajes', mensajes)
    
    socket.on('nuevoMensaje', async(data) => {
        await chat.save(data);
        const mensajes = await chat.getAll();
        io.sockets.emit('actualizarMensajes', mensajes)
    })

    socket.on('agregarProducto', async(data) => {
        await contenedor.save(data);
        const productos = await contenedor.getAll();
        io.sockets.emit('actualizarLista', productos);
    })
    
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado')
    })
})

const PORT = 8080;
server.listen(PORT, async () => {
    console.log(`Servidor iniciado en puerto: ${PORT}`);
    // await db(process.env.T_PRODUCTOS).insert({
    //     nombre: 'Esteban',
    //     apellido: 'Quito',
    //     edad: 24,
    //     email: 'Equito@gmail.com'
    // })
    // console.log(await db(process.env.T_PRODUCTOS).select())
})