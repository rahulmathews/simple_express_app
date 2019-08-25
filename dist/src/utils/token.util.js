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
const passport_1 = __importDefault(require("passport"));
class TokenUtil {
    constructor() {
        //Function to extract bearer token from authorisation header
        this.extractTokenFromHeader = (req, next) => {
            try {
                if (_.get(req, 'headers.authorization')) {
                    let splitArr = req.headers['authorization'].split('Bearer');
                    return splitArr[1].trim();
                }
                else {
                    // let error = createError(400, 'Cannot find Authorization header');
                    // throw error;
                }
            }
            catch (err) {
                next(err);
            }
        };
        this.extractPayloadOrUserDocFromHeader = async (req, param, next) => {
            try {
                let prom = new Promise(function (res, rej) {
                    passport_1.default.authenticate('jwt', { session: false }, function (err, user, info) {
                        if (err || !user) {
                            return rej(err);
                        }
                        if (param === 'USER_DOC') {
                            return res(user);
                        }
                        else {
                            return res(info);
                        }
                    })(req, res, next);
                });
                let userDoc = await prom;
                if (userDoc) {
                    return userDoc;
                }
            }
            catch (err) {
                next(err);
            }
        };
        //Middleware to extract session token from Session-Token header
        this.extractAndAlllocateSessionTokenFromHeader = (req, res, next) => {
            try {
                if (_.get(req, 'headers.session-token')) {
                    let sessionToken = req.headers['session-token'];
                    //@ts-ignore
                    req.sessionId = sessionToken;
                    return next();
                }
                else {
                    // let error = createError(400, 'Cannot find Authorization header');
                    // throw error;
                }
                return next();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.TokenUtil = TokenUtil;
//# sourceMappingURL=token.util.js.map