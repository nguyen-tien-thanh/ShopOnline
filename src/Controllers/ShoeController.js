
 
const User = require('../models/User')
const Brand = require('../models/Brand')
const Shoetype = require('../models/Shoetype')
const Shoe = require('../models/Shoe')

const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')
const { checkUserExist, makePassword } = require('../ulti/register')

const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

class ShoeController {

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
                shoeDetail
            ]) => {
                res.render('shoe/show', {
                    brandList: multipleMongooseToObject(brandList),
                    shoeType: multipleMongooseToObject(shoeType),
                    shoe: multipleMongooseToObject(shoe),
                    shoeDetail: mongooseToObject(shoeDetail),
                    title: 'Detail',
                    shoeDetailTitle: req.query.shoeDetailTitle
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
            ])
            .then(([
                data,
                brandList,
                shoeType,
                shoe,
                shoeDetail
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
                            title: 'Detail',
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
        console.log(req.body)
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

}

module.exports = new ShoeController;

const res = require('express/lib/response');
const shoeController = require('./ShoeController');