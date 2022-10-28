const expect = require("expect").expect;
const {Users} = require("../utils/users");


describe("Users", ()=> {
    let users;
    beforeEach(() => {
         users = new Users();
        users.users = [
            {
                id: 1,
                name: "mayo",
                room: "chat-one"
            },
            {
                id: 2,
                name: "miracle",
                room: "chat-two"
            }
            ,            {
                id: 3,
                name: "mike",
                room: "chat-three"
            },
            {
                id: 4,
                name: "mary",
                room: "chat-one"
            }
        ]
    })

    it("should add user",() => {
        let users = new Users();
        let user = {
            id: "123abc",
            name: "Smart Developer",
            room: "smartdevCode"
        }
        let reUser = users.addUser(user.id,user.name,user.room);
        expect(users.users).toEqual([user]);
    });

    it("should return chat-one",() => {
        const userList = users.getUserList("chat-one");

        expect(userList).toEqual(['mayo','mary']);


    });

    it("should return chat-three",() => {
        const userList = users.getUserList("chat-three");

        expect(userList).toEqual(["mike"]);


    });

    it("should get user",()=> {
        const userId = 2;
        const user = users.getUser(userId);

        expect(user.id).toBe(userId)
    });

    it("should not get user",() => {
        const userId = 100;
        const user = users.getUser(userId);

        expect(user).toBeUndefined();
    });

    it("should remove user",() => {
        const userId = 3;
        const user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(3);
    })

    it("should not remove user",() => {
        const userId = 500;
        const user = users.removeUser(userId);

        expect(user).toBeUndefined();
        expect(users.users.length).toBe(4);
    })

})