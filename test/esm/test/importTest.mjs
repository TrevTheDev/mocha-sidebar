import chai from "chai";
import toImport from "../toImport.mjs";

const expect = chai.expect;

describe("can import", () => {
    it("it() should have global var", () => {
        expect(toImport).to.eql("this is imported!");
    });
});
