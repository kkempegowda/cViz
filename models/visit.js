'use strict';

var mongoose = require('mongoose')
, _ = require('underscore')
, Schema = mongoose.Schema;

var userSchema 				= require('./user');
var clientSchema 			= require('./client');

var visitSchema = new mongoose.Schema({

	title						    : { type: String },
	client 						    : { type: Schema.Types.ObjectId, ref: 'clients' },//{ type: String },
	agenda							: { type: String },
	agm								: { type: Schema.Types.ObjectId, ref: 'User' },
	anchor							: { type: Schema.Types.ObjectId, ref: 'User' },
	schedule						: [{
		startDate					: { type: Date},//, default: Date.now },
		endDate						: { type: Date},//, default: Date.now },
		location					: { type: String }  // set of csc locations
	}],
	visitors						: [{
		visitor						: { type: Schema.Types.ObjectId, ref: 'User' },
		influence					: { type: String, lowercase: true, trim: true },		// {Decision Maker, Influencer, End User, Others}
	}],
	interest						: {
		businessType			    : { type: String, lowercase: true, trim: true },		// {new, repeat}
		visitType					: { type: String, lowercase: true, trim: true },		// {new, repeat}
		objective					: { type: String }
	},
	status							: { type: String, lowercase: true, trim: true },		// {confirmed, tentative, freeze, done}
	createBy						: { type: Schema.Types.ObjectId, ref: 'User' },
	createOn						: { type: Date, default: Date.now }

});

visitSchema.post('init', function(doc) {

	var schedules =  _.sortBy( doc.schedule, 'startDate' );
	var startDate = schedules[0].startDate;
	var endDate = schedules[schedules.length-1].endDate;
	var locations = "";

	schedules.forEach(function(sch){
		if(locations === "")
		 locations = sch.location;
	 else
		 locations = locations + ", " + sch.location;
	})

	// add temporary variable to be added to doc
	doc.set( "locations", locations, { strict: false });
	doc.set( "startDate", startDate, { strict: false });
	doc.set( "endDate", endDate, { strict: false });
});

module.exports = mongoose.model('visits', visitSchema);