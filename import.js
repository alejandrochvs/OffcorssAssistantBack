var xlsx = require('xlsx');
var fs = require('fs');
var workbook = xlsx.readFile('./excel.xlsx');
var json = []
var worksheet = workbook.Sheets[workbook.SheetNames[0]];
var subChaptCell, subChaptVal;
for (var i = 0; i < 50; i++) {
    json[i] = {};
    subChaptCell = worksheet['A' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    json[i].url = subChaptVal;
    subChaptCell = worksheet['C' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    json[i].gender = subChaptVal;
    subChaptCell = worksheet['D' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    json[i].age = subChaptVal;
    subChaptCell = worksheet['E' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    if (subChaptCell != undefined) {
        json[i].occasion = subChaptVal.split(', ');
    }
    subChaptCell = worksheet['F' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    if (subChaptCell != undefined) {
        json[i].weather = subChaptVal.split(', ');
    }
    subChaptCell = worksheet['G' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    if (subChaptCell != undefined) {
        json[i].color = subChaptVal.split(', ');
    }
    subChaptCell = worksheet['H' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    if (subChaptCell != undefined) {
        json[i].type = subChaptVal.split(', ');
    }
    subChaptCell = worksheet['I' + (i + 3)];
    subChaptVal = (subChaptCell ? subChaptCell.v : undefined);
    if (subChaptCell != undefined) {
        if (isNaN(subChaptVal)) {
            json[i].reference = subChaptVal.split(',')
        } else {
            json[i].reference = [subChaptVal];
        }
    }

}
fs.writeFile('e_cards.json', JSON.stringify(json), 'utf-8', function (err) {
    if (err) {
        return console.log(err);
    }
});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assistant');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    var e_cardsSchema = mongoose.Schema({
        url: String,
        gender: String,
        age: String,
        occasion: Array,
        weather: Array,
        color: Array,
        type: Array,
        reference: Array
    });
    var e_cardModel = mongoose.model('e_cards', e_cardsSchema);
    for (var i = 3; i < json.length; i++) {
        var e_card = new e_cardModel({
            "url": json[i].url,
            "gender": json[i].gender,
            "age": json[i].age,
            "occasion": json[i].occasion,
            "weather": json[i].weather,
            "color": json[i].color,
            "type": json[i].type,
            "reference": json[i].reference
        });
        e_card.save(function (err, e_card) {
            if (err) {
                db.close();
                return console.log(err);
            }
            console.log(e_card);
            return db.close();
        });
    }

});