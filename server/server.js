const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
let server = http.createServer(app);
let io = socketIO(server);
const {generateMessage,generateLocationMessage} = require("./utils/message");
const isRealString = require("./utils/isRealString");
const {Users} = require("./utils/users");
let users = new Users();
const publicPath = path.join(__dirname,"/../public");
app.use(express.static(publicPath));


io.on("connection", (socket) => {
    console.log("A new user just connected");



    // socket.emit("newMessage",generateMessage("Smart Developer","I am feeling sad right now"));


    socket.on("join", (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback("Name and room are required");
        }
            // console.log(socket.id);
            
            //Socket joins a use to a room and listen when a user joins a room
            socket.join(params.room);

            //Remove the user from any other room 
            users.removeUser(socket.id);

            //Add the user to room
            users.addUser(socket.id,params.name,params.room);
            
            //Get all the users in my room
            const allUsers = users.getUserList(params.room);

            //Send all the users that join the room including me and everyone
            io.to(params.room).emit("updateUsersList",allUsers);
            
            socket.emit("newConnection",{
                from: "Admin",
                text: `Welcome ${params.name} to the ${params.room} room!!! `
            });

            socket.broadcast.emit("newMessage",generateMessage("Admin","Thanks for joinning my chat-app"));
            callback();
    })

    socket.on("createMessage", (message,callback) => {
        //Get the user that just texted a message;
        let user = users.getUser(socket.id);

        //check if user and the valid message
        if(user && isRealString(message.text)){
            //Send the message to only people of my group
            io.to(user.room).emit("newConnection",generateMessage(user.name,message.text));
        }
        // io.emit("newConnection", generateMessage(message.from,message.text));
        callback("the server just got your reply!!");
        // socket.broadcast.emit("newConnection",{
        //     from: message.from,
        //     text: message.text,
        //     to: message.to,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on("createLocationMessage",(coords)=> {
        // console.log(coords);

        //Get the current user
        let user = users.getUser(socket.id)
        //Check if the user has valid coordinates
        if(user && coords){
            //Send tthe location to only the members in his group
            io.to(user.room).emit("newLocationMessage",generateLocationMessage(user.name,coords.lat,coords.lng));
        }

        // io.emit("newLocationMessage", generateLocationMessage("MY Geolocation",coords.lat, coords.lng));
    })

    socket.on("disconnect", () => {
        // console.log("user just disconnected");

        //Refresh disconnect a user and so we have to remove the user from the group and tell the members that the user has left
        let user = users.removeUser(socket.id);

        if(user){
            //Update the user list for the group to show only current users
            io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
            //Send message to the group that the person just left
            io.to(user.room).emit("newConnection",generateMessage("Admin",`${user.name} has just left the group`));
        }
    });
});



const port = process.env.PORT || 3000;
server.listen(port, () =>{
    console.log(`Server stated running successfully on port ${port}.`);
})