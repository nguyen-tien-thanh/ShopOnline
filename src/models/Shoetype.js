
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const Shoetype = new Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    image: {type: String},
    deletedAt: {},
}, {
    timestamps : true,
});

//Add plugin
Shoetype.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});

// const ShoeType = [
//     {
//         id: 1,
//         type: 'Knee high boots'
//     },
//     {
//         id: 2,
//         type: 'Boots'
//     },
//     {
//         id: 3,
//         type: 'Cowboy boots'
//     },
//     {
//         id: 4,
//         type: 'Wellington boots'
//     },
//     {
//         id: 5,
//         type: 'Uggs'
//     },
//     {
//         id: 6,
//         type: 'Timberland boots'
//     },
//     {
//         id: 7,
//         type: 'Work boots'
//     },
//     {
//         id: 8,
//         type: 'Laced booties'
//     },
//     {
//         id: 9,
//         type: 'Scarpin heels'
//     },
//     {
//         id: 10,
//         type: 'Court shoes'
//     },
//     {
//         id: 11,
//         type: 'Mary Jane platforms'
//     },
//     {
//         id: 12,
//         type: 'Stilettos'
//     },
//     {
//         id: 13,
//         type: 'Wedges'
//     },
//     {
//         id: 14,
//         type: 'Cone heels'
//     },
//     {
//         id: 15,
//         type: 'High heels'
//     },
//     {
//         id: 16,
//         type: 'Lita'
//     },
//     {
//         id: 17,
//         type: 'Kitten Heels'
//     },
//     {
//         id: 18,
//         type: 'Business shoes'
//     },
//     {
//         id: 19,
//         type: 'Derby shoes'
//     },
//     {
//         id: 20,
//         type: 'Monk straps'
//     },
//     {
//         id: 21,
//         type: 'Old skool'
//     },
//     {
//         id: 22,
//         type: 'Boat shoes'
//     },
//     {
//         id: 23,
//         type: 'Sneakers'
//     },
//     {
//         id: 24,
//         type: 'Climbing shoes'
//     },
//     {
//         id: 25,
//         type: 'Running shoes'
//     },
//     {
//         id: 26,
//         type: 'Hiking boots'
//     },
//     {
//         id: 27,
//         type: 'Flip flops'
//     }
// ]



module.exports = mongoose.model('Shoetype', Shoetype);