
const productRouter = require('./product');
const siteRouter = require('./site');
const adminRouter = require('./admin');
const brandRouter = require('./brand');


function route(app){

    app.use('/brand', brandRouter);

    app.use('/admin', adminRouter);

    app.use('/product', productRouter);

    app.use('/', siteRouter);
}

module.exports=route;