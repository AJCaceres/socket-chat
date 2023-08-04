const { io } = require('../server');
const {Users} = require('../classes/user')
const {createMessage} = require('../utils/utils')

const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', (data, callback) =>{

        
        if(!data.name || !data.room){
            return callback({
                error:true,
                mensaje:"El nombre/sala es necesario"
            })
        }
        client.join(data.room);
        users.addPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit("personsList", users.getPersonsPerRoom(data.room));

        callback(users.getPersonsPerRoom(data.room))
    })

    client.on('disconnect', () => {

        let personDeleted = users.deletePerson(client.id);

        client.broadcast.to(personDeleted.room).emit("crearMensaje", createMessage('Admin', `${personDeleted.name} salió`))
        client.broadcast.to(personDeleted.room).emit("personsList", users.getPersonsPerRoom(personDeleted.room));
    
    });

    client.on('createMessage', data =>{

        let person = users.getPerson(client.id);

        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message)
    })
    // mensajes privados
    client.on('privateMessage', data =>{
        
        let person = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));


    })
});
