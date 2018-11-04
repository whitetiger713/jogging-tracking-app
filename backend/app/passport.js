'use strict'
var passport = require('passport');
var User = require('./models/user');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require('../config/auth');
passport.use(new GoogleTokenStrategy({
	clientID: config.googleAuth.clientID,
	clientSecret: config.googleAuth.clientSecret
	},
	function (accessToken, refreshToken, profile, done) {
		var email = profile.emails[0].value;
		var provider = profile.provider;
		var name = profile.displayName;
		var picutre = profile._json.picture;
		User.findOne({
			email: email
		}, function (err, result) {
			if (!result) {
				var newUser = new User({
					name: name,
					email: email,
					picture: picutre,
					provider: provider,
					activity: 1
				});
				User.createUser(newUser, function (err, user) {		
					return done(err, user);
				});
			}
			else{
				return done(err,result);
			}

		});
	}
));

module.exports = passport;