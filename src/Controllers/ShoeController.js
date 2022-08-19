
 
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')
const Cart = require('../models/Cart')
const Custom = require('../models/Custom')
const Notification = require('../models/Notification')

const { mongooseToObject, multipleMongooseToObject } = require('../ulti/mongoose')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class ShoeController {

    // [GET] /shoe/custom
    custom(req,res,next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'secretpasstoken')
        Promise.all([
            User.findOne({_id: decodeToken}),
            Notification.find({user: decodeToken})
                .sort({createdAt: -1}),
        ])
        .then(([user, noti]) =>{
            res.render('shoe/custom', {
                user: mongooseToObject(user),
                noti: multipleMongooseToObject(noti),
                title: 'Custom'
            })
        })
        .catch((err)=>{console.log(err)})
    }
    

    //[POST] /shoe/delete-cart
    deleteCart(req, res, next){
        var cart = new Cart({});
        req.session.cart = cart;
        res.redirect('/cart')
    }

    //[POST] /shoe/remove-item/:id
    removeItem(req, res, next){
        var shoeId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.removeItem(shoeId);
        req.session.cart = cart;
        res.redirect('/cart')
    }

    //[POST] /shoe/reduce-cart/:id
    reduceCart(req, res, next){
        var shoeId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceByOne(shoeId);
        req.session.cart = cart;
        res.redirect('/cart')
    }

    //[POST] /shoe/add-by-one/:id
    addByOneCart(req, res, next){
        var shoeId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.addByOne(shoeId);
        req.session.cart = cart;
        res.redirect('/cart')
    }

    // [POST] /shoe/add-to-cart/:id
    addToCart(req, res, next){
        var shoeId = req.params.id;
        var shoeSize = req.query.size;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        Shoe.findById(shoeId, function(err, shoe){
            if(err){
                return res.redirect('back');
            }
            var id = shoe._id + shoeSize
            cart.add(shoe, id, shoeSize);
            req.session.cart = cart;
            res.redirect('back');
        })
    }

    //[GET] /shoe/checkout
    checkout(req, res, next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type'),
                Shoe.findOne({_id: req.query.shoeid})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
            ])
            .then(([
                brandList,
                shoeType,
                shoe,
                shoeDetail,
            ]) => {
                res.render('shoe/checkout', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    shoeDetail: mongooseToObject(shoeDetail),
                    title: 'Checkout',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type'),
                Shoe.findOne({_id: req.query.shoeid})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                shoeDetail,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe/checkout',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            shoeDetail: mongooseToObject(shoeDetail),
                            noti: multipleMongooseToObject(noti),
                            title: 'Checkout',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /shoe/:id
    show(req,res,next) {
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({brand: req.query.brandid})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(4),
                Shoe.findOne({_id: req.params.id})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
            ])
            .then(([
                brandList,
                shoeType,
                shoe,
                shoeDetail,
            ]) => {
                res.render('shoe/show', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    shoeDetail: mongooseToObject(shoeDetail),
                    title: shoeDetail.name,
                    shoeDetailTitle: req.query.shoeDetailTitle,
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({brand: req.query.brandid})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1})
                    .limit(4),
                Shoe.findOne({_id: req.params.id})
                    .populate('brand')
                    .populate('type')
                    .limit(4),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                shoeDetail,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe/show',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            shoeDetail: mongooseToObject(shoeDetail),
                            noti: multipleMongooseToObject(noti),
                            title: shoeDetail.name,
                            shoeDetailTitle: req.query.shoeDetailTitle
                        })
                    next()
                }
            })
        }
    }

    //[PUT] /shoe/:id
    update(req,res,next) {
        Shoe.updateOne({_id: req.params.id}, req.body)
            .then(shoe => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /shoe/:id
    delete(req,res,next) {
        Shoe.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[DELETE] /shoe/:id/force
    force(req,res,next) {
        Shoe.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[RESTORE] /shoe/:id/store
    restore(req,res,next) {
        Shoe.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[POST] /store shoe
    store(req,res,next) {
        // console.log(req.body)
        const shoe = new Shoe({
            brand: req.body.brand,
            type: req.body.type,
            name: req.body.name,
            color: req.body.color,
            price: req.body.price,
            size: req.body.size,
            quantity: req.body.quantity,
            image: req.file.filename
        });
        // const shoe = new Shoe(req.body);
        shoe.save()
            .then(() => res.redirect('/admin/shoe-table'))
            // .then(() => res.json(req.body))
            .catch(error => {
                console.log(error)
            })
    }

    //[POST] /store-custom shoe
    storeCustom(req,res,next) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'secretpasstoken')
        User.findOne({_id: decodeToken})
        .then((user) => {
            const shoe = new Custom({
                user: user._id,
                swooth: req.body.swoothColor,
                midsole: req.body.midsoleColor,
                middle: req.body.middleColor,
                head: req.body.headColor,
                back: req.body.backColor,
                backward: req.body.backwardColor,
                success: true
            })
            shoe.save()

            res.redirect('back')
        })
        .catch((err)=> {
            console.log(err)
        })
    }
    //[POST] /store-custom-to-cart/:id
    storeCustomToCart(req,res,next){
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        var customId = req.params.id
        var shoeSize = req.query.size

        Custom.findById(customId, function(err, custom){
            if(err){
                return res.redirect('back');
            }
            cart.add(custom, custom._id, shoeSize);
            req.session.cart = cart;
            res.redirect('back');
        })
        // cart.add(shoe, customId, shoeSize);

        console.log('Store')
    }
    //[POST] /delete-custom/:id shoe
    deleteCustom(req,res,next) {
        Custom.findByIdAndDelete(req.params.id)
        .then(()=>{
            res.redirect('back')
        })
        .catch((err)=> {
            console.log(err)
        })
    }

    //[GET] /shoe/newarrival
    newarrival(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1}),
            ])
            .then(([
                brandList,
                shoeType,
                shoe
            ]) => {
                res.render('shoe', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    title: 'Shop',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({createdAt: 1}),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            noti: multipleMongooseToObject(noti),
                            title: 'Shop',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /shoe/cheapshoe
    cheapshoe(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: 1}),
            ])
            .then(([
                brandList,
                shoeType,
                shoe
            ]) => {
                res.render('shoe', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    title: 'Shop',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: 1}),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            noti: multipleMongooseToObject(noti),
                            title: 'Shop',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /shoe/expensiveshoe
    expensiveshoe(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: -1}),
            ])
            .then(([
                brandList,
                shoeType,
                shoe
            ]) => {
                res.render('shoe', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    title: 'Shop',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type')
                    .sort({price: -1}),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            noti: multipleMongooseToObject(noti),
                            title: 'Shop',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /shoe/bestseller
    bestseller(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({bestseller: true})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                shoeType,
                shoe
            ]) => {
                res.render('shoe', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    title: 'Shop',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({bestseller: true})
                    .populate('brand')
                    .populate('type'),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            noti: multipleMongooseToObject(noti),
                            title: 'Shop',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /shoe/available
    available(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({available: true})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                shoeType,
                shoe
            ]) => {
                res.render('shoe', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    title: 'Shop',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({available: true})
                    .populate('brand')
                    .populate('type'),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            noti: multipleMongooseToObject(noti),
                            title: 'Shop',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /shoe/finding-type
    finding(req,res,next){
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({ $or: [
                        {type: req.query.type}, 
                        {brand: req.query.brand},
                        {color: req.query.color},
                        {size: {$elemMatch: {number: req.query.size1}}},
                        {size: {$elemMatch: {number: req.query.size2}}}
                    ]})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                shoeType,
                shoe
            ]) => {
                res.render('shoe', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    title: 'Shop',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({ $or: [
                        {type: req.query.type}, 
                        {brand: req.query.brand},
                        {color: req.query.color},
                        {size: {$elemMatch: {number: req.query.size1}}},
                        {size: {$elemMatch: {number: req.query.size2}}},
                    ]})
                    .populate('brand')
                    .populate('type'),
                Notification.find({user: decodeToken})
                    // .limit(4)
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            noti: multipleMongooseToObject(noti),
                            title: 'Shop',
                        })
                    next()
                }
            })
        }
    }

    //[GET] /shoe INDEX
    index(req,res,next) {
        if(!req.cookies.token){
            Promise.all([
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type'),
            ])
            .then(([
                brandList,
                shoeType,
                shoe
            ]) => {
                res.render('shoe', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    title: 'Shop',
                })
            }
            )}
        else {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'secretpasstoken')
            Promise.all([
                User.findOne({_id: decodeToken}),
                Brand.find({}),
                Shoetype.find({}),
                Shoe.find({})
                    .populate('brand')
                    .populate('type'),
                Notification.find({user: decodeToken})
                    .sort({createdAt: -1}),
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                noti
            ]) => {
                if (data) {
                    req.data = data
                    return res.render('shoe',
                        {
                            user: mongooseToObject(data),
                            brandList: multipleMongooseToObject(brandList),
                            shoeType: multipleMongooseToObject(shoeType),
                            shoe: multipleMongooseToObject(shoe),
                            noti: multipleMongooseToObject(noti),
                            title: 'Shop',
                        })
                    next()
                }
            })
        }
    }

    customList(req, res, next){
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'secretpasstoken')
        Promise.all([
            User.findOne({_id: decodeToken}),
            Custom.find({user: decodeToken})
                .populate('user')
                .sort({createdAt: -1}),
            Notification.find({user: decodeToken})
                .sort({createdAt: -1}),
        ])
        .then(([
            user,
            custom,
            noti
        ]) => {
            res.render('shoe/custom-list', {
                user: mongooseToObject(user),
                custom: multipleMongooseToObject(custom),
                noti: multipleMongooseToObject(noti),
                title: 'List of custom'
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
}

module.exports = new ShoeController;

const res = require('express/lib/response');
const shoeController = require('./ShoeController');