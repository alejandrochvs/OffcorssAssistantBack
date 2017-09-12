var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var occasionsSchema = new Schema({
    boy: {
        newborn: {
            type: Array
        },
        baby: {
            type: Array
        },
        boy: {
            type: Array
        }
    },
    girl: {
        newborn: {
            type: Array
        },
        baby: {
            type: Array
        },
        boy: {
            type: Array
        }
    }
});
module.exports = mongoose.model('occasions', occasionsSchema);
