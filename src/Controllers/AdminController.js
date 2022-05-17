

class AdminController {
    
    // [GET] /index -- Home page
    index(req, res, next){
        res.render('admin', {
            title: 'Admin Dashboard',
            layout: 'adminLayout'
        })
        // if (req.isAuthenticated()) {
        //     User.findOne({username: req.user.username})
        //     .then (user =>{
        //         res.render('index', {
        //             layout: 'intropage', 
        //             userLogin: mongooseToObject(user)
        //         });
        //     })
        // }
        // else{
            
        // res.render('index', {
        //     title:'Homepage',
        //     layout: 'intropage'});
        // }
    }

    // // [GET] /logout --> Home page
    // logout (req, res) {
    //     req.logout();
    //     res.redirect('login');
    // }

    // contact(req, res,next){
    //     if (req.isAuthenticated()) {
    //         User.findOne({username: req.user.username})
    //         .then (user =>{
    //             res.render('contact', { 
    //                 title: 'Contact',
    //                 userLogin: mongooseToObject(user)
    //             });
    //         })
    //     }
    //     else{
    //         res.render('contact', {title:'Contact'})
    //     }
    // }

    // register(req, res, next){
    //     res.render('register', {title: 'Register',layout: 'intropage'});
    // }

    // //[POST] /store User
    // store(req,res,next) {
    //     // const register = new User(req.body);
    //     // register.save()
    //     //     .then(() => res.redirect('login'))
    //     //     .catch(next)
        
    //     var username = req.body.username
    //     var password = req.body.password
    //     User.register(new User({ username: username }),
    //             req.body.password, function (err, user) {
    //         if (err) {
    //             console.log(err);
    //             return res.render('register', {
    //                 title: 'Register again',
    //                 layout: 'intropage',
    //                 failRegister: "This username had been created"
    //             })
    //         }
    
    //         passport.authenticate("local")(
    //             req, res, function () {
    //                 User.findOne({username: req.user.username})
    //                     .then (user =>{
    //                         res.render('index', { 
    //                             title: 'Homepage',
    //                             layout: 'intropage',
    //                             userLogin: mongooseToObject(user),
    //                             successRegister: "Welcome to fearOG !"
    //                         });
    //                     })
    //         });
            
    //     });
    // }

    // login(req, res, next){
    //     res.render('login', {
    //         title:'Login',
    //         layout: 'intropage'});
    // }

    // //[POST] /validation User
    // validation(req,res,next) {
    //     // var username = req.body.username;
    //     // var password = req.body.password;

    //     // User.findOne({username: username}).then(function(user) {
    //     //     if(user){
    //     //       if (user.password == password){
    //     //           console.log('User connected');
    //     //           req.session.username = username;
    //     //           req.session.password = password;
    //     //           console.log(req.session);
    //     //         //   res.status(200).send('User Authentified');
    //     //       }else{
    //     //           res.status(401).send('Invalid Password');
    //     //       }
    //     //   }else{
    //     //       res.status(401).send('Username');
    //     //   }
    //     // });
    //     passport.authenticate("local")(
    //         req, res, function () {
    //             User.findOne({username: req.user.username})
    //                 .then (user =>{
    //                     res.render('index', { 
    //                         title: 'Homepage',
    //                         layout: 'intropage',
    //                         userLogin: mongooseToObject(user)
    //                     });
    //                 })
    //     });
    // }

    // [GET] /:slug
    // Show 404 not found error
    error(req,res,next){
        // if (req.isAuthenticated()) {
        //     User.findOne({username: req.user.username})
        //     .then (user =>{
        //         res.render('partials/error', { 
        //             title: 'Not Found',
        //             userLogin: mongooseToObject(user)
        //         });
        //     })
        // }
        // else{
            res.render('partials/error', {
                title: 'Not Found',
                layout: null
            });
        // }
    }

    // termsandconditions(req, res, next){
    //     if (req.isAuthenticated()) {
    //         User.findOne({username: req.user.username})
    //         .then (user =>{
    //             res.render('termsandconditions', { 
    //                 title: 'Terms',
    //                 userLogin: mongooseToObject(user)
    //             });
    //         })
    //     }
    //     else{
    //         res.render('termsandconditions', {title: 'Terms' })
    //     }
    // }

    // secret(req,res,next){
    //     if (req.isAuthenticated()) {
    //         User.findOne({username: req.user.username})
    //         .then (user =>{
    //             res.render('secret', { 
    //                 title: 'secret',
    //                 userLogin: mongooseToObject(user)
    //             });
    //         })
    //     }
    //     else{
    //         res.render('secret', {title: 'Secret' })
    //     }
    // }

}

module.exports = new AdminController;

const res = require('express/lib/response');
const adminController = require('./AdminController');