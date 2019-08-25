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
const bcrypt = __importStar(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../config/config"));
class CommonController {
    constructor() {
        this.registerUser = async (req, res, next) => {
            try {
                const { username, password, email, phone, address } = _.get(req, 'body');
                const saltRounds = config_1.default.authentication.saltRounds;
                const hashedPwd = await bcrypt.hash(password, saltRounds);
                let insertObj = {
                    username: username,
                    password: hashedPwd,
                    emailIds: [{
                            value: email,
                            primary: true
                        }],
                    phones: [{
                            value: phone,
                            primary: true
                        }],
                    address: address
                };
                let userDoc = await models_1.UserModel.insertUser(insertObj);
                if (userDoc) {
                    return res.status(200).json({ message: 'Registered Successfully' });
                }
                else {
                    return res.status(204).json({ message: 'Registration Failed' });
                }
            }
            catch (err) {
                next(err);
            }
        };
        this.loginUser = (req, res, next) => {
            try {
                if (!_.get(req, "token")) {
                    let error = http_errors_1.default(500, 'Token Creation Failed');
                    return next(error);
                }
                return res.status(200).json({ message: 'Token Created Successfully', token: req['token'], sessionId: req['sessionId'] });
            }
            catch (err) {
                next(err);
            }
        };
        this.changePwd = async (req, res, next) => {
            try {
                const { previousPassword, newPassword } = req.body;
                if (!previousPassword || _.isNil(previousPassword)) {
                    let error = http_errors_1.default(400, 'Previous Password is Invalid');
                    throw error;
                }
                if (!newPassword || _.isNil(newPassword)) {
                    let error = http_errors_1.default(400, 'New Password is Invalid');
                    throw error;
                }
                const tokenInstance = new utils_1.TokenUtil();
                const token = tokenInstance.extractTokenFromHeader(req, next);
                if (!token) {
                    let error = http_errors_1.default(400, 'Not Implemented'); //Implement Mail/Sms Sending feature.
                    throw error;
                }
                const tokenUtil = new utils_1.TokenUtil();
                let userDoc = await tokenUtil.extractPayloadOrUserDocFromHeader(req, 'USER_DOC', next);
                if (userDoc) {
                    let ifMatchedPwd = await bcrypt.compare(previousPassword, userDoc.password);
                    if (ifMatchedPwd) {
                        const newPwd = newPassword.trim();
                        const saltRounds = config_1.default.authentication.saltRounds;
                        const hashedPwd = await bcrypt.hash(newPwd, saltRounds);
                        let updatedDoc = await models_1.UserModel.updateOne({ _id: userDoc._id }, {
                            $set: {
                                password: hashedPwd
                            }
                        });
                        if (updatedDoc) {
                            return res.status(200).json({
                                message: 'Updated Password Successfully',
                            });
                        }
                        else {
                            let err = http_errors_1.default(500, 'Update Password Failed');
                            throw err;
                        }
                    }
                    else {
                        let err = http_errors_1.default(400, 'Previous Password does not match');
                        throw err;
                    }
                }
                ;
            }
            catch (err) {
                next(err);
            }
        };
        this.logoutUser = async (req, res, next) => {
            try {
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.CommonController = CommonController;
//# sourceMappingURL=common.controller.js.map