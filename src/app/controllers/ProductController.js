const Product = require('../models/Product')
const Comments = require('../models/Comments')
const User = require('../models/User')
const { groupByField } = require('../../util/groupByField')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { redirect } = require('express/lib/response')
const { getPrice, getTotalQuantity } = require('../../util/products/show')
// const { mongooseToObject } = require('../../util/mongoose');

class ProductController {
  // [GET] /products/:slug
  show(req, res, next) {
    Product.findOne({ slug: req.params.slug })
      .lean()
      .then((product) => {
        Comments.find({ productId: req.params.slug }).then((comment) => {
          res.render('products/show', {
            layout: 'main',
            title: product.name,
            product: product,
            colorList: groupByField(product.skus, 'color.color_type'),
            sizeList: groupByField(product.skus, 'size.size_type'),
            priceDetail: getPrice(product.skus),
            totalQuantity: getTotalQuantity(product.skus),
            isLogin: req.user,
            comment: mutipleMongooseToObject(comment),
          })
        })
      })
      .catch(next)
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [GET] /products/getCreate
  getCreate(req, res, next) {
    res.render('products/create', {
      layout: 'subordinate',
      title: 'Điều chỉnh sản phẩm',
    })
  }

  postComment(req, res, next) {
    // console.log(req.body);
    User.findOne({ email: req.body.email })
      .then((user) => {
        const Data = req.body
        Data.name = user.name
        const comment = new Comments(Data)
        // console.log(comment)
        comment.save()
      })
      .then(() => res.redirect('/products/' + req.body.productId))
      .catch(next)
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  updateComment(req, res, next) {
    Comments.findOneAndUpdate(
      { _id: req.body._id },
      {
        comment: req.body.newComment,
        rate: req.body.rate,
      }
    )
      .then(() => res.redirect('/products/' + req.body.productId))
      .catch(next)
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  deleteComment(req, res, next) {
    Comments.deleteOne({ _id: req.body._id })
      .catch(next)
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [POST] /products/create
  create(req, res, next) {
    var product = new Product(req.body)
    if (product.image)
      product.image = product.image.map(
        (item) => '/images/product-details/' + item
      )
    // res.json(product)
    product
      .save()
      .then(() => res.redirect(`back`))
      // .catch((error) => res.render('404', {
      //   layout: false,
      //   title: '404 error'
      // }));
      .catch((error) => res.json(error))
  }

  // [GET] /products/:id/getCreateSku
  getCreateSku(req, res, next) {
    Product.findOne({ _id: req.params.id })
      .lean()
      .then((product) => {
        res.render('products/createSku', {
          layout: 'subordinate',
          product: product,
          colorList: groupByField(product.skus, 'color.color_type'),
          sizeList: groupByField(product.skus, 'size.size_type'),
          title: 'Thêm SKU',
        })
      })
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [POST] /products/:id/createSku
  createSku(req, res, next) {
    const obj = req.body
    if (obj.color == 'other') {
      obj.color = {
        color_type: obj.inputOtherColorType,
        color_hex: obj.inputOtherColorHex,
      }
    } else obj.color = JSON.parse(obj.color)

    if (obj.size == 'other') {
      obj.size = {
        size_type: obj.inputOtherSizeType,
      }
    } else obj.size = JSON.parse(obj.size)

    obj.quantity = JSON.parse(obj.quantity)
    obj.price = {
      base: parseFloat(JSON.parse(obj.priceBase)),
      currency: obj.priceCurrency,
      discount: parseFloat(JSON.parse(obj.priceDiscount)),
    }
    if (obj.img)
      obj.image = obj.image.map((item) => '/images/product-details/' + item)
    delete obj.priceBase
    delete obj.priceDiscount
    delete obj.priceCurrency
    delete obj.inputOtherColorType
    delete obj.inputOtherColorHex
    delete obj.inputOtherSizeType

    // console.log(req.params.id)
    // res.json(obj.image);
    Product.findOneAndUpdate({ _id: req.params.id }, { $push: { skus: obj } })
      .then(() => res.redirect(`/products/${req.params.id}/getUpdate`))
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [GET] /products/stored-products
  storedProducts(req, res, next) {
    let productQuery = Product.find({}).lean()

    if (req.query.hasOwnProperty('_sort')) {
      productQuery = productQuery.sort({
        [req.query.column]: [req.query.type.split('.')],
      })
    }

    Promise.all([productQuery])
      .then(([clothesItems]) => {
        res.render('products/stored-products', {
          layout: 'subordinate',
          title: 'Cập nhật sản phẩm',
          clothesItems: clothesItems.map((e) =>
            Object.assign(e, getPrice(e.skus))
          ),
        })
        // res.json(clothesItems.map(e => Object.assign(e, getPrice(e.skus))))
      })
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [GET] /products/:id/getUpdate
  getUpdate(req, res, next) {
    Product.findOne({ _id: req.params.id })
      .lean()
      .then((product) => {
        res.render('products/update', {
          layout: 'subordinate',
          title: 'Cập nhật sản phẩm',
          product: product,
        })
      })
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [POST] /products/:id/update
  update(req, res, next) {
    const obj = req.body
    if (obj.image)
      obj.image = obj.image.map((item) => '/images/product-details/' + item)
    // res.json(product)
    Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: obj.name,
          categories: obj.categories,
          description: obj.description,
          condition: obj.condition,
          image: obj.image,
        },
      }
    )
      .then(() => res.redirect(`/products/${req.params.id}/getUpdate`))
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [GET] /products/:id/getUpdateSku/:skuID
  getUpdateSku(req, res, next) {
    Product.findOne({ _id: req.params.id })
      .lean()
      .then((product) => {
        res.render('products/updateSku', {
          layout: 'subordinate',
          product: product,
          colorList: groupByField(product.skus, 'color.color_type'),
          sizeList: groupByField(product.skus, 'size.size_type'),
          sku: product.skus.find((obj) => {
            return obj._id == req.params.skuId
          }),
          title: 'Thêm SKU',
        })
      })
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [POST] /products/:id/updateSku/:sku
  updateSku(req, res, next) {
    const obj = req.body
    if (obj.color == 'other') {
      obj.color = {
        color_type: obj.inputOtherColorType,
        color_hex: obj.inputOtherColorHex,
      }
    } else obj.color = JSON.parse(obj.color)

    if (obj.size == 'other') {
      obj.size = {
        size_type: obj.inputOtherSizeType,
      }
    } else obj.size = JSON.parse(obj.size)

    obj.quantity = JSON.parse(obj.quantity)
    obj.price = {
      base: parseFloat(JSON.parse(obj.priceBase)),
      currency: obj.priceCurrency,
      discount: parseFloat(JSON.parse(obj.priceDiscount)),
    }

    delete obj.priceBase
    delete obj.priceDiscount
    delete obj.priceCurrency
    delete obj.inputOtherColorType
    delete obj.inputOtherColorHex
    delete obj.inputOtherSizeType

    Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          'skus.$[el].color': obj.color,
          'skus.$[el].size': obj.size,
          'skus.$[el].quantity': obj.quantity,
          'skus.$[el].image': obj.image,
          'skus.$[el].price': obj.price,
        },
      },
      {
        arrayFilters: [{ 'el._id': req.params.skuId }],
        new: true,
      }
    )
      .then(() => res.redirect(`/products/${req.params.id}/getUpdate`))
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [DELETE] /products/:id/delete
  delete(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect(`back`))
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [DELETE] /products/:id/deleteSku/:skuId
  deleteSku(req, res, next) {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          skus: { _id: req.params.skuId },
        },
      }
    )
      .then(() => res.redirect(`back`))
      .catch((error) =>
        res.render('404', {
          layout: false,
          title: '404 error',
        })
      )
  }

  // [POST] /products/handle-form-actions
  handleFormActions(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        Product.deleteMany({ _id: { $in: req.body.productIds } })
          .then(() => res.redirect('back'))
          .catch(next)
        break
      default:
        res.json({ message: 'Action is invalid' })
    }
  }

  // [POST] /products/:id/handle-skus-form-actions
  handleSkusFormActions(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: {
              skus: { _id: { $in: req.body.productIds } },
            },
          }
        )
          .then(() => res.redirect('back'))
          .catch(next)
        break
      default:
        res.json({ message: 'Action is invalid' })
    }
  }
}

module.exports = new ProductController()
