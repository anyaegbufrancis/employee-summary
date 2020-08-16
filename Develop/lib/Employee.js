// TODO: Write code to define and export the Employee class

class Employee  {
    constructor (name, id, email) {
        this.name = name;
        this.id = id;
        this.email = email;
    }
    get getName(name) {
        return this.name
    }
    get getName(id) {
        return this.id
    }
    get getName(email) {
        return this.email
    }    
}



// class Manager extends Employee {
//     constructor (officeNumber) {
//         this.officeNumber = officeNumber
//     }    
// }
