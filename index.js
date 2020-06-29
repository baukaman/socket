var app = require('express')();
var fs = require('fs'), config = require('./config');
var axios = require('axios');

var serverPort = config.port || 3000,
    secure = config.secure || false;

if(secure)
{
    var options = {
        key: fs.readFileSync(config.secure_key),
	cert: fs.readFileSync(config.secure_cert)
    };
    var server = require('https').createServer(options, app);
} else 
{
    var server = require('http').createServer(app);
}


//var http = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', (req, res) => {
    //res.send('<h1>hello world!!!</h1>');
    res.sendFile(__dirname + '/teacher.html');
});

io.on('connection', (socket) => {
    //console.log('connected');
    const teacher_id = socket.handshake.query.teacher_id;
    const page_id = socket.handshake.query.page_id;
    if(teacher_id) {
    	axios.get('https://todaysoft.kz/api/connect.teacher?teacher_id=' + teacher_id + '&page_id=' + page_id)
	   .then(response => {
    	      console.log(teacher_id + ' ' + page_id + ' registered as connected');
    	   })
	   .catch(error=>{
	       console.log(error);
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
      axios.get('https://todaysoft.kz/api/disconnect.teacher?teacher_id='+teacher_id + '&page_id=' + page_id)
          .then(response => {
              console.log(teacher_id + ' ' + page_id + ' registered as disconnected');
          });
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
