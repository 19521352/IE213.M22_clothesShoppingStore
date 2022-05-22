const Product = require('../models/Product');
const { groupByField } = require('../../util/groupByField')
const { getPrice, getTotalQuantity } = require('../../util/products/show')
// const { mongooseToObject } = require('../../util/mongoose');

class ProductController {

  // [GET] /products/:slug
  show(req, res, next) {
    Product.findOne({ slug: req.params.slug }).lean()
      .then((product) => {
        res.render('products/show', {
          layout: 'main',
          title: product.name,
          product: product,
          colorList: groupByField(product.skus, 'color.color_type'),
          sizeList: groupByField(product.skus, 'size.size_type'),
          priceDetail: getPrice(product.skus),
          totalQuantity: getTotalQuantity(product.skus)
        })
        // res.json(product)
      },
      )
      .catch(next)
      .catch((error) => res.render('404', {
        layout: none,
        title: '404 error'
      }));
  }

  // [GET] /products/getCreate
  getCreate(req, res, next) {
    res.render('products/create', {
      layout: 'subordinate',
      title: 'Điều chỉnh sản phẩm'
    })
  }

  // [POST] /products/create
  create(req, res, next) {
    // res.json(req.body);
    const product = new Product(req.body);
    product
      .save()
      .then(() => res.redirect(`/products/getCreate`))
      .catch((error) => res.render('404', {
        // layout: none,
        title: '404 error'
      }));
  }


  // [GET] /products/:id/getCreateSku
  getCreateSku(req, res, next) {
    Product.findOne({ _id: req.params.id }).lean()
      .then((product) => {
        res.render('products/createSku', {
          layout: 'subordinate',
          product: product,
          colorList: groupByField(product.skus, 'color.color_type'),
          sizeList: groupByField(product.skus, 'size.size_type'),
          title: 'Thêm SKU'
        })

        // res.json(groupByField(product.skus, 'color.color_type'))
      })
  }

  // [POST] /products/:id/createSku
  createSku(req, res, next) {
    const obj = req.body;
    if (obj.color == 'other') {
      obj.color = {
        color_type: obj.inputOtherColorType,
        color_hex: obj.inputOtherColorHex
      }
    }
    else obj.color = JSON.parse(obj.color);

    if (obj.size == 'other') {
      obj.size = {
        size_type: obj.inputOtherSizeType
      }
    }
    else obj.size = JSON.parse(obj.size);

    obj.quantity = JSON.parse(obj.quantity)
    obj.price = {
      base: JSON.parse(obj.priceBase),
      currency: obj.priceCurrency,
      discount: JSON.parse(obj.priceDiscount)
    }
    obj.image = "/images/product-details/" + obj.image
    delete obj.priceBase
    delete obj.priceDiscount
    delete obj.priceCurrency
    delete obj.inputOtherColorType
    delete obj.inputOtherColorHex
    delete obj.inputOtherSizeType

    console.log(req.params.id)
    // res.json(obj);
    Product
      .findOneAndUpdate(
        { _id: req.params.id },
        { $push: { skus: obj } },
      )
      .save()
      .then(() => res.redirect(`/products/getCreate`))
      .catch((error) => res.render('404', {
        // layout: none,
        title: '404 error'
      }));
  }

  // [GET] /products/stored-products
  storedProducts(req, res, next) {
    Product.find({}).lean()
      .then((clothesItems) => {
        res.render('products/stored-products', {
          layout: 'subordinate',
          title: 'Cập nhật sản phẩm',
          clothesItems: clothesItems.map(e => Object.assign(e, getPrice(e.skus)))
        });
        // res.json(clothesItems.map(e => Object.assign(e, getPrice(e.skus))))
      })
      .catch(next);
  }

  // [GET] /products/:id/getUpdate
  getUpdate(req, res, next) {
    Product.findOne({ _id: req.params.id }).lean()
      .then((product) => {
        res.render('products/update', {
          layout: 'subordinate',
          title: 'Cập nhật sản phẩm',
          product: product
        })

        // res.json(groupByField(product.skus, 'color.color_type'))
      })
  }

  // [POST] /products/:id/update
  update(req, res, next) {
    const product = new Product(req.body);
    Product
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          "$set": {
            "name": req.body.name,
            "categories": req.body.categories,
            "description": req.body.description,
            "condition": req.body.condition
          }
        }
      )
      .then(() => res.redirect(`/products/getCreate`))
      .catch((error) => res.render('404', {
        // layout: none,
        title: '404 error'
      }));
  }

  // [GET] /products/:id/getUpdateSku/:skuID
  getUpdateSku(req, res, next) {
    Product.findOne({ _id: req.params.id }).lean()
      .then((product) => {
        res.render('products/updateSku', {
          layout: 'subordinate',
          product: product,
          colorList: groupByField(product.skus, 'color.color_type'),
          sizeList: groupByField(product.skus, 'size.size_type'),
          sku: product.skus.find(obj => {
            return obj._id == req.params.skuId
          }),
          title: 'Thêm SKU'
        })

      })
  }

  // [POST] /products/:id/updateSku/:sku
  updateSku(req, res, next) {
    const obj = req.body;
    if (obj.color == 'other') {
      obj.color = {
        color_type: obj.inputOtherColorType,
        color_hex: obj.inputOtherColorHex
      }
    }
    else obj.color = JSON.parse(obj.color);

    if (obj.size == 'other') {
      obj.size = {
        size_type: obj.inputOtherSizeType
      }
    }
    else obj.size = JSON.parse(obj.size);

    obj.quantity = JSON.parse(obj.quantity)
    obj.price = {
      base: JSON.parse(obj.priceBase),
      currency: obj.priceCurrency,
      discount: JSON.parse(obj.priceDiscount)
    }
    obj.image = "/images/product-details/" + obj.image
    delete obj.priceBase
    delete obj.priceDiscount
    delete obj.priceCurrency
    delete obj.inputOtherColorType
    delete obj.inputOtherColorHex
    delete obj.inputOtherSizeType

    // console.log(req.params.id)
    // res.json(obj);
    // Product.updateOne(
    //   { _id: req.params.id, 'skus._id': req.params.sku },
    //   {
    //     '$set': {
    //       'skus.$': obj
    //     }
    //   })
    //   .then(() => res.redirect(`/products/getCreate`))
    //   .catch((error) => res.render('404', {
    //     // layout: none,
    //     title: '404 error'
    //   }));
    Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          'skus.$[el].color': obj.color,
          'skus.$[el].size': obj.size,
          'skus.$[el].quantity': obj.quantity,
          'skus.$[el].image': obj.image,
          'skus.$[el].price': obj.price,
        }
      },
      {
        arrayFilters: [{ 'el._id': req.params.skuId }],
        new: true
      }
    )
      .then(() => res.redirect(`/products/${req.params.id}/getUpdate`))
      .catch((error) => res.render('404', {
        // layout: none,
        title: '404 error'
      }));
  }

  // [DELETE] /products/:id
  delete(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect(`back`))
      .catch((error) => res.render('404', {
        // layout: none,
        title: '404 error'
      }))
  }

  // [DELETE] /products/:id/deleteSku/:skuId
  deleteSku(req, res, next) {
    Product
      .updateOne(
        { _id: req.params.id },
        {
          $pull: {
            skus: { _id: req.params.skuId },
          },
        })
      .then(() => res.redirect(`back`))
      .catch((error) => res.render('404', {
        // layout: none,
        title: '404 error'
      }));
  }
}


module.exports = new ProductController()