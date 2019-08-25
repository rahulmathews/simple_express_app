"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandlerUtil {
    constructor(app) {
        this.basicErrorHandler = () => {
            try {
                this.appLocal.use(function (err, req, res, next) {
                    // set locals, only providing error in development
                    res.locals.message = err.message;
                    res.locals.error = req.app.get('env') === 'development' ? err : {};
                    console.error(err);
                    // render the error page
                    return res.status(err.status || 500).json({ message: err.message });
                });
            }
            catch (err) {
                throw err;
            }
        };
        this.appLocal = app;
        this.basicErrorHandler();
    }
}
exports.ErrorHandlerUtil = ErrorHandlerUtil;
//# sourceMappingURL=errorhandler.util.js.map