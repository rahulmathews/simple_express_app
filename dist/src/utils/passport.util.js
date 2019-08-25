"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const models_1 = require("../models");
const config_1 = __importDefault(require("../config/config"));
const jwtStrategy = passport_jwt_1.default.Strategy;
const localStrategy = passport_local_1.default.Strategy;
const extractJwt = passport_jwt_1.default.ExtractJwt;
//Declare all the strategies here
//TODO: Add Redis to JWT strategy
class PassportUtil {
    constructor() {
        //Local Strategy
        passport_1.default.use(new localStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, async (username, password, done) => {
            try {
                let userDoc = await models_1.UserModel.searchOne({ username: username });
                let ifMatchedPwd = await bcrypt_1.default.compare(password, userDoc.password);
                if (ifMatchedPwd) {
                    return done(null, userDoc);
                }
                else {
                    return done('Invalid Username/Password');
                }
            }
            catch (err) {
                done(err);
            }
        }));
        //Jwt Strategy
        passport_1.default.use(new jwtStrategy({
            jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config_1.default.authentication.secretKey
        }, async (payload, done) => {
            try {
                let userDoc = await models_1.UserModel.searchOne({ _id: payload.userId });
                if (userDoc) {
                    if (Date.now() > payload.expires) {
                        let error = http_errors_1.default(401, 'Token Expired');
                        return done(error);
                    }
                    else {
                        return done(null, userDoc, payload);
                    }
                }
                else {
                    return done('Invalid Username/Password');
                }
            }
            catch (err) {
                done(err);
            }
        }));
        return passport_1.default;
    }
}
exports.PassportUtil = PassportUtil;
//# sourceMappingURL=passport.util.js.map