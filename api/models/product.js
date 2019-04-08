const mongoose = require('mongoose');
//schema of product
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String, required : true},
    price: {type : Number, required : true},
    size: {type : Number, required : true},
    color: {type: String, required: true},
    grade: {type: {'A':1,'B':2,'C':3}, required: true},
    created_at: {type: Date, required: true}
});

module.exports = mongoose.model('Product', productSchema);