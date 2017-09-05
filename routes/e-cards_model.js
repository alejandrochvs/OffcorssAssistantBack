var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eCardsSchema = new Schema({
    url: [
        {
            path: {
                type: String
            },
            reference: {
                type: String
            }
        }
    ],
    gender: {
        type: String,
    },
    age: {
        type: String,
    },
    color: {
        type: Array,
    },
    weather: {
        type: Array,
    },
    occasion: {
        type: Array,
    }
});
module.exports = mongoose.model('e_cards', eCardsSchema);
