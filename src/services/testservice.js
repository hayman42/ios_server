import Testmodel from "../models/testmodel"

export default {
    async save(msg) {
        var test = new Testmodel({
            msg: msg
        });
        var res = await test.save();
        return res;
    }
};