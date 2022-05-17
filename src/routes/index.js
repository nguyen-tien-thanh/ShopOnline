
const productRouter = require('./product');
const siteRouter = require('./site');
const adminRouter = require('./admin');

function route(app){

    app.use('/admin', adminRouter);

    app.use('/product', productRouter);

    app.use('/', siteRouter);
}

module.exports=route;