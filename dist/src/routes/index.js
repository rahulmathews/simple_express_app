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
const common_route_1 = require("./common.route");
const router = express.Router();
class Router {
    constructor() {
        /* Ping Api*/
        router.get('/ping', function (req, res, next) {
            res.send('pong');
        });
        //Common Routes
        const commonRoutes = new common_route_1.CommonRouter();
        router.use('/common', commonRoutes.router);
        this.routerLocal = router;
    }
}
exports.Router = Router;
//# sourceMappingURL=index.js.map