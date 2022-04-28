
const productRouter = require('./product');
const siteRouter = require('./site');

function route(app){

    app.use('/product', productRouter);

    app.use('/',siteRouter);
}

module.exports=route;