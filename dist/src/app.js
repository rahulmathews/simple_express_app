"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./routes");
require("./datasources");
const utils_1 = require("./utils");
class App {
    constructor() {
        //Method to start the express app
        this.Start = (port) => {
            return new Promise((resolve, reject) => {
                this.app.listen(port, () => {
                    resolve(port);
                })
                    .on('error', (err) => reject(err));
            });
        };
        try {
            //Initialize Passport
            let passport = new utils_1.PassportUtil();
            //Initialize Redis
            utils_1.RedisUtil.initializeRedis();
            //Main Express App Module
            this.app = express_1.default();
            // view engine setup
            this.app.set('view engine', 'pug');
            //Initialize Logger
            let logger = new utils_1.LoggerUtil(this.app);
            //Third Party middlewares
            // this.app.use(redis.handler);
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: false }));
            this.app.use(cookie_parser_1.default());
            //Middlewares for token-handlers
            let tokenUtil = new utils_1.TokenUtil();
            //@ts-ignore
            this.app.use(tokenUtil.extractAndAlllocateSessionTokenFromHeader);
            //Initialize Router 
            const router = new routes_1.Router();
            this.app.use('/', router.routerLocal);
            // catch 404 for routes which are not found and forward to error handler
            this.app.use(function (req, res, next) {
                next(http_errors_1.default(404));
            });
            //Initialize error handler
            let errorHandler = new utils_1.ErrorHandlerUtil(this.app);
        }
        catch (err) {
            throw err;
        }
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map