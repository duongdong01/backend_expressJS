var express =require('express');
const passport =require('../middlewares/passport');
var router=express.Router();
const ProductController=require('../controllers/productController');

router.post('/',ProductController.addProduct)
router.get('/',ProductController.searchProduct),
module.exports=router;