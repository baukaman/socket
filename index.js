var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var axios = require('axios');

app.get('/', (req, res) => {
    //res.send('<h1>hello world!!!</h1>');
    res.sendFile(__dirname + '/teacher.html');
});

io.on('connection', (socket) => {
    //console.log('connected');
    const teacher_id = socket.handshake.query.teacher_id;
    const page_id = socket.handshake.query.page_id;
    if(teacher_id) {
    	axios.get('https://localhost/api/connect.teacher?teacher_id=' + teacher_id + '&page_id=' + page_id)
    	   .then(response => {
    	      console.log(teacher_id + ' ' + page_id + ' registered as connected');
    	   });
    }
    socket.on('lesson.request', (msg) => {
      io.emit('lesson.request', msg);
    });
    socket.on('lesson.accept', (msg) => {
      io.emit('lesson.accept', msg);
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
      axios.get('https://localhost/api/disconnect.teacher?teacher_id='+teacher_id + '&page_id=' + page_id)
          .then(response => {
              console.log(teacher_id + ' ' + page_id + ' registered as disconnected');
          });
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});