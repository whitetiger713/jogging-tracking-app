var User = require('./models/user');
var bcrypt = require('bcrypt');
var https = require('https');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "",
        pass: ""
    }
});
var rand,mailOptions,host,link, newUser;

function getUsers(res) {
	User.find(function (err, users) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
			res.send(err);
		}
		res.json(users); // return all todos in JSON format
	});
};

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
							newUser = new User({
								name: req.body.name,
								email: req.body.email,
								password: req.body.password,
							});
							User.createUser(newUser, function (err, user) {		
								if (err) {
									res.send(err);
								} else {
									res.send({
										'email': nreq.body.email,
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
						res.send({
							'state': 1,
							'message': "Successfully Login!"
						});
					} else {
						res.send({
							'state': 0,
							'email' : email,
							'message': "Password isn't correct!"
						});
					}
				});
			}
		});
	});
	app.get('/user/verify',function(req,res){
		if((req.protocol+"://"+req.get('host')) === ("http://"+host)){
			if(req.query.id==rand){
				console.log(req.body.email)
				User.updateOne({
					email: req.body.email
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
	// application -------------------------------------------------------------
	app.get('*', function (req, res) {
		res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};