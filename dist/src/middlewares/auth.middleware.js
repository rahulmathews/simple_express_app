"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
class AuthMiddleware {
    constructor() {
        //this includes both session initialisation and local verification strategy of passport
        this.authLocal = (req, res, next) => {
            try {
                passport_1.default.authenticate('local', { session: false }, function (err, user, info) {
                    if (err || !user) {
                        return next(err);
                    }
                    const JWT_EXPIRATION_MS = (24 * 60 * 60 * 1000).toString();
                    const payload = {
                        username: user.username,
                        userId: user._id.toString(),
                        expires: Date.now() + parseInt(JWT_EXPIRATION_MS),
                    };
                    //Assign payload to req.user
                    req.login(payload, { session: false }, function (err) {
                        if (err) {
                            return next(err);
                        }
                    });
                    const token = jsonwebtoken_1.default.sign(JSON.stringify(payload), config_1.default.authentication.secretKey);
                    req.token = token; // allocate token to req variable
                    return next();
                })(req, res, next);
                // return next();
            }
            catch (err) {
                next(err);
            }
        };
        this.authJwt = (req, res, next) => {
            try {
                passport_1.default.authenticate('jwt', { session: false }, function (err, user, info) {
                    if (err || !user) {
                        return next(err);
                    }
                    return next();
                })(req, res, next);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map