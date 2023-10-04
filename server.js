const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken')

const app = express();
const server = createServer(app)
const io = new Server(server);

app.get("/", (req, res) => {
    const token = jwt.sign({ hash: 'abacate' }, 'teste');

    jwt.verify(token, 'teste', function(err, decoded) {
        console.log(decoded.hash)
    });


    res.send({
        token
    })
    // res.sendFile(join(__dirname, "public/index.html"));
});

io.on("connection", (socket) => {
    // console.log("a user connected");
    //event disconnect
    // socket.on("disconnect", () => {
    //     console.log("user disconnected");
    // });

    //event chat message
    // socket.on("chat message", (msg) => {
    //     console.log("message: " + msg);
    // });
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
});

server.listen(3000, () => console.log("Server is running..."));