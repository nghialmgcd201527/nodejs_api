//import mongoose
const mongoose = require('mongoose');
//write connection
mongoose.connect('mongodb+srv://nghialmgcd201527:leminhnghia@cluster0.uezsuzc.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    password: String,
    role: String
}, {
    collection: 'Account'
});

const AccountModel = mongoose.model('Account', AccountSchema);

module.exports = AccountModel;