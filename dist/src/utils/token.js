"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const http_errors_1 = __importDefault(require("http-errors"));
class TokenUtil {
    constructor() {
        //FUnction to extract token as authorisation header
        this.extractTokenFromHeader = (req, next) => {
            try {
                if (_.get(req, 'headers.authorization')) {
                    let splitArr = req.headers['authorization'].split('Bearer');
                    return splitArr[1].trim();
                }
                else {
                    let error = http_errors_1.default(400, 'Cannot find Authorization header');
                    throw error;
                }
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.TokenUtil = TokenUtil;
//# sourceMappingURL=token.js.map