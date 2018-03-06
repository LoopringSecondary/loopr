import io from 'socket.io-client';

let host = "http://10.137.109.237:8000"
console.log('host',host)
let options = {
  reconnection:false,
  transports: ['websocket'],
  // path:'/'
}
let socket = io(host,options)
socket.on('connect', function(data){
  console.log("connected with server")
})


