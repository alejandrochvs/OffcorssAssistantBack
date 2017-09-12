var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var occasionsArrSchema = new Schema({
    arr: [{
        title: {
            type: String
        },
        desc: {
            type: String
        },
        img: {
            type: String
        },
        query: {
            type: String
        },
        color: {
            type: String
        }
          }, {
        title: {
            type: String
        },
        desc: {
            type: String
        },
        img: {
            type: String
        },
        query: {
            type: String
        },
        color: {
            type: String
        }
          }, {
        title: {
            type: String
        },
        desc: {
            type: String
        },
        img: {
            type: String
        },
        query: {
            type: String
        },
        color: {
            type: String
        }
          }, {
        title: {
            type: String
        },
        desc: {
            type: String
        },
        img: {
            type: String
        },
        query: {
            type: String
        },
        color: {
            type: String
        }
          }, {
        title: {
            type: String
        },
        desc: {
            type: String
        },
        img: {
            type: String
        },
        query: {
            type: String
        },
        color: {
            type: String
        }
          }, {
        title: {
            type: String
        },
        desc: {
            type: String
        },
        img: {
            type: String
        },
        query: {
            type: String
        },
        color: {
            type: String
        }
          }]
});
module.exports = mongoose.model('occasionsArr', occasionsArrSchema);
