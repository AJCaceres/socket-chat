

class Users{



    constructor(){
        this.persons =[];
    }

    addPerson(id, nombre, sala){
        let person = { id, nombre, sala }
        this.persons.push(person)

        return this.persons
    }

    getPerson(id){
        let person = this.persons.filter(person => person.id === id)[0];
        return person;

    }
    getPersons(){
        return this.persons
    }

    getPersonsPersala(sala){
        let personsInsala = this.persons.filter(person => person.sala === sala);
        console.log(personsInsala)
        return personsInsala
    }

    deletePerson(id){

        let personDeleted = this.getPerson(id);
        this.persons = this.persons.filter(person => person.id != id);

        return personDeleted

    }
}

module.exports = {
    Users
}