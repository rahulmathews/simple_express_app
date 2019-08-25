import createError from 'http-errors';
import express, {Express} from 'express';
import cookieParser from 'cookie-parser';

import {Router} from './routes';
import './datasources';
import {PassportUtil, ErrorHandlerUtil, LoggerUtil, RedisUtil, TokenUtil} from './utils';
import { NextFunction } from 'connect';

export class App{
  private app: Express;

  constructor(){

    try{

      //Initialize Passport
      let passport = new PassportUtil();

      //Initialize Redis
      RedisUtil.initializeRedis();

      //Main Express App Module
      this.app = express();

      // view engine setup
      this.app.set('view engine', 'pug');

      //Initialize Logger
      let logger = new LoggerUtil(this.app);

      //Third Party middlewares
      // this.app.use(redis.handler);
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(cookieParser());

      //Middlewares for token-handlers
      let tokenUtil = new TokenUtil();
      //@ts-ignore
      this.app.use(tokenUtil.extractAndAlllocateSessionTokenFromHeader);

      //Initialize Router 
      const router = new Router();
      this.app.use('/', router.routerLocal);

      // catch 404 for routes which are not found and forward to error handler
      this.app.use(function(req, res, next) {
        next(createError(404));
      });

      //Initialize error handler
      let errorHandler = new ErrorHandlerUtil(this.app);

    }
    catch(err){
      throw err;
    }

  }

  //Method to start the express app
  public Start = (port: number) => {

    return new Promise((resolve, reject) => {
      this.app.listen(
        port,
        () => {
          resolve(port)
        })
        .on('error', (err: object) => reject(err));
    })
  }
}
