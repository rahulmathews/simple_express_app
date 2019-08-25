import {Express, Request, Response, NextFunction} from 'express';
import * as _ from 'lodash';
import createError from 'http-errors';
import uuid from 'uuid/v4';
import moment from 'moment';

import {RedisUtil, TokenUtil} from '../utils';

export class SessionMiddleware{
    public sessionId : string;
    public redisUtil : RedisUtil;
    public tokenUtil : TokenUtil;
    
    constructor(){  
        this.sessionId = '';
        this.redisUtil = new RedisUtil();
        this.tokenUtil = new TokenUtil();
    }

    extractExistingSessionOrInitializeNewSession = async(req: Request | any, res: Response, next : NextFunction) => 
    {
        try{
            await this.refreshRedisSessions(); //Refresh all the redis session tokens
            if(req.sessionId){
                let sessionId = _.get(req, 'sessionId');
                let sessionObj = await this.getExistingSessionObj(sessionId);
                if(sessionObj.active){
                    return next();
                }
            }
            else{
                let sessionId = uuid();
                let sessionObj = {
                    sessionId : sessionId,
                    userId : req.user.userId
                };
                let saveSession = await this.saveNewSession(sessionObj);
                if(saveSession){
                    req.sessionId = sessionId;
                    return next();
                }
            }
        }
        catch(err){
            throw err;
        }
    }

    refreshRedisSessions = async() => {
        let sessions = await this.redisUtil.getValue('Sessions');
        if(!sessions){
            return ;
        }
        let parsedSessions = JSON.parse(sessions);
        let now = moment();

        let filteredParsedSessions = _.map(parsedSessions, function(sessionObj){
            let momentExpiryObj = moment(sessionObj.expiresAt);
            if(momentExpiryObj.diff(now, 's') <= 0){
                sessionObj.active = false;
            }
            return sessionObj;
        })
        let updatedSessions = await this.redisUtil.setKey('Sessions', filteredParsedSessions);
        if(updatedSessions === 'OK'){
            return true;
        }
        else{
            //return Error;
        }

    }

    getExistingSessionObj = async(sessionId : string) => {
        try{
            if(sessionId !== '' || !_.isNil(sessionId)){
                let sessions = await this.redisUtil.getValue('Sessions');
                let parsedSessions = JSON.parse(sessions);
                let sessionObj = _.find(parsedSessions, {sessionId : sessionId});
                if(!sessionObj.active){
                    return createError(400, 'Expired token');
                }
                else{
                    return sessionObj;
                }
            }
            else{
                //throw err
            }
        }
        catch(err){
            throw err;
        }
    }

    saveNewSession = async(obj) => {
        try{
            let sessions = await this.redisUtil.getValue('Sessions');
            if(!sessions){
                sessions = "[]";
            }
            let parsedSessions = JSON.parse(sessions);
            let date = moment();
            let days = 1;
            let dataToBePushed = {
                sessionId : obj.sessionId,
                active : true,
                lastLogin : new Date(),
                userId : obj.userId,
                expiresAt : date.add(days, 'day').toISOString()
            };

            parsedSessions.push(dataToBePushed);
            let updatedSessions = await this.redisUtil.setKey('Sessions', parsedSessions);
            if(updatedSessions === 'OK'){
                return true;
            }
            else{
                //return Error;
            }
        }
        catch(err){
            throw err;
        }
    }

    deleteSession = async(obj) => {
        try{
            let sessions = await this.redisUtil.getValue('Sessions');
            let parsedSessions = JSON.parse(sessions);
            let sessionObj = _.find(parsedSessions, {sessionId : obj.sessionId});
            if(sessionObj){
                let result = await this.redisUtil.deleteKey('')
            }
            else{
                return createError(500, 'Session Obj does not exists');
            }
        }
        catch(err){
            throw err;
        }
    }
}