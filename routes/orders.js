var express=require('express')
var router=express.Router()
var OrderController=require('../controllers/orderController')

router.post('/',OrderController.createOrder)
router.get('/',OrderController.getOrder)
router.put('/',OrderController.cancelOrder)
module.exports=router