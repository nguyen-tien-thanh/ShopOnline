
const Shoe = require('../models/Shoe');
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')

class ShoeController {

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
            desc: req.body.desc,
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