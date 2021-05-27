import AuthService from "../src/services/authservice";

describe("authservice test", () => {
    let authService;
    const type = "google";
    beforeAll(done => {
        authService = new AuthService;
        done();
    });

    it("should be defined", () => {
        expect(authService).toBeDefined();
    });

    test("should return info", async () => {
        const token = "ya29.a0AfH6SMAbm2wOWlzQp6w0TKedtsjfBTikTpQ70pH462TNc4bFmiptxrzamdTQ_gg5G1qr5O8l9n-cZktTciPHSF3TfcRAj5q9yVifxZ2BZyWXuaftV1KkyqKQadWxE6__brexO_IqfE8qXqJarEgwqOLPqLVV";
        expect(token).toBeDefined();
        const info = await authService.getInfo(token, type);
        console.log(info);
    });

    test("should return token", () => {
        const email = "a@b.c";
        const name = "abc";
        const jwt = authService.generateToken(email, name);
        console.log(jwt);
    });

    afterAll(() => {
    });
});