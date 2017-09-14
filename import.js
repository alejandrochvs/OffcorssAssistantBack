var xlsx = require('xlsx');
var fs = require('fs');


var workbook = xlsx.readFile('./e-cards.xlsx');
var json = []
var worksheet = workbook.Sheets[workbook.SheetNames[0]];
var subChaptCell, subChaptVal;
var first = 0;
var last = 115;
var cols = [{
    url: 'H',
    ref: 'K'
}, {
    url: 'J',
    ref: 'K'
}, {
    url: 'M',
    ref: 'N'
}, {
    url: 'P',
    ref: 'Q'
}];
var counter = 0;
for (var i = first; i < (last - 2); i++) {
    if (worksheet[cols[0].url + (i + 3)] != undefined) {
        json.push({});
        var j = 0;
        json[json.length - 1].url = [];
        while ((j < cols.length) && (worksheet[cols[j].url + (i + 3)] != undefined)) {
            json[json.length - 1].url[j] = {};
            // URL
            subChaptCell = worksheet[cols[j].url + (i + 3)];
            subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
            json[json.length - 1].url[j].path = subChaptVal + '.jpg';

            // References

            subChaptCell = worksheet[cols[j].ref + (i + 3)];
            subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
            if (subChaptCell != undefined) {
                if (isNaN(subChaptVal)) {
                    json[json.length - 1].url[j].reference = subChaptVal.split(',')
                } else {
                    json[json.length - 1].url[j].reference = [subChaptVal];
                }
            }

            j++;
        }
        // Gender

        subChaptCell = worksheet['B' + (i + 3)];
        subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
        json[json.length - 1].gender = subChaptVal;

        // Age

        subChaptCell = worksheet['A' + (i + 3)];
        subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
        if (subChaptVal == 'NINA' || subChaptVal == 'NINO') {
            subChaptVal = 'NIÑA-NIÑO';
        }
        json[json.length - 1].age = subChaptVal;

        // Occasions

        subChaptCell = worksheet['D' + (i + 3)];
        subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
        if (subChaptCell != undefined) {
            json[json.length - 1].occasion = subChaptVal.split(', ');
        }

        // Weather

        subChaptCell = worksheet['E' + (i + 3)];
        subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
        if (subChaptCell != undefined) {
            if (subChaptVal.split(', ') == 'NO MOSTRAR CLIMA') {
                json[json.length - 1].weather = ["FRÍO", "TEMPLADO", "CALIENTE"];
            } else {
                json[json.length - 1].weather = subChaptVal.split(', ');
            }
        }

        // Color

        /*subChaptCell = worksheet['G' + (i + 3)];
        subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
        if (subChaptCell != undefined) {
            json[json.length - 1].color = subChaptVal.split(', ');
        }*/

        // Type

        /*subChaptCell = worksheet['H' + (i + 3)];
        subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
        if (subChaptCell != undefined) {
            json[json.length - 1].type = subChaptVal.split(', ');
        }*/
    }
}

// Save JSON
fs.writeFile('e_cards.json', JSON.stringify(json), 'utf-8', function (err) {
    if (err) {
        return console.log(err);
    }
});

// DB load
var errArr = [];
var mongoose = require('mongoose');
mongoose.connect('mongodb://alejandrochvs:Sanrafael1@localhost:27017/assistant?authSource=admin');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    var e_cardsSchema = mongoose.Schema({
        url: Array,
        gender: String,
        age: String,
        occasion: Array,
        weather: Array,
        //        color: Array,
        //        type: Array
    });
    var e_cardModel = mongoose.model('e_cards', e_cardsSchema);
    for (var i = 0; i < json.length; i++) {
        var e_card = new e_cardModel({
            "url": json[i].url,
            "gender": json[i].gender,
            "age": json[i].age,
            "occasion": json[i].occasion,
            "weather": json[i].weather,
            //            "color": json[i].color,
            //            "type": json[i].type
        });
        e_card.save(function (err, e_card) {
            if (err) {
                var tempErr = err.errmsg.split('{')[1].split('"')[1].split('.')[0];
                if (errArr.indexOf(tempErr) < 0) {
                    errArr.push(tempErr);
                    fs.writeFile('err.json', JSON.stringify(errArr), 'utf-8', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('Err #' + errArr.length + ' - ' + errArr.reverse()[0]);
                    });
                }
            }
            //            console.log(e_card);
            return db.close();
        });
    }
});
