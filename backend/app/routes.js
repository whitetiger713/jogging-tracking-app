var User = require('./models/user');
var Jogging = require('./models/jogging');
var bcrypt = require('bcrypt');
var https = require('https');
var crypto = require('crypto');
var passport = require('passport');
var { generateToken, sendToken } = require('./utils/token.utils');
var config = require('../config/auth');
// var smtpTransport = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: "",
//         pass: ""
//     }
// });
// https://nodemailer.com/about/
var rand,mailOptions,host,link;

var GoogleTokenStrategy = require('passport-google-token').Strategy;

passport.use(new GoogleTokenStrategy({
	clientID: config.googleAuth.clientID,
	clientSecret: config.googleAuth.clientSecret
	},
	function (accessToken, refreshToken, profile, done) {
			var email = profile.id;
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

module.exports = function (app) {
	
	// register users
	app.post('/user/register', function (req, res) {
		User.findOne({
			email: req.body.email
		}, function (err, result) {
			if (!result) {
				var email = req.body.email;
				var api_key = 'at_RWBXbuZqk5oBmcJsfcbJxsEWYK2SI';
				var api_url = 'https://emailverification.whoisxmlapi.com/api/v1?';
				var url = api_url + 'apiKey=' + api_key + '&emailAddress=' + email;

				https.get(url, function(response) {
					var str = '';
					var string = '';
					response.on('data', function(chunk) { str += chunk; });
					response.on('end', function() {
						string = JSON.parse(str);
						if( string.smtpCheck ){
							rand = crypto.randomBytes(16).toString('hex');
							host = req.get('host');
							link="http://"+req.get('host')+"/user/verify?id="+rand;
							console.log(rand);
							// mailOptions={
							// 	to : req.query.to,
							// 	subject : "Please confirm your Email account",
							// 	html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"	
							// }
							// smtpTransport.sendMail(mailOptions, function(error, response){
							// 	if(error) {
							// 		console.log(error);
							// 		res.end("error");
							// 	}
							// 	else {
							// 		console.log("Message sent: " + response.message);
							// 		res.end("sent");
							// 	}
							// });
							var picture = "http://localhost:8080/user_images/avatar.png"
							var newUser = new User({
								name: req.body.name,
								email: req.body.email,
								password: req.body.password,
								picture: picture
							});
							User.createUser(newUser, function (err, user) {		
								if (err) {
									res.send(err);
								} else {
									res.send({
										'email': req.body.email,
										'state': 1,
										'message': "Your account has been successfully created!"
									});
								}
							});
						}
						else {
							res.send({
								'state': 0,
								'message': "Your email is valid or non-existing email. Please check your email."
							});
						}
					});
				}).end();	
			} else {
				res.send({
					'state': 0,
					'message': "This email is existing Email!"
				});
			}
		});
	});
	app.post('/user/resetpass', function (req, res) {
		User.findOne({
			email: req.body.email
		}, function (err, result) {
			if (result) {
				var email = req.body.email;
				var newpass = req.body.newpass;
				var userpassword = result.password;
				var password = req.body.curpass;
				User.comparePassword(password, userpassword, function (err, isMatch) {
					if (err) throw err;
					if (isMatch) {
						bcrypt.genSalt(10, function (err, salt) {
							bcrypt.hash(newpass, salt, function (err, hash) {
								newpass = hash;
								User.updateOne({
									email: email
								}, {
									password: newpass
								}, function (err, result) {
									if (err) {
										res.send(err);
									} else {
										res.send({
											'state': 1,
											'message': "Reset Password!"
										});
									}
								});
							});
						});
					} else {
						res.send({
							'state': 0,
							'message': "Current Password isn't correct!"
						});
					}
				});

			} else {
				res.send({
					'state': 0,
					'message': "unregistered User!"
				});
			}
		});
	});
	//check user in login
	app.post('/user/login', function (req, res) {
		
		User.findOne({
			email: req.body.email,
		}, function (err, result) {
			if (!result) {
				res.send({
					'state': 0,
					'message': "There isn't Email Address!"
				});
			} else {
				var userpassword = result.password;
				var password = req.body.password;
				var email = req.body.email;
				User.comparePassword(password, userpassword, function (err, isMatch) {
					if (err) throw err;
					if (isMatch) {
						if(result.activity === 1){
							res.send({
								'state': 1,
								'email': result.email,
								'message': "Successfully Login!"
							});
						}
						else{
							res.send({
								'state': 0,
								'message': "Please contact Admin!"
							});
						}
						
					} else {
						res.send({
							'state': 0,
							'message': "Password isn't correct!"
						});
					}
				});
			}
		});
	});

	app.post('/user/fileupload', (req, res, next) => {
		let imageFile = req.files.file;
		var filename =  crypto.randomBytes(15).toString('hex');
		imageFile.mv(`${__dirname}/../public/user_images/${filename}.jpg`, function(err) {
			if (err) {
				return res.status(500).send(err);
			}
			User.updateOne({
				email: req.body.email
			}, {
				picture: `http://localhost:8080/user_images/${filename}.jpg`
			}, function (err, result) {
				if (err) {
					res.send(err);
				}
			});
			res.json({file: `user_images/${filename}.jpg`});
		});
	
	});

	//check user in login
	

	app.get('/user/verify',function(req,res){
		if((req.protocol+"://"+req.get('host')) === ("http://"+host)){
			if(req.query.id === rand){
				User.updateOne({
					email: req.query.email
				}, {
					activity: 1
				}, function (err, result) {
					if (err) {
						res.send(err);
					} else {
						res.send({
							'state': 1,
							'message': "Email is been Successfully verified"
						});
					}
				});
			}
			else {
				res.send({
					'state': 1,
					'message': "Taken is valid"
				});
			}
		}
		else {
			res.send({
				'state': 0,
				'message': "Request is from unknown source"
			});
		}
	});

	app.post('/user/google', passport.authenticate('google-token', {session: false}), function(req, res, next) {
		
		if (!req.user) {
				return res.send(401, 'User Not Authenticated');
		}
		req.auth = {
				id: req.user.id
		};
		next();
	}, generateToken, sendToken);
	
	app.get('/user/usersearch', function(req,res){
		User.findOne({
			email: req.query.key
		}, function (err, user) {
			if (user) {
				Jogging.find({
					email_id: user._id
				}, function (err, jogging) {
					if (jogging) {
						res.send({
							user: user,
							jogging: jogging
						});
					} 
					else {
						res.send({
							user: user,
							jogging: ''
						});
					}
				})
			}
			else {
				console.log(err);
			}
		});
	});
	app.post('/user/usersearch', function(req,res){
		User.findOne({
			email: req.body.email
		}, function (err, user) {
			if (user) {
				Jogging.find({
					email_id: user._id,
					startdate: { $gte: req.body.from },
					enddate: { $lte: req.body.to }
				}, function (err, jogging) {
					if (jogging) {
						res.send({
							user: user,
							jogging: jogging
						});
					} 
					else {
						res.send({
							user: user,
							jogging: ''
						});
					}
				})
			}
			else {
				console.log(err);
			}
		});
	});
	
	app.post('/jogging/add', function (req, res) {
		var data = req.body.joggingdata;
		var jogging = new Jogging(data);
		jogging.save(function(user){
			if (!user) {
				res.send({
					'state': 1,
					'message': "Successfully saved"
				});
			} 
			else {
				res.send({
					'state': 0,
					'message': "Error!"
				});
			}
		});
	});
	app.post('/jogging/update', function (req, res) {
		var data = req.body.joggingdata;
		Jogging.updateOne({
			_id: data.id,
		}, {
			distance: data.distance,
			startdate: data.startdate,
			enddate: data.enddate,
			commit: data.commit,
			diff_time: data.diff_time
		}, function (err, result) {
			if (!result) {
				res.send(err);
			} else {
				res.send({
					'state': 1,
					'message': "Successfully updated"
				});
			}
		});
	});
	app.post('/jogging/delete', function (req, res) {
		Jogging.remove({
			_id: req.body.id
		}, function (err, user) {
			if (!user){
				res.send({
					'state': 0,
					'message': "Error"
				});
			}
			else {
				res.send({
					'state': 1,
					'message': "Successfully Deleted"
				});
			}
		})
	});
	// application -------------------------------------------------------------
	app.get('*', function (req, res) {
		res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};