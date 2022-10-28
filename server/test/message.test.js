const expect = require("expect").expect;
const request = require("supertest");
const {generateMessage,generateLocationMessage} = require("../utils/message");


describe("Generate Message", () => {
    it("should generate correct message", ()=> {
        let from = "smartdev",
            text = "i dont just know what to do"
            message = generateMessage(from,text)

        expect(typeof message.createdAt).toBe("number");
        expect(message).toMatchObject({from,text});

        
    });
});

describe("Generate Location Message",() => {
    it("should generate location url",() => {
        let from = "michelle",
            lat = 12,
            lng = 20,
            url = `https://google.com/maps?q=${lat},${lng}`

            const message = generateLocationMessage(from,lat,lng);

        expect(typeof message.createdAt).toBe("number");
        expect(message.url).toEqual(url);
        expect(message).toMatchObject({from,url});



    })
})