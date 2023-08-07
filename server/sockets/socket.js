const { io } = require('../server');
const {Users} = require('../classes/user')
const {createMessage} = require('../utils/utils')

const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', (data, callback) =>{

        console.log("entre al chat ", data.nombre, " ", data.sala)
        if(!data.nombre || !data.sala){
            return callback({
                error:true,
                mensaje:"El nombre/sala es necesario"
            })
        }
        client.join(data.sala);
        users.addPerson(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit("personsList", users.getPersonsPersala(data.sala));
        client.broadcast.to(data.sala).emit("createMessage", createMessage('Admin', `${data.nombre} se unió`))

        callback(users.getPersonsPersala(data.sala))
    })

    client.on('disconnect', () => {
        console.log(users.getPersons())
        let personDeleted = users.deletePerson(client.id);
        console.log(personDeleted)
        client.broadcast.to(personDeleted.sala).emit("createMessage", createMessage('Admin', `${personDeleted.nombre} salió`))
        client.broadcast.to(personDeleted.sala).emit("personsList", users.getPersonsPersala(personDeleted.sala));
    
    });

    client.on('createMessage', (data, callback) =>{
        console.log("DATA ",data)

        let person = users.getPerson(client.id);

        let message = createMessage(person.nombre, data.mensaje);
        client.broadcast.to(person.sala).emit('createMessage', message)

        callback(message)
    })
    // mensajes privados
    client.on('privateMessage', data =>{
        
        let person = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.nombre, data.mensaje));


    })
});
