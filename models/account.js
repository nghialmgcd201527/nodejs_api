//import mongoose
const mongoose = require('mongoose');
//write connection
mongoose.connect('mongodb+srv://nghialmgcd201527:leminhnghia@cluster0.uezsuzc.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    password: String
}, {
    collection: 'Account'
});

const AccountModel = mongoose.model('Account', AccountSchema);

for (let i = 0; i < 20; i++) {
    AccountModel.create({
        username: 'minhnghia_' + i,
        password: '123'
    })
}

module.exports = AccountModel;