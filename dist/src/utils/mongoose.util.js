"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
class MongooseUtil {
    constructor() {
        //set options
        mongoose_1.default.set('useCreateIndex', true);
        mongoose_1.default.set('useNewUrlParser', true);
        mongoose_1.default.set('useFindAndModify', false);
        mongoose_1.default.set('runValidators', true);
        //mongodb connnection
        mongoose_1.default.connect(config_1.default.mongodb.connectionUrl);
        console.log("url->", config_1.default.mongodb.connectionUrl);
        let db = mongoose_1.default.connection;
        db.on("error", (err) => {
            console.log(err);
            // @ts-ignore
            process.exit(err.code || 1);
        });
        db.once("open", () => {
            console.log("Connection with database succeeded.");
        });
    }
}
exports.MongooseUtil = MongooseUtil;
//# sourceMappingURL=mongoose.util.js.map