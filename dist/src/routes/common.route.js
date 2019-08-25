"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
class CommonRouter {
    constructor() {
        const authMiddleware = new middlewares_1.AuthMiddleware();
        const commonController = new controllers_1.CommonController();
        //Session Middleware
        let session = new middlewares_1.SessionMiddleware();
        //Function to extract either the already existing session or create new session
        const sessionExtractionFn = async (req, res, next) => {
            //@ts-ignore
            return await session.extractExistingSessionOrInitializeNewSession(req, res, next);
        };
        //Api to register users
        router.post('/register', (req, res, next) => commonController.registerUser(req, res, next));
        //Api to login users
        router.post('/login', authMiddleware.authLocal, sessionExtractionFn, (req, res, next) => commonController.loginUser(req, res, next));
        //Api to change password
        router.post('/changePwd', authMiddleware.authJwt, sessionExtractionFn, (req, res, next) => commonController.changePwd(req, res, next));
        //Api to logout users
        router.post('/logout', authMiddleware.authJwt, sessionExtractionFn, (req, res, next) => commonController.logoutUser(req, res, next));
        this.router = router;
    }
}
exports.CommonRouter = CommonRouter;
//# sourceMappingURL=common.route.js.map