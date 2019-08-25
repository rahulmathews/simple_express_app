"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
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
            secretOrKey: 'secret'
        }, async (payload, done) => {
            try {
                let userDoc = await models_1.UserModel.searchOne({ username: payload.username });
                if (userDoc) {
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
        return passport_1.default;
    }
}
exports.PassportUtil = PassportUtil;
//# sourceMappingURL=passport.js.map