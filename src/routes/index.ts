import * as express from 'express';

import {CommonRouter} from './common.route';

const router = express.Router();

export class Router{
  public routerLocal : any;
  
  constructor(){
    /* Ping Api*/
    router.get('/ping', function(req, res, next) {
      res.send('pong');
    });

    //Common Routes
    const commonRoutes = new CommonRouter();
    router.use('/common', commonRoutes.router);

    this.routerLocal = router;
  }

}
