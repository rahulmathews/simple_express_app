"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express.Router();
class CommonRouter {
    constructor() {
        const authMiddleware = new middlewares_1.AuthMiddleware();
        const commonController = new controllers_1.CommonController();
        //Api to register users
        router.post('/register', (req, res, next) => commonController.registerUser(req, res, next));
        //Api to login users
        router.post('/login', authMiddleware.authLocal, (req, res, next) => commonController.loginUser(req, res, next));
        //Api to change password
        router.post('/changePwd', 
        // authMiddleware.authJwt,
        (req, res, next) => commonController.changePwd(req, res, next));
        //Api to logout users
        router.post('/logout', authMiddleware.authJwt, (req, res, next) => commonController.logoutUser(req, res, next));
        this.router = router;
    }
}
exports.CommonRouter = CommonRouter;
//# sourceMappingURL=common.routes.js.map