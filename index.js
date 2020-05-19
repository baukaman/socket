var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    //res.send('<h1>hello world!!!</h1>');
    res.sendFile(__dirname + '/teacher.html');
});

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('lesson.request', (msg) => {
      io.emit('lesson.request', msg);
    });
    socket.on('lesson.accept', (msg) => {
      io.emit('lesson.accept', msg);
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});