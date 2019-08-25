"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const bluebird_1 = require("bluebird");
const _ = __importStar(require("lodash"));
const http_errors_1 = __importDefault(require("http-errors"));
//Promisified redis functions
bluebird_1.Promise.promisifyAll(redis_1.default.RedisClient.prototype);
bluebird_1.Promise.promisifyAll(redis_1.default.Multi.prototype);
class RedisUtil {
    constructor() {
        this.setKey = async (key, value) => {
            try {
                //validations for key-value pair
                if (_.isNil(key) || _.isNil(value)) {
                    return http_errors_1.default(500, 'Invalid key-value pair');
                }
                if (key === '') {
                    return http_errors_1.default(500, 'Empty key');
                }
                if (value === '') {
                    return http_errors_1.default(500, 'Empty value');
                }
                if (!_.isString(value)) {
                    value = JSON.stringify(value);
                }
                let prom = null;
                let keyArr = key.split('.');
                if (keyArr.length === 1) {
                    //@ts-ignore
                    prom = RedisUtil.client.setAsync(key, value);
                }
                else {
                    let valueOfRootKey = await this.getValue(keyArr[0]);
                    keyArr.shift();
                    let keyMod = keyArr.join();
                    let jsonVal = JSON.parse(valueOfRootKey);
                    _.set(jsonVal, keyMod, value);
                    //@ts-ignore
                    prom = RedisUtil.client.setAsync(keyArr[0], jsonVal);
                }
                //@ts-ignore
                return prom
                    .then(function (res) {
                    return res;
                })
                    .catch(function (err) {
                    return err;
                });
            }
            catch (err) {
                throw err;
            }
        };
        this.getValue = async (key) => {
            try {
                //validation for key
                if (key === '') {
                    return http_errors_1.default(500, 'Empty key');
                }
                let prom = null;
                let keyArr = key.split('.');
                if (keyArr.length === 1) {
                    //@ts-ignore
                    prom = RedisUtil.client.getAsync(key);
                }
                else {
                    //@ts-ignore
                    prom = RedisUtil.client.getAsync(keyArr[0])
                        .then(function (res) {
                        let jsonVal = JSON.parse(res);
                        keyArr.shift();
                        let keyMod = keyArr.join();
                        let value = _.get(jsonVal, keyMod);
                        return value;
                    })
                        .catch(function (err) {
                        return err;
                    });
                }
                //@ts-ignore
                return prom
                    .then(function (res) {
                    return res;
                })
                    .catch(function (err) {
                    return err;
                });
            }
            catch (err) {
                throw err;
            }
        };
        this.deleteKey = async (key) => {
            try {
                //validation for key
                if (key === '') {
                    return http_errors_1.default(500, 'Empty key');
                }
                let prom = null;
                let keyArr = key.split('.');
                if (keyArr.length === 1) {
                    //@ts-ignore
                    prom = RedisUtil.client.delAsync(key);
                }
                else {
                    //@ts-ignore
                    prom = RedisUtil.client.getAsync(keyArr[0])
                        .then(function (res) {
                        let jsonVal = JSON.parse(res);
                        if (_.unset(jsonVal, key)) {
                            return this.setAsync(keyArr[0], JSON.stringify(jsonVal));
                        }
                        else {
                            return http_errors_1.default(500, 'Deletion failed');
                        }
                    })
                        .then(function (setResponse) {
                        return setResponse;
                    })
                        .catch(function (err) {
                        return err;
                    });
                }
                //@ts-ignore
                return prom
                    .then(function (res) {
                    return res;
                })
                    .catch(function (err) {
                    return err;
                });
            }
            catch (err) {
                throw err;
            }
        };
    }
}
RedisUtil.initializeRedis = async () => {
    try {
        RedisUtil.client = redis_1.default.createClient();
        RedisUtil.prom = new bluebird_1.Promise((res, rej) => {
            RedisUtil.client.on("error", function (err) {
                console.log("Error Connecting to redis");
                process.exit(1);
                rej(err); //No need of rejection as process is terminated
            });
            RedisUtil.client.on("connect", function () {
                console.log("Successfully Connected to redis");
                this.isConnected = true;
                res();
            });
        });
        await RedisUtil.prom; // Await for this promise
    }
    catch (err) {
        console.error(err);
        process.exit(1);
        // throw err;
    }
};
exports.RedisUtil = RedisUtil;
//# sourceMappingURL=redis.util.js.map