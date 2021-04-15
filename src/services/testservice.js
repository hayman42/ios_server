import testModel from "../models/testmodel"

export default {
    async save(msg) {
        var test = new testModel({
            msg: msg
        });
        var res = await test.save();
        return res;
    }
};