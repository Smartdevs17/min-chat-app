class Users {
    constructor(){
        this.users = [];
    }

    addUser(id,name,room){
        let user = {id,name,room};
        this.users.push(user);

        return user
    }

    getUserList(room){
        let users = this.users.filter((user) => user.room === room)
        let nameArray = users.map((user) => user.name);
        return nameArray
    }

    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }

    removeUser(id){
        let user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user
    }
}

// let new_user = new User("Segun", "nodejs")
// console.log(new_user.name);


module.exports = { Users };