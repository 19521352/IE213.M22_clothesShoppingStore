const User = require('../models/User');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const authTokens = {};
class userController {
    getLogin = async (req, res) => {
        res.render('user')
    }
    Login = async(req, res) => {
        const password = req.body.password
        const emails = req.body.email
        const authToken = crypto.randomBytes(30).toString('hex')
        console.log(emails)
        User.findOne({email:emails}).exec()
        .then(data => {
            if(bcrypt.compareSync(password, data.password))
            {
                
                authTokens[authToken] = req.body.email
                res.cookie('AuthToken', authToken).render('home')
                console.log(authTokens)    
                console.log('1111') 
            }
            else {
                res.render('home', {
                    status: 'Sai username hoac password',
                    class:'error'
                });
            }
        })
        .catch((error) => {
            res.render('user',{status : 'Tai khoan khong ton tai !!!!' ,class : 'error'})
        })
    }
    Register(req, res, next) {
        const usr = req.body;
        const pass = bcrypt.hashSync(usr.password,12)
        
        User.findOne({email: usr.email}).exec()
        .then((data)=>
            {
                if(data){
                    res.render('user',{status : 'Tai khoan da ton tai !!!!' ,class : 'error'})
                }
                else{
                    const user = new User(
                        {
                            _id : usr.email,
                            email : usr.email,
                            password : pass,
                            name : usr.name
                        }
                    );
                    user.save()
                    .then(data => {
                        res.render('user', {status : 'Tao tai khoan thanh cong <3 ',class:'success'});
                    })
                    .catch((error) => {
                        res.render('user',{status : 'Tai khoan da ton tai !!!!' ,class : 'error'})
                    })
                }
            }

        )
        .catch((error) => {
            res.render('user',{status : 'Tai khoan da ton tai !!!!' ,class : 'error'})
        })
    
    }
    requireAuth(req, res, next){
        const authToken = req.cookies['AuthToken'];
        req.user = authTokens[authToken];
        
        if (req.user) {
            next();
        } else {
            res.render('user', {
                message: 'Please login to continue',
                messageClass: 'alert-danger'
            });
        }
    };
}

module.exports = new userController()