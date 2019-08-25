import express, {Express, Request, Response, NextFunction} from 'express';

import {CommonController} from '../controllers';
import {AuthMiddleware, SessionMiddleware} from '../middlewares';

const router = express.Router();

export class CommonRouter{
  public router : any;

  constructor(){
    const authMiddleware = new AuthMiddleware();
    const commonController = new CommonController();

	//Session Middleware
	let session = new SessionMiddleware();
	
	//Function to extract either the already existing session or create new session
    const sessionExtractionFn = async(req:Request, res: Response, next: NextFunction) => {
		//@ts-ignore
      	return await session.extractExistingSessionOrInitializeNewSession(req, res, next)
    }

    //Api to register users
    router.post('/register', 
      (req, res, next) => commonController.registerUser(req, res, next)
    );

    //Api to login users
    router.post('/login', 
      authMiddleware.authLocal,
      sessionExtractionFn,
      (req, res, next) => commonController.loginUser(req, res, next)
    );

    //Api to change password
    router.post('/changePwd',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => commonController.changePwd(req, res, next)
    );

    //Api to logout users
    router.post('/logout', 
	authMiddleware.authJwt,
	sessionExtractionFn,
    (req, res, next) => commonController.logoutUser(req, res, next)
    )

    this.router = router;
  }

}