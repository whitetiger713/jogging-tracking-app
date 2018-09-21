var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var JoggingSchema = new Schema({
	distance: {
		type: String,
		default: ''
	},
	startdate: {
		type:String,
		default: ''
	},
	enddate: {
		type: String,
		default: ''
	},
	commit: {
		type: String,
		default: ''
	},
	diff_time:{
		type: String,
		default: ''
	},
	email_id: {
		type: String,
		default: ''
	}
}, {
	timestamps: true
});

var Jogging = module.exports = mongoose.model('Jogging', JoggingSchema);