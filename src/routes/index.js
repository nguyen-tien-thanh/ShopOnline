
const productRouter = require('./product');
const siteRouter = require('./site');
const adminRouter = require('./admin');
const brandRouter = require('./brand');
const shoetypeRouter = require('./shoetype');

const {upload} = require('../ulti/storage');
//File uploads 
const multer=require('multer');

function route(app){


    app.use('/shoetype', upload.single('image'), shoetypeRouter);

    app.use('/brand', upload.single('image'), brandRouter);

    app.use('/admin', adminRouter);

    app.use('/product', productRouter);

    app.use('/', siteRouter);
}

module.exports=route;