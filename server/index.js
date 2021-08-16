const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        credentials: true
    }
});
const PORT = process.env.PORT || 8080;

const usersRoutes = require('./routes/users');
const roomsRoutes = require('./routes/rooms');
const messagesRoutes = require('./routes/messages');
const axios = require('axios');

// -----------------------------

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

http.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});

// -----------------------------

app.get("/", (req, res) => {
    res.json({
        msg: "Le serveur est opérationnel."
    });
});

app.use('/api/users', usersRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/messages', messagesRoutes);

// -----------------------------

let users = [];

const addUser = ({ user_id, socket_id, room_id, isTyping }) => {
    !users.some((user) => user.user_id === user_id) && users.push({ user_id, socket_id, room_id, isTyping });

    console.log(users);
}

const removeUser = (socket_id) => {
    users = users.filter((user) => user.socket_id !== socket_id);
};

const getUsers = (room_id) => {
    return users.filter((user) => user.room_id === room_id);
};

const setUserTyping = ({ user_id, isTyping }) => {
    users = users.map((user) => {
        if (user.user_id === user_id) user.isTyping = isTyping;
        return user;
    });
}

io.on("connection", (socket) => {
    // when connect
    console.log("new user connected.");
    
    // confirm connection
    io.to(socket.id).emit('news', {
        msg: 'Connexion établie avec le serveur.',
    })

    // send and get message
    socket.on("post-message", (msg) => {
        const room = `room:${msg.room_id}`;

        io.to(room).emit('get-message', msg);
    });

    // join room
    socket.on("join-room", ({ room_id, user_id }) => {
        const room = `room:${room_id}`;
        socket.join(room);

        addUser({ user_id: user_id, socket_id: socket.id, room_id: room_id, isTyping: false });
        io.to(room).emit('users-in-room', getUsers(room_id));
    });

    // user is typing
    socket.on("user-typing", ({ isTyping, user_id, room_id }) => {
        const room = `room:${room_id}`;
        setUserTyping({isTyping: isTyping, user_id: user_id})

        io.to(room).emit('users-in-room', getUsers(room_id));
    });

    // force disconnect
    socket.on('forceDisconnect', () => {
        socket.disconnect();
    });

    //when disconnect
    socket.on("disconnect", () => {

        const room = users.find(user => user.socket_id === socket.id)?.room_id;

        removeUser(socket.id);

        if (room) io.to(`room:${room}`).emit('users-in-room', getUsers(room));

        console.log("a user disconnected!");
    });

});