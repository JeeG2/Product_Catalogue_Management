const mongoose = require('mongoose');
//schema of product
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String, required : true},
    price: {type : Number, required : true},
    size: {type : Number, required : true},
    color: {type: String, required: true},
    grade: {type: {'1':'A', '2':'B', '3':'C'}, required: true},
    created_at: {type: Date, required: true}
});

module.exports = mongoose.model('Product', productSchema);