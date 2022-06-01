const User = require('../models/User')
const Product = require('../models/Product')
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require('../../util/mongoose')
const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const Handlebars = require('handlebars')
const app = require('express')
const { getPrice } = require('../../util/products/show')
const authTokens = {}

class userController {
  getLogin = async (req, res) => {
    res.render('user', { layout: 'no-left-sidebar' })
  }
  Login = async (req, res) => {
    const ogUrl = req.query.ogUrl || '/'
    const password = req.body.password
    const emails = req.body.email
    const authToken = crypto.randomBytes(30).toString('hex')
    User.findOne({ email: emails })
      .exec()
      .then((data) => {
        if (bcrypt.compareSync(password, data.password)) {
          authTokens[authToken] = req.body.email
          Product.find({})
            .exec()
            .then((clothesItems) => {
              res
                .cookie('AuthToken', authToken, {
                  maxAge: 9000000000,
                  httpOnly: true,
                })
                .redirect(ogUrl)
            })
        } else {
          res.render('user', {
            status: 'Sai username hoặc password',
            class: 'error',
            layout: 'no-left-sidebar',
          })
        }
      })
      .catch((error) => {
        res.render('user', {
          status: 'Tài khoản không tồn tại !!!!',
          class: 'error',
          layout: 'no-left-sidebar',
        })
      })
  }
  Register(req, res, next) {
    const usr = req.body
    const pass = bcrypt.hashSync(usr.password, 12)

    User.findOne({ email: usr.email })
      .exec()
      .then((data) => {
        if (data) {
          res.render('user', {
            status: 'Tài khoản đã tồn tại !!!!',
            class: 'error',
            layout: 'no-left-sidebar',
          })
        } else {
          const user = new User({
            _id: usr.email,
            email: usr.email,
            password: pass,
            name: usr.name,
          })

          user
            .save()
            .then((data) => {
              res.render('user', {
                status: 'Tạo tài khoản thành công <3 ',
                class: 'success',
                layout: 'no-left-sidebar',
              })
            })
            .catch((error) => {
              res.render('user', {
                status: 'Tài khoản đã tồn tại !!!!',
                class: 'error',
                layout: 'no-left-sidebar',
              })
            })
        }
      })
      .catch((error) => {
        res.render('user', {
          status: 'Tài khoản đã tồn tại !!!!',
          class: 'error',
          layout: 'no-left-sidebar',
        })
      })
  }
  changePass(req, res, next) {
    const newPassword = req.body.REpassword
    const user = req.user
    const Password = bcrypt.hashSync(newPassword, 12)
    User.findOne({ email: user })
      .exec()
      .then((data) => {
        console.log(data.password)
        if (bcrypt.compareSync(req.body.password, data.password)) {
          User.findOneAndUpdate(
            {
              email: user,
            },
            {
              password: Password,
            },
            {
              returnOriginal: false,
            }
          )
            .then((data) => {
              console.log(data.password)
              res.render('profile', {
                css: 'css/profile.css',
                status: 'Thay đổi mật khẩu thành công ',
                class: 'success',
                layout: 'no-left-sidebar',
                userInfo: mongooseToObject(data),
                user: req.user,
                isLogin: req.user,
              })
            })
            .catch((error) => {
              res.render('profile', {
                status: 'Something wrong BRUH',
                class: 'error',
                layout: 'no-left-sidebar',
                userInfo: mongooseToObject(error),
                user: req.user,
                isLogin: req.user,
              })
            })
        } else {
          res.render('profile', {
            status: 'Sai password',
            class: 'error',
            layout: 'no-left-sidebar',
            userInfo: mongooseToObject(data),
            user: req.user,
            isLogin: req.user,
          })
        }
      })
      .catch((error) => {
        res.render('user', {
          status: 'Tài khoản không tồn tại !!!!',
          class: 'error',
          layout: 'no-left-sidebar',
        })
      })
  }
  requireAuth(req, res, next) {
    const originalUrl = req.originalUrl
    console.log(req.originalUrl)
    const authToken = req.cookies['AuthToken']
    req.user = authTokens[authToken]
    if (req.user) {
      req.isLogin = true
      next()
    } else {
      res.render('user', {
        status: 'Hãy đăng nhập hoặc đăng kí để tiếp tục',
        class: 'error',
        layout: 'no-left-sidebar',
        ogUrl: originalUrl,
      })
    }
  }
  requireUser(req, res, next) {
    const authToken = req.cookies['AuthToken']
    req.user = authTokens[authToken]
    if (req.user) {
      req.isLogin = true
      next()
    } else {
      req.isLogin = false
      next()
    }
  }
  requireAdmin(req, res, next) {
    const authToken = req.cookies['AuthToken']
    req.user = authTokens[authToken]
    if (req.user == '19521352@gm.uit.edu.vn') {
      req.isLogin = true
      next()
    } else {
      res.render('user', {
        status: 'Hãy đăng nhập tài khoản admin để tiếp tục',
        class: 'error',
        layout: 'no-left-sidebar',
      })
    }
  }
  accountInfo(req, res, next) {
    User.findOne({ email: req.user }).then((user) => {
      // console.log(user);
      res.render('profile', {
        layout: 'no-left-sidebar',
        userInfo: mongooseToObject(user),
        user: req.user,
        isLogin: req.user,
      })
    })
  }

  logout(req, res, next) {
    res.clearCookie('AuthToken').redirect('/')
  }
}

module.exports = new userController()
