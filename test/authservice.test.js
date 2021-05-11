import AuthService from "../src/services/authservice";

describe("authservice test", () => {
    let authService;
    const type = "google";
    let token;
    beforeAll(done => {
        authService = new AuthService;
        done();
    });

    it("should be defined", () => {
        expect(authService).toBeDefined();
    });

    test("should return access token", async () => {
        const code = "4/0AY0e-g4eoR43W8GcXcQEi8W9AyQL8XznVWssfc6hMbAWSqb6WfmdK4LI5IA2tOUPARgkhw";
        token = await authService.getToken(code, type);
        console.log(token);
    });

    test("should return info", async () => {
        expect(token).toBeDefined();
        const info = await authService.getInfo(token, type);
        console.log(info);
    });

    test("should verify and return token", () => {
        const email = "a@b.c";
        const name = "abc";
        const jwt = authService.generateToken(email, name);
        const newToken = authService.verifyToken(jwt, email, name);
        console.log(newToken);
    });

    afterAll(() => {
    });
});