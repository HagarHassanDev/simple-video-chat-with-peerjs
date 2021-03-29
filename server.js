const express = require('express');
const app = express();
const server = require('http').Server(app);
// cuz websocket run over http 1.1
const io = require('socket.io')(server);

const {v4 :uuidV4} = require('uuid');

app.set('view engine' , 'ejs');

app.use(express.static('public') );

app.get('/', (req, res)=>{
    // create new room and go to it
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room' , (req, res)=>{
    res.render('room' , {roomId : req.params.room})
});

// connect to socket io 
io.on('connection',socket=>{
    socket.on('join-room' , (roomId , userId)=>{
        socket.join(roomId );
        socket.broadcast.to(roomId).emit('user-connected' , userId);        
    
        socket.on('disconnect' , ()=>{
            socket.broadcast.to(room).emit('user-disconnected' , userId);
        })
    
    });
})

server.listen(4001 );