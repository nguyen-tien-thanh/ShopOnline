
const Product = require('../models/Product');
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')

class ProductController {
    
    //[GET] /product/create 
    create(req,res,next) {
        res.render('product/create', { 
            title: 'Create',
        });
        
    }

    //[GET] /product/trash 
    trash(req,res,next) {
        Promise.all([Product.findDeleted({}), Product.countDeleted(), Product.count()])
        .then(([product, deletedCount, storedCount]) => 
        res.render('product/trash', {
            title: 'Create Product',
            deletedCount,
            storedCount,
            product: multipleMongooseToObject(product),
            })
        )
        .catch(next)
    }

    //[GET] /product/manage 
    manage(req,res,next) {
        Promise.all([Product.find({}), Product.countDeleted(), Product.count()])
            .then(([product, deletedCount, storedCount]) => 
            res.render('product/manage', {
                title: 'Manage Product',
                deletedCount,
                storedCount,
                product: multipleMongooseToObject(product),
                })
            )
            .catch(next)
    }
    
    //[POST] /product/handle-form-actions
    handleFormActions(req,res,next) {
        switch (req.body.action){
            case 'delete':
                Product.delete({_id: { $in: req.body.productIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Product.restore({_id: { $in: req.body.productIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'force':
                Product.remove({_id: { $in: req.body.productIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({Message: 'Action is invalid !!'})
        }
    }

    //[POST] /product/:id/edit
    edit(req,res,next) {
        Product.findById(req.params.id)
        .then((product) => 
        res.render('product/edit',{
            title: 'Edit',
            product: mongooseToObject(product)
        })
        )
        .catch(next)
    }

    //[PUT] /product/:id
    update(req,res,next) {
        Product.updateOne({_id: req.params.id}, req.body)
            .then(product => res.redirect('/product'))
            .catch(next);
    }

    //[DELETE] /product/:id
    delete(req,res,next) {
        Product.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[DELETE] /product/:id/force
    force(req,res,next) {
        Product.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[RESTORE] /product/:id/store
    restore(req,res,next) {
        Product.restore({_id: req.params.id})
            .then(() => res.redirect('/product/manage'))
            .catch(next);
        
    }

    //[POST] /store product
    store(req,res,next) {
        const pro = new Product(req.body);
        pro.save()
            .then(() => res.redirect('/product'))
            .catch(error => {
                console.log(error)
            })
    }


    // [GET] /:slug
    // Find object in MongoDB by slug
    show(req,res,next){
            Promise.all([Product.find({}), Product.findOne({ slug: req.params.slug})])
                .then(([product, productDetail]) => 
                res.render('product/show', {
                    title: 'Product Detail',
                    productDetail: mongooseToObject(productDetail),
                    product: multipleMongooseToObject(product),
                    })
                )
                .catch(err=>next(err));
    }

    // [GET] /product
    index(req, res, next){
        res.render('product')
        // if (req.isAuthenticated()) {
        //     Promise.all([Product.find({}), User.findOne({username: req.user.username})])
        //     .then(([product, userLogin]) => 
        //     res.render('product', {
        //         title: 'Product',
        //         product: multipleMongooseToObject(product),
        //         userLogin: mongooseToObject(userLogin),
        //         })
        //     )
        //     .catch(next)
        // }
        // else{
        //     Product.find({})
        //     .then(product => {
        //         // product = product.map(cat => cat.toObject())
        //         res.render('product', {
        //             title: 'Product',
        //             product: multipleMongooseToObject(product)
        //         })
        //     })
        //     .catch(err=>next(err));
        //     }
    }

 }

module.exports = new ProductController;

const res = require('express/lib/response');
const productController = require('./ProductController');