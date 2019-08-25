import * as express from 'express';
const router = express.Router();

class UserRouter{
  public router : any;
  
  constructor(){
    /* Ping Api*/
    router.get('/ping', function(req, res, next) {
      res.send('pong');
    });

    this.router = router;
  }

}

export default UserRouter;