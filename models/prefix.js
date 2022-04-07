const mongoose = require('mongoose');

 const PrefixScheme = new mongoose.Schema({
 	GUILDID: {
 		type: String,
 		required: true
 	},
 	PREFIX: {
 		type: String,
 		required: true
 	}
 });

 const prefix = mongoose.model('prefix', PrefixScheme);
 module.exports = prefix;
