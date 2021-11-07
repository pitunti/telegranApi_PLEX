const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    id_plex:{
        type: String,
        required: true
    }

})

const db= mongoose.connection.useDb("telegram")

module.exports =db.model('Peliculas', Schema);