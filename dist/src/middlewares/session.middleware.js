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
const v4_1 = __importDefault(require("uuid/v4"));
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../utils");
class SessionMiddleware {
    constructor() {
        this.extractExistingSessionOrInitializeNewSession = async (req, res, next) => {
            try {
                await this.refreshRedisSessions(); //Refresh all the redis session tokens
                if (req.sessionId) {
                    let sessionId = _.get(req, 'sessionId');
                    let sessionObj = await this.getExistingSessionObj(sessionId);
                    if (sessionObj.active) {
                        return next();
                    }
                }
                else {
                    let sessionId = v4_1.default();
                    let sessionObj = {
                        sessionId: sessionId,
                        userId: req.user.userId
                    };
                    let saveSession = await this.saveNewSession(sessionObj);
                    if (saveSession) {
                        req.sessionId = sessionId;
                        return next();
                    }
                }
            }
            catch (err) {
                throw err;
            }
        };
        this.refreshRedisSessions = async () => {
            let sessions = await this.redisUtil.getValue('Sessions');
            if (!sessions) {
                return;
            }
            let parsedSessions = JSON.parse(sessions);
            let now = moment_1.default();
            let filteredParsedSessions = _.map(parsedSessions, function (sessionObj) {
                let momentExpiryObj = moment_1.default(sessionObj.expiresAt);
                if (momentExpiryObj.diff(now, 's') <= 0) {
                    sessionObj.active = false;
                }
                return sessionObj;
            });
            let updatedSessions = await this.redisUtil.setKey('Sessions', filteredParsedSessions);
            if (updatedSessions === 'OK') {
                return true;
            }
            else {
                //return Error;
            }
        };
        this.getExistingSessionObj = async (sessionId) => {
            try {
                if (sessionId !== '' || !_.isNil(sessionId)) {
                    let sessions = await this.redisUtil.getValue('Sessions');
                    let parsedSessions = JSON.parse(sessions);
                    let sessionObj = _.find(parsedSessions, { sessionId: sessionId });
                    if (!sessionObj.active) {
                        return http_errors_1.default(400, 'Expired token');
                    }
                    else {
                        return sessionObj;
                    }
                }
                else {
                    //throw err
                }
            }
            catch (err) {
                throw err;
            }
        };
        this.saveNewSession = async (obj) => {
            try {
                let sessions = await this.redisUtil.getValue('Sessions');
                if (!sessions) {
                    sessions = "[]";
                }
                let parsedSessions = JSON.parse(sessions);
                let date = moment_1.default();
                let days = 1;
                let dataToBePushed = {
                    sessionId: obj.sessionId,
                    active: true,
                    lastLogin: new Date(),
                    userId: obj.userId,
                    expiresAt: date.add(days, 'day').toISOString()
                };
                parsedSessions.push(dataToBePushed);
                let updatedSessions = await this.redisUtil.setKey('Sessions', parsedSessions);
                if (updatedSessions === 'OK') {
                    return true;
                }
                else {
                    //return Error;
                }
            }
            catch (err) {
                throw err;
            }
        };
        this.deleteSession = async (obj) => {
            try {
                let sessions = await this.redisUtil.getValue('Sessions');
                let parsedSessions = JSON.parse(sessions);
                let sessionObj = _.find(parsedSessions, { sessionId: obj.sessionId });
                if (sessionObj) {
                    let result = await this.redisUtil.deleteKey('');
                }
                else {
                    return http_errors_1.default(500, 'Session Obj does not exists');
                }
            }
            catch (err) {
                throw err;
            }
        };
        this.sessionId = '';
        this.redisUtil = new utils_1.RedisUtil();
        this.tokenUtil = new utils_1.TokenUtil();
    }
}
exports.SessionMiddleware = SessionMiddleware;
//# sourceMappingURL=session.middleware.js.map