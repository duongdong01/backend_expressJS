var express=require('express');
var router=express.Router();
var cartController=require('../controllers/cartController');

router.post('/',cartController.addTocart)

module.exports=router