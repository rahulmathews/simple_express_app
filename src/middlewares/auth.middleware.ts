import {Promise} from 'bluebird';
import passport from 'passport'
import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import * as _ from 'lodash';

import config from '../config/config';
import {SessionMiddleware} from './session.middleware';

export class AuthMiddleware{
    constructor(){
        
    }

     //this includes both session initialisation and local verification strategy of passport
    authLocal = (req: Request & {
        token?: string,
        sessionId?: string
    }, res: Response, next: NextFunction) => {
        try{
            passport.authenticate('local', {session : false}, function(err, user, info){
                if(err || !user){
                    return next(err)
                }

                const JWT_EXPIRATION_MS = (24*60*60*1000).toString();

                const payload = {
                    username: user.username,
                    userId: user._id.toString(),
                    expires: Date.now() + parseInt(JWT_EXPIRATION_MS),
                };

                //Assign payload to req.user
                req.login(payload, {session : false}, function(err){
                    if(err){
                        return next(err)
                    }
                })

                const token = jwt.sign(JSON.stringify(payload), config.authentication.secretKey);
                req.token = token; // allocate token to req variable
                return next();

            })(req, res, next);
            // return next();
        }
        catch(err){
            next(err);
        }
    }

    authJwt = (req: Request, res: Response, next: NextFunction) => {
        try{
            passport.authenticate('jwt', {session : false}, function(err, user, info){
                if(err || !user){
                    return next(err);
                }
                return next();
            })(req, res, next);
        }
        catch(err){
            next(err);
        }
    }

}