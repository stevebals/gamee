var express 		= require('express');
var bodyParser 		= require('body-parser');
var passwordHash 	= require('password-hash');
var crypto 			= require('crypto');
var nodemailer 		= require('nodemailer');

var users = require('../models/users');
var resetPwdToken = require('../models/reset-token');
var token = require('../models/token');
var verifyEmail = require('../models/verifyEmail');

var meConfig = require('../mailConfig');

var router = express.Router();

//Todo: Use cross Domain in global
router.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
    next();
});

//router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function(req, res, next){
	var hashedPassword = passwordHash.generate(req.body.password);
    var userId = crypto.randomBytes(10).toString('hex');
    var email = req.body.email;
    var username = req.body.username;
    var mobile = req.body.mobile;

    users.find({email : email}, function (err, docs) {
        if (docs.length){
            res.send({error:"true","status":"already","message":"Email Already exists!.."});
        }else{
            var Users = new users({
                username:username,
                email:email,
                password:hashedPassword,
                mobile : mobile,
                userId:userId,
                isVerify: false
            });
            Users.save(function(err) {
                if (err){
                    res.status(500).send(err);
                }else{
                    var verifyToken = crypto.randomBytes(13).toString('hex');
                    var VerifyEmail = new verifyEmail({
                        email: email,
                        userId: userId,
                        token: verifyToken
                    });
                    VerifyEmail.save(function(err) {
                        if (err){
                            res.status(500).send(err);
                        }else{
                            sendMail("signUp",email,verifyToken);
                            res.send({"message":"Registered Successfully","error":false});
                        }
                    });
                }
            });
        }
    });
});



router.get('/verifyEmail',function(req, res, next) {
    var verifyToken = req.param('token');
    console.log(verifyToken);
    verifyEmail.find()
        .where('token').equals(verifyToken)
        .select('userId')
        .exec(function (err, doc){
            if(err){
                res.status(500).send({"message":"fail to verify","error":err});
            }else{
                console.log(doc);
                if(doc.length == 0){
                    //res.status(500).send({"message":"Not found"});
                    res.send({error:"true","message":"token not found"});
                }else{
                    users.findOneAndUpdate(
                        { userId: doc[0].userId },
                        {  $set: { isVerify: true}},
                        { upsert: false },
                        function(err, doc) {
                            if(err){
                                res.send({"message":"Fail to update user info","error":true});
                            }else{
                                res.send({"message":"Valid","error":false});
                                //TODO: Try to remove the verifyEmail token
                            }
                        });

                }
            }
        });
});



router.post('/login',function(req, res, next){
    email = req.body.email;
    password = req.body.password;

    users.find({email:email}, function(err, result){
        if(result.length){
            if(result[0].isVerify){
                if(passwordHash.verify(password, result[0].password)){
                    //set new token
                    var accessToken = crypto.randomBytes(10).toString('hex');
                    users.findOneAndUpdate(
                        { email: result[0].email },
                        {  $set: { token: accessToken}},
                        { upsert: false },
                        function(err, doc) {
                            if(err){
                                res.send({"message":"Fail to update user token","error":true});
                            }else{
                                res.send({"token":accessToken,"email":result[0].email,"message":"user found login correct","error":false});
                            }
                    });
                    
                }else{
                    res.send({"message":"invalid password","error":true});
                }
            }else{
                res.send({"message":"Email not verify","error":true});
            }
        }else{
            res.send({'error':true, 'message':'Email not Found..'});
        }
    });
});

router.post('/checkEmail', function(req, res, next){
    var email = req.body.email;
	users.find({email : email}, function (err, docs) {
        if (docs.length){
            if(doc[0].isVerify){
                res.send({error:"true","status":"already","message":"email found"});
            }else{

            }
        }else{
           res.send({error:"false","status":"no","message":"not email found"});
        }
    });
});


//send email
function sendMail(type,receivers,link){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: meConfig.sender,
            //pass: meConfig.pwd
            pass: 'mydreamwebsite7'
        }
    });
    var mailObj;
    if(type == "signUp"){
        mailObj = {
            /*from: meConfig.sender,
            to: receivers,
            subject:'Verify email',
            html : link*/
            from: meConfig.sender,
            to: receivers,
            subject:'Verify email',
            html : link
        };
    }else{
        mailObj = {
            /*from: meConfig.sender,
            to: receivers,
            subject:'Reset password link',
            html : link*/
            from:  meConfig.sender,
            to: receivers,
            subject:'Reset password link',
            html : link
        };
    }
    transporter.sendMail(mailObj, function(error, info){
        if(error){
            console.log('Incorrect email or password');
            console.log(error);
        }else{
            console.log(info);
        }
    });
}


module.exports = router;
