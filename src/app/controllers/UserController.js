const Comments = require('../models/Comments');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');


class userController {
    getLogin = async (req, res) => {
        res.render('user')
    }
    Login(req, res, next){
        const badRequest = 'There was an error with your request. Please check your information and try again.';

    //Query the database
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (err) return res.status(400).json({ message: badRequest })
        
        if (!user) return res.status(400).json({ message: 'Auth Failed. No User found with that email.' });

        //Check if password match
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (err) return res.status(400).json({ message: badRequest })
            
            if (!isMatch) return res.status(400).json({ message: 'Wrong password.' })
            

            user.genRefreshToken((err, user, refreshToken, accessToken) => {
                if (err) res.status(400).json({ message: badRequest })

                res
                    .cookie('refreshToken', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 24 * 3600000) })
                    .cookie('accessToken', accessToken, { httpOnly: true, expires: new Date(Date.now() + (60 * 15000)) })
                    .status(200)
                    .end();
                
            })
        })
     }
    )}
    Register(req, res, next) {
        if (!req.body.email) return res.status(404).end('Nothing send')
    
        const user = new User(req.body);
    
        User.findOne({
            $or: [
                { email: req.body.email },
            ]
        }).exec(function (err, userDoc) {
    
            if (userDoc && (userDoc.email === req.body.email)) return res.status(404).json({message: "Email is already in use"}) 
    
            user.genRefreshToken((err, user, refreshToken, accessToken) => {
                if (err) return res.status(404).end();
    
                const hostname = (process.env.NODE_ENV === 'production' ? req.hostname : `http://localhost:3000`)
    
                const msg = {
                    to: `${user.email}`,
                    from: 'Tai <19522572@gm.uit.edu.vn>',
                    subject: 'Verification Email',
                    text: `Hi ${user.firstname}, Please use this link to verify your email address: ${hostname}/verify-account/${user.email}/${refreshToken}`,
                    html: `
                    Hi ${user.firstname}, Please use this link to verify your email address:
                    <br><br>
                    ${hostname}/verify-account/${user.email}/${refreshToken}
                `,
                };
                //ES6
                sgMail
                    .send(msg)
                    .then(() => {
                        // console.log("Message sent!");
                    }, error => {
                        console.error(error);
    
                        if (error.response) return console.error(error.response.body)
    
                    });
    
    
                res
                    .cookie('refreshToken', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 24 * 3600000) })
                    .cookie('accessToken', accessToken, { httpOnly: true, expires: new Date(Date.now() + (60 * 10000)) })
                    .status(200)
                    .end();
            })
        });
    
    }
}

module.exports = new userController()