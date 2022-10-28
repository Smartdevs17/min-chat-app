const expect = require('expect').expect;
const isRealString = require("../utils/isRealString");


describe("Is Real String", () => {
    it("should reject non-string values",() => {
        let res = isRealString(40);
        expect(res).toBe(false);
    })

    it("should reject with only spaces",() => {
        let res = isRealString("         ");
        expect(res).toBe(false);
    })

    it("should allow strings with to much space chars",() => {
        let res = isRealString("          kfjkj ");
        expect(res).toBe(true)
    })

    it("should allow strings with non space chars",() => {
        let res = isRealString("what i know");
        expect(res).toBe(true)
    })
})