
const Brand = require('../models/Brand');
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')

class ProductController {
 
    //[POST] /brand/handle-form-actions
    handleFormActions(req,res,next) {
        switch (req.body.action){
            case 'delete':
                Brand.delete({_id: { $in: req.body.productIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Brand.restore({_id: { $in: req.body.productIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'force':
                Brand.remove({_id: { $in: req.body.productIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({Message: 'Action is invalid !!'})
        }
    }

    //[PUT] /brand/:id
    update(req,res,next) {
        Brand.updateOne({_id: req.params.id}, req.body)
            .then(brand => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /brand/:id
    delete(req,res,next) {
        Brand.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[DELETE] /brand/:id/force
    force(req,res,next) {
        Brand.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[RESTORE] /brand/:id/store
    restore(req,res,next) {
        Brand.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[POST] /store brand
    store(req,res,next) {
        const brand = new Brand({
            name: req.body.name,
            desc: req.body.desc,
            image: req.file.filename
        });
        brand.save()
            .then(() => res.redirect('/admin/brand-table'))
            .catch(error => {
                console.log(error);
                return res.redirect('/partials/error')
            })
    }

}

module.exports = new ProductController;

const res = require('express/lib/response');
const productController = require('./ProductController');