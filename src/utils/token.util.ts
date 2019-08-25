import {Request, NextFunction} from 'express';
import * as _ from 'lodash';
import createError from 'http-errors';
import {IUser} from '../interfaces';
import passport from 'passport';

import {AuthMiddleware} from '../middlewares';

interface IUserMod extends IUser{
    _id : Object
}

export class TokenUtil{
    constructor(){

    }

    //Function to extract bearer token from authorisation header
    extractTokenFromHeader = (req : Request, next: NextFunction) => {
        try{
            if(_.get(req, 'headers.authorization')){
                let splitArr = req.headers['authorization'].split('Bearer');
                return splitArr[1].trim();
            }
            else{
                // let error = createError(400, 'Cannot find Authorization header');
                // throw error;
            }
        }
        catch(err){
            next(err);
        }
    }

    extractPayloadOrUserDocFromHeader = async(req : Request,param: string, next: NextFunction) => {
        try{
            let prom : Promise<IUserMod> = new Promise(function(res, rej){
                passport.authenticate('jwt', {session : false}, function(err, user, info){
                    if(err || !user){
                        return rej(err);
                    }
                    if(param === 'USER_DOC'){
                        return res(user);
                    }
                    else{
                        return res(info);
                    }
                })(req, res, next);
            });

            let userDoc = await prom;
            if(userDoc){
                return userDoc;
            }
        }
        catch(err){
            next(err);
        }
    }

    //Middleware to extract session token from Session-Token header
    extractAndAlllocateSessionTokenFromHeader = (req : Request, res: Response, next: NextFunction) => {
        try{
            if(_.get(req, 'headers.session-token')){
                let sessionToken = req.headers['session-token'];
                //@ts-ignore
                req.sessionId = sessionToken;
                return next();
            }
            else{
                // let error = createError(400, 'Cannot find Authorization header');
                // throw error;
            }
            return next();
        }
        catch(err){
            next(err);
        }
    }
}