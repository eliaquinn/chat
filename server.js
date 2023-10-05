const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken')

const app = express();
app.use(express.json())
const server = createServer(app)
const io = new Server(server);

const SECRET = "abacate"

//middleware de autenticação
const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    // const token = req.headers['authorization'];

    //verifica se foi deslogado
    //use um ttl index para sumir sozinho do banco
    const index = blacklist.findIndex(item => item === token);
    if (index !== -1) return res.status(401).end()

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();

        //guarda na requisição para uso posterior.
        req.userId = decoded.userId;

        next();
    })
}

const dados = [
    { nome: "Fulano de Tal", type: "admin" },
    { nome: "Ciclano de Tal", type: "user" },
    { nome: "Beltrano de Tal", type: "root" }
]

//ROTA PROTEGIDA
app.get("/clients", verifyJWT, (req, res) => {
    console.log(req.userId + " fez esta chamada")
    res.status(200).send(dados)
})

//ROTA DE LOGIN
app.post("/login", (req, res) => {
    if (req.body.user === "eliaquin.araujo" && req.body.password === "abc123") {//acesso o banco para validar os dados
        const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 300 })
        return res.json({ auth: true, token })
    }

    res.status(401).end()
})

//blacklist para deslogar
// obs.  voce pode fazer isso no banco, ou usando um regis
const blacklist = []

//ROTA DE LOGOUT
app.post("/logout", (req, res) => {
    blacklist.push(req.headers['x-access-token'])
    res.end()
})

//ROTA DE FUNCIONAMENTO
app.get("/", (req, res) => {
    // const token = jwt.sign({ hash: 'abacate' }, 'teste');

    // jwt.verify(token, 'teste', function (err, decoded) {
    //     console.log(decoded.hash)
    // });


    // res.send({
    //     token
    // })
    // res.sendFile(join(__dirname, "public/index.html"));
    res.status(200).send({ msg: "está funcionando!" })
});

// io.on("connection", (socket) => {
//     // console.log("a user connected");
//     //event disconnect
//     // socket.on("disconnect", () => {
//     //     console.log("user disconnected");
//     // });

//     //event chat message
//     // socket.on("chat message", (msg) => {
//     //     console.log("message: " + msg);
//     // });

//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//       });
// });

server.listen(3000, () => console.log("Server is running..."));