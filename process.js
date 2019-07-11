const fs = require("fs");
const dataIn = require('./qaData.json');
const dataOut = [];
const values = [];

function formatData(callback) {
    let i = 0;
    dataIn.forEach(element => {
        let value = {
            "id": element.id,
            "name": {
                "value": formatId(element.questions[0]),
                "synonyms": []
            }
        }

        values.push(value);

    });

    console.log(JSON.stringify(values));
    //dataOut.push(item);
}


function formatId(idRaw) {
    let id = idRaw.toString()
        .toLowerCase()
        .replace('?', '');

    var i = 0, strLength = id.length;

    for (i; i < strLength; i++) {

        //id = id.replace(" ", "-"); 
    }

    return id;
}

formatData();