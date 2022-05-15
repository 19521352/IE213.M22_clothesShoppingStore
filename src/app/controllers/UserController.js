const User = require('../models/User');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

class userController {
    getLogin = async (req, res) => {
        res.render('user')
    }
    Login(req, res, next){
        
    }
    Register(req, res, next) {
        const usr = req.body;
        const pass = bcrypt.hashSync(usr.password,12)
        
        User.findOne({email: usr.email}).exec()
        .then((data)=>
            {
                if(data){
                    throw new Error();
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
                        res.redirect('/login')
                    })
                    .catch((error) => {
                        res.status(error.status)
                    })
                }
            }

        )
        .catch((error) => {
            res.status(error.status)
        })
    
    }
}

module.exports = new userController()