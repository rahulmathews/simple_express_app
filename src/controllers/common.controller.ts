import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import passport from 'passport';

import {UserModel} from '../models';
import {AuthMiddleware} from '../middlewares';
import {IUser} from '../interfaces';
import {TokenUtil} from '../utils';
import config from '../config/config';

interface IUserMod extends IUser{
    _id : Object
}

export class CommonController{

    constructor(){

    }

    registerUser = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const {username, password, email, phone, address} = _.get(req, 'body');
            const saltRounds = config.authentication.saltRounds;
            const hashedPwd = await bcrypt.hash(password, saltRounds);
            
            let insertObj = {
                username : username,
                password : hashedPwd,
                emailIds : [{
                    value : email,
                    primary : true
                }],
                phones : [{
                    value : phone,
                    primary : true
                }],
                address : address
            };

            let userDoc = await UserModel.insertUser(insertObj);
            if(userDoc){
                return res.status(200).json({message : 'Registered Successfully'});
            }
            else{
                return res.status(204).json({message : 'Registration Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }

    loginUser = (req : Request, res : Response, next : NextFunction) => {
        try{
            if(!_.get(req, "token")){
                let error = createError(500, 'Token Creation Failed')
                return next(error)
            }

            return res.status(200).json({message : 'Token Created Successfully', token : req['token'], sessionId : req['sessionId']});
            
        }
        catch(err){
            next(err);
        }
    }

    changePwd = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const {previousPassword, newPassword} = req.body;

            if(!previousPassword || _.isNil(previousPassword)){
                let error = createError(400, 'Previous Password is Invalid');
                throw error;
            }

            if(!newPassword || _.isNil(newPassword)){
                let error = createError(400, 'New Password is Invalid');
                throw error;
            }

            const tokenInstance = new TokenUtil();
            const token = tokenInstance.extractTokenFromHeader(req, next);

            if(!token){
                let error = createError(400, 'Not Implemented');//Implement Mail/Sms Sending feature.
                throw error
            }

            const tokenUtil = new TokenUtil();
            let userDoc = await tokenUtil.extractPayloadOrUserDocFromHeader(req, 'USER_DOC', next);

            if(userDoc){
                let ifMatchedPwd = await bcrypt.compare(previousPassword, userDoc.password);
                if(ifMatchedPwd){
                    const newPwd = newPassword.trim();
                    const saltRounds = config.authentication.saltRounds;
                    const hashedPwd = await bcrypt.hash(newPwd, saltRounds);

                    let updatedDoc = await UserModel.updateOne({_id : userDoc._id}, {
                        $set : {
                            password : hashedPwd
                        }
                    });

                    if(updatedDoc){
                        return res.status(200).json({
                            message : 'Updated Password Successfully', 
                        });
                    }
                    else{
                        let err =  createError(500, 'Update Password Failed');
                        throw err;
                    }
                }
                else{
                    let err = createError(400,'Previous Password does not match');
                    throw err;
                }
            };            
        }
        catch(err){
            next(err);
        }
    }

    logoutUser = async(req : Request, res : Response, next : NextFunction) =>{
        try{

        }
        catch(err){
            next(err);
        }
    }

}