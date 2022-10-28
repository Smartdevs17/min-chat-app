let socket = io();

const scrollToBottom = ()=> {
    const messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

// socket.on("connect", () => {
    // console.log("connected to the server");

    // socket.emit("createMessage",{
    //     from: "smartdeveloper",
    //     text: "i just the crush this babe",
    //     to: "how i met your mother"
    // })
// });

//When the user connect to a tab
socket.on('connect', function() {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
  
    //Create a new room for a user 
    socket.emit('join', params, function(err) {
      if(err){
        alert(err);
        window.location.href = '/';
      }else {
        console.log('No Error');
      }
    })
  });

  
//When a user disconnect from the tab  
socket.on("disconnect", () => {
    console.log("disconnected from server");
}); 


socket.on("updateUsersList",(users) => {
    // console.log(users);
    //Create a ol for the list of users of the chat
    const ol = document.createElement("ol")
    //looping through all the users
    users.forEach((user) => {
        const li = document.createElement("li");
        li.innerHTML = user;
        ol.appendChild(li);

    });
    //Append the users to the ol and the div
    const usersList = document.querySelector("#users");
    usersList.innerHTML = ""
    usersList.append(ol)

})

//Establishing a network which listen for incoming messages
socket.on("newConnection", (message) => {
    // console.log("myconnect: ",message);
    const formattedTime = moment(message.createdAt).format("LLLL");

    const template = document.querySelector("#message-template").innerHTML
    const html = Mustache.render(template,{
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    const div = document.createElement("div");
    div.innerHTML = html;
    document.querySelector("#messages").append(div);
    // const formattedTime = moment(message.createdAt).format("LLLL");

    // let li = document.createElement("li");
    // li.innerText = `${message.from},CreatedAt: ${formattedTime}, Message: ${message.text}`;

    // document.querySelector("body").appendChild(li);
    scrollToBottom();

});

//Establish a connection that listen for message location
socket.on("newLocationMessage", (message) => {
    console.log("myconnect: ",message);

    let li = document.createElement("li");
    // li.innerText = `${message.from}: ${message.text}`;
    const formattedTime = moment(message.createdAt).format("LLLL");
    // li.innerText = `${message.from},CreatedAt: ${formattedTime}`;


    // let a = document.createElement("a");
    // a.setAttribute("target","_blank")
    // a.setAttribute("href", message.url)
    // a.innerText = "My current location"

    // li.appendChild(a)

    // document.querySelector("body").appendChild(li);

    const template = document.querySelector("#location-message-template").innerHTML
    const html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    console.log(message)

    const div = document.createElement("div");
    div.innerHTML = html;
    document.querySelector("#messages").append(div);

    scrollToBottom();
});

// socket.on("newMessage",(message) => {
//     console.log("myconnect", message);;
// });

// socket.emit("createMessage",{
//     from: "mike",
//     text: "whatsup bro"
// },(message) => {
//     console.log(`server message: ${message}`)
// });


//send the message to the backend and also update the UI
document.querySelector("#submit-btn").addEventListener("click",(e) => {
    e.preventDefault();

    //Sends message to the server
    socket.emit("createMessage",{
        text: document.querySelector('input[name="message"]').value
    },(message) => {
        console.log(`Server message: ${message}`);
    })
});

//Listen for the location from the user and send to the server
document.querySelector("#send-location").addEventListener("click", (e ) => {
    e.preventDefault();

    if(!navigator.geolocation){
        return alert("Geolocation not supported by your browser");
    }
    // else{
    //   return  navigator.geolocation.getCurrentPosition((position) => {
    //         alert(position.coords.latitude, position.coords.longitude);
    //       });
    // }

    //Send the user position location to the server
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        socket.emit("createLocationMessage",{
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    },( ) => {
        alert("Unable to fetch location")
    })
})