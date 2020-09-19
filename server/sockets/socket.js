const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utils/utils');

var usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {

            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            })
        
        }

        client.join(data.sala);

        let personas = usuarios.addPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } entró al chat`));

        console.log(`${ data.nombre } se conectó a la sala ${ data.sala }`);

        console.log('La lista de personas conectadas es: ', personas);

        callback(usuarios.getPersonas());

    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);

    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.deletePersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', ` ${ personaBorrada.nombre } salió de la sala ${ personaBorrada.sala }`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));

        console.log(`${ personaBorrada.nombre } se desconectó de la sala ${ personaBorrada.sala }`);

        let personas = usuarios.getPersonas();
        
        console.log('La lista de personas conectadas es ahora: ', personas);

    });

    // Mensajes privados
    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    })

});



