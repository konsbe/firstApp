const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');



const UserSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthDay: {
        type: Date,
        required: true
    }
    
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});


module.exports = mongoose.model('User', UserSchema);




