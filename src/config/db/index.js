const mongoose = require('mongoose')

async function connect(){
    
    mongoose.connect("mongodb+srv://admin:admin@bardcluster.49nhp.mongodb.net/BardPodData?retryWrites=true&w=majority",{
    // mongoose.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",{
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    mongoose.connection
    .once('open',()=> console.log('Database BardPod has been connected !!!'))
    .on('error',(error)=>{
        console.log("Can not connect to Database !!!", error)
    })
    }

module.exports = { connect }