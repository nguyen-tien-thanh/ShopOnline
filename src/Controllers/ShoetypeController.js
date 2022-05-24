
const Shoetype = require('../models/Shoetype');
const { multipleMongooseToObject } = require('../ulti/mongoose')
const { mongooseToObject } = require('../ulti/mongoose')

class ShoetypeController {

    //[PUT] /shoetype/:id
    update(req,res,next) {
        Shoetype.updateOne({_id: req.params.id}, req.body)
            .then(shoetype => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /shoetype/:id
    delete(req,res,next) {
        Shoetype.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[DELETE] /shoetype/:id/force
    force(req,res,next) {
        Shoetype.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[RESTORE] /shoetype/:id/store
    restore(req,res,next) {
        Shoetype.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
        
    }

    //[POST] /store shoetype
    store(req,res,next) {
        const shoetype = new Shoetype(req.body);
        shoetype.save()
            .then(() => res.redirect('/admin/shoetype-table'))
            .catch(error => {
                console.log(error)
            })
    }

}

module.exports = new ShoetypeController;

const res = require('express/lib/response');
const shoetypeController = require('./ShoetypeController');