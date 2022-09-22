var mongoose=require('mongoose')
var Schema=mongoose.Schema

var orderItemSchema=new Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:true 
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    size:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    price:{
        type:Number,
        required:true
    }
})

orderItemSchema.index({order:1,product:1})
module.exports=mongoose.model('OrderItem',orderItemSchema);