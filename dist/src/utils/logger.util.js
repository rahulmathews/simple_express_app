"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
class LoggerUtil {
    constructor(app) {
        this.basicLogger = (app) => {
            try {
                const logger = {
                    write: function (msg) {
                        console.log(msg.trimRight());
                    }
                };
                app.use(morgan_1.default(':method :url :status :response-time ms', { stream: logger }));
            }
            catch (err) {
                throw err;
            }
        };
        this.basicLogger(app);
    }
}
exports.LoggerUtil = LoggerUtil;
//# sourceMappingURL=logger.util.js.map