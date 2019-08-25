"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AddressSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    street: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: Number }
}, { _id: false });
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    emailIds: [{
            value: {
                type: String,
                lowercase: true,
                unique: true
            },
            primary: { type: Boolean, default: false },
            _id: false
        }],
    phones: [{
            value: {
                type: String
            },
            primary: { type: Boolean, default: false },
            _id: false
        }],
    address: { AddressSchema }
}, { timestamps: true });
//methods
//Method to save/insert users
UserSchema.statics.insertUser = async (userObj) => {
    return exports.UserModel.create(userObj);
};
//Method to search for any query
UserSchema.statics.search = async (searchQuery) => {
    return exports.UserModel.find(searchQuery);
};
//Method to search for single document
UserSchema.statics.searchOne = async (searchQuery) => {
    return exports.UserModel.findOne(searchQuery);
};
//Method to update a single document
UserSchema.statics.updateOne = async (searchQuery, updateQuery) => {
    return exports.UserModel.findOneAndUpdate(searchQuery, updateQuery);
};
;
exports.UserModel = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=user.model.js.map