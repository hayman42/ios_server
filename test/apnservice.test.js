import ApnService from "../src/services/apnservice";

describe("apn test", () => {
    const msg = "asdf";
    const nickname = "jouureee";
    test("should send push through apn", async () => {
        const apnService = new ApnService;
        let res = await apnService.sendPush("asdf", "jouureee");
        expect(res.failed.length).toBe(0);
    });
});