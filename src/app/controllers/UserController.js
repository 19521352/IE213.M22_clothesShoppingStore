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
        User.findOne({email:emails}).exec()
        .then(data => {
            if(bcrypt.compareSync(password, data.password))
            {
                authTokens[authToken] = req.body.email
                res.cookie('AuthToken', authToken, { maxAge: 9000000000, httpOnly: true }).redirect("/")
            }
            else {
                res.render('home', {
                    status: 'Sai username hoặc password',
                    class:'error'
                });
            }
        })
        .catch((error) => {
            res.render('user',{status : 'Tài khoản không tồn tại !!!!' ,class : 'error'})
        })
    }
    Register(req, res, next) {
        const usr = req.body;
        const pass = bcrypt.hashSync(usr.password,12)
        
        User.findOne({email: usr.email}).exec()
        .then((data)=>
            {
                if(data){
                    res.render('user',{status : 'Tài khoản đã tồn tại !!!!' ,class : 'error'})
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
                        res.render('user', {status : 'Tạo tài khoản thành công <3 ',class:'success'});
                    })
                    .catch((error) => {
                        res.render('user',{status : 'Tài khoản đã tồn tại !!!!' ,class : 'error'})
                    })
                }
            }

        )
        .catch((error) => {
            res.render('user',{status : 'Tài khoản đã tồn tại !!!!' ,class : 'error'})
        })
    
    }
    requireAuth(req, res, next){
        const authToken = req.cookies['AuthToken'];
        req.user = authTokens[authToken];

        if (req.user) {
            next();
        } else {
            res.render('user', {
                status : 'Hãy đăng nhập hoặc đăng kí để tiếp tục',
                class : 'error'
            });
        }
    };
}

module.exports = new userController()