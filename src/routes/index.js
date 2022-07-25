
const siteRouter = require('./site');
const adminRouter = require('./admin');
const brandRouter = require('./brand');
const shoetypeRouter = require('./shoetype');
const shoeRouter = require('./shoe');
const userRouter = require('./user');
const notificationRouter = require('./notification');

const {upload} = require('../ulti/storage');
//File uploads 
const multer=require('multer');

function route(app){
    app.use('/notification', notificationRouter);

    app.use('/user', upload.single('image'), userRouter);

    app.use('/shoe', upload.single('image'), shoeRouter);

    app.use('/shoetype', upload.single('image'), shoetypeRouter);

    app.use('/brand', upload.single('image'), brandRouter);

    app.use('/admin', adminRouter);

    app.use('/', siteRouter);
}

module.exports=route;