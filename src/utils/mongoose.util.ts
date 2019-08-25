import mongoose from 'mongoose';

import config from '../config/config';

export class MongooseUtil{
    
    constructor(){
        //set options
        mongoose.set('useCreateIndex', true);
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('runValidators', true);

        //mongodb connnection
        mongoose.connect(config.mongodb.connectionUrl);
        console.log("url->", config.mongodb.connectionUrl);
        let db = mongoose.connection;

        db.on("error", (err: Error) => {
            console.log(err);
            // @ts-ignore
            process.exit(err.code || 1);
        });

        db.once("open", () => {
            console.log("Connection with database succeeded.");
        });
        
    }


}