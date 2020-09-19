// Para comunicación con sockets
var socket = io();

// Parámetros en browser
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = { nombre: params.get('nombre'), sala: params.get('sala') }

socket.on('connect', function() {
    
    socket.emit('entrarChat', usuario, function(resp) {
    	console.log(`${ usuario.nombre } entró al chat.`);
    });

});

socket.on('crearMensaje', function(mensaje) {

	console.log('Servidor: ', mensaje);
	
})

// Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(respuesta) {

	console.log('Usuarios conectados: ', respuesta);
	
})

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

	console.log('Mensaje Privado: ', mensaje);

});