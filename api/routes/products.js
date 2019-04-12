const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const checkAuth = require('../authentication/check-auth');

router.get('/', (req, res, next) => {
    const qp = req.query;
    if(qp)
    {
    Product.find(qp).select('name price color size grade created_at _id')
    .exec()
    .then(doc => {
        console.log("From database",doc);
        if(doc.length > 0)
        {
            res.status(200).json({
                product : doc,
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/products/'
                }
            });
        }
        else{
            res.status(404).json({message : 'No valid entry found in the database'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });
    }
    else
    {

    Product.find()
    .select('name price size color grade created_at _id')
    .exec()
    .then(docs => {
        if(docs.length >= 0)
        {
            const response = {
                count : docs.length,
                products : docs.map(doc => {
                    return {
                        name : doc.name,
                        price : doc.price,
                        size : doc.size,
                        color : doc.color,
                        grade : doc.grade,
                        created_at : doc.created_at,
                        _id : doc._id,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/products/'+doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        }else
        {
            res.json({
                message : 'No entries found'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });}
});


/*router.get('/', (req, res, next) => {
    const qp = req.query;
    Product.find(qp).select('name price color size grade created_at _id')
    .exec()
    .then(doc => {
        console.log("From database",doc);
        if(doc.length > 0)
        {
            res.status(200).json({
                product : doc,
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/products/'
                }
            });
        }
        else{
            res.status(404).json({message : 'No valid entry found in the database'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });
});
*/
router.post('/', checkAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        color: req.body.color,
        grade: req.body.grade,
        created_at: new Date()
    });
    if(product.name!=' ' && product.name!=='' && product.price!=' ' && product.price!==null && product.size!=' ' && product.size!==null && product.color!=' ' && product.color!=='' && product.grade!=' ' && product.grade!=='')
    {
    if(product.name.length<10 && (product.grade=='A' || product.grade=='B' || product.grade=='C')) {
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name : result.name,
                price : result.price,
                size : result.size,
                color : result.color,
                grade : result.grade,
                created_at : result.created_at,
                _id : result._id,
                request : {
                    type : 'POST',
                    url : 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });}
    else{
        res.status(401).json({
            message: "Your entries are wrong!"
        });
    }}
    else{
        res.status(401).json({
            message:'Your entries are wrong!'
        });
    }
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(mongoose.Types.ObjectId.isValid(id))
    {
    Product.findById(id).select('name price size color grade created_at _id').exec().then(doc => {
        console.log("From database",doc);
        if(doc)
        {
            res.status(200).json({
                product : doc,
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/products/'
                }
            });
        }
        else{
            res.status(404).json({message : 'No valid entry found in the database'});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });}
    else{
        res.status(401).json({
            message:'ID is wrong!'
        });
    }
});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    if(mongoose.Types.ObjectId.isValid(id))
    {
    Product.findById(id).select('_id').exec().then(doc => {
    if(doc)
    {
    const updateOps = {};
    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id}, {$set : updateOps}).exec()
    .then(result => {
        res.status(200).json({
            message : 'Product updated',
            request : {
                type : 'PATCH',
                url : 'http://localhost:3000/products' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
    }
    else{
        res.status(404).json({message : 'No valid entry found in the database'});
    }
})
}
else{
    res.status(401).json({
        message:'The product id is INVALID!'
    });
}});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    if(mongoose.Types.ObjectId.isValid(id))
    {
    Product.findById(id).select('_id').exec().then(doc => {
    if(doc)
    {
    Product.deleteOne({_id:id}).exec()
    .then(result => {
        res.status(200).json({
            message : 'Product deleted',
            request : {
                type : 'POST',
                url : 'http://localhost:3000/products',
                body : {name : 'String', price : 'Number', size: 'Number', color: 'String', grade: {'A':1,'B':2,'C':3}}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
    }
    else{
        res.status(404).json({message : 'No valid entry found in the database'});
    }
})
}
else{
    res.status(401).json({
        message:'The product id is INVALID!'
    });
}});

module.exports = router;