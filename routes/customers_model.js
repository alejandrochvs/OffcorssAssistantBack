var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var customersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age : {
        type : String,
        required : true
    },
    size_bottom: {
        type: String,
        required: true
    },
    size_top: {
        type: String,
        required: true
    },
    size_shoe: {
        type: String,
        required: true
    },
    occasion: {
        type: Array,
        required: true
    },
    weather: {
        type: Array,
        required: true
    },
    color: {
        type: Array,
        required: true
    },
    personality: {
        type: Array,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    e_card: {
        type: String,
        required: true
    },
    date : {
        type : Date,
        required : true
    }
});
var customers = mongoose.model('customers', customersSchema);
module.exports = customers;
