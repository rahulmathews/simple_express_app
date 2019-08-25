import {IAddress} from './address.interface';

export interface IUser{
    userName : string;
    password : string;
    emailId?: Array<{
        value : string
        primary : boolean
    }>;
    phone?: Array<{
        value : string
        primary : boolean
    }>;
    Address?: IAddress;
}