import mongoose, {Document} from 'mongoose';

import {IUser, IAddress} from '../interfaces';

const AddressSchema = new mongoose.Schema<IAddress>({
    name : {
        type : String,
        required : true,
        lowercase : true
    },
    street : {type : String},
    city  : {type : String},
    district : {type : String},
    state : {type : String},
    country : {type : String},
    pincode : {type : Number}
}, {_id : false});

const UserSchema = new mongoose.Schema<IUser>({
    username : {
        type : String,
        required : true,
        lowercase : true,
        index : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    userType : {type : String, enum : ['USER', 'ADMIN'], default : 'USER' },
    emailIds : [{
        value : {
            type: String,
            lowercase : true,
            unique : true
        },
        primary : {type : Boolean, default : false},
        _id : false
    }],
    phones : [{
        value : {
            type : String
        },
        primary : {type : Boolean, default : false},
        _id : false
    }],
    address : {AddressSchema}
    
}, {timestamps : true});

//methods

//Method to save/insert users
UserSchema.statics.insertUser = async(userObj : any) =>{
    return UserModel.create(userObj);
}

//Method to search for any query
UserSchema.statics.search = async(searchQuery : any) => {
    return UserModel.find(searchQuery);
}

//Method to search for single document
UserSchema.statics.searchOne = async(searchQuery : any) => {
    return UserModel.findOne(searchQuery);
}

//Method to update a single document
UserSchema.statics.updateOne = async(searchQuery : any, updateQuery : any) => {
    return UserModel.findOneAndUpdate(searchQuery, updateQuery);
}

interface IUserModel extends IUser, Document {};

export const UserModel = mongoose.model<IUserModel>('User', UserSchema);
