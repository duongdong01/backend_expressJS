const Product = require('../models/Product')
const Size=require('../models/Size');
var Bluebird = require("bluebird");

const searchProductSize = async(query,page,limit,sort)=>{
        const products = await Product.find(query)
            .skip((page-1)*limit) // thuc hien khi phan trang
            .limit(limit)
            .sort(sort)
            .lean()

        return Bluebird.map(
            products,
            async(product)=>{
            const sizes=await Size.find({product:product._id})
                  .select(' name numberInStock')
                  .lean();
            return {...product,sizes}
        },{concurrency:products.length})
}

const searchProductPage=async(search='',subject='',page=1,limit=50,sort='-_id')=>{
        const vPage=parseInt(page);
        const vLimit=parseInt(limit)
         const query={}
         if(search){
            query.$text={$search:search};
         }
         if(subject){
            query.subject=subject;
         }
        //  console.log(query);
         // chay nhieu promise cung luc va tra ve tat ca promise cung luc
         const [products,total] = await Bluebird.all([searchProductSize(query,vPage,vLimit,sort),Product.countDocuments(query)])
         const pages=Math.ceil(total/vLimit) //lam tron page
        //  console.log(products)
         return {products,total,pages,page:vPage};
        }

const searchProduct=async (req,res,next)=>{
    try{

        const {search,subject, page,limit,sort}={...req.query,...req.params};
        const products=await searchProductPage(search,subject,page,limit,sort) 
        // console.log(products);
       return res.status(200).json({success:true,products,status:'ok'})
    }
    catch(error){
        next(error)
    }
}
        
const addProduct = async(req,res,next)=>{
    try{

        // console.log("call function add product")
        const {size , ...rest}=req.body;
         const product=  await Product.create(rest);
         const sizeProudct=size.map(size=>({
            ...size,
            product:product._id
        }))
        await Size.create(sizeProudct);
        // console.log("thêm thành công ");
        const result={...product,sizes:sizeProudct}
       return  res.status(200).json({ success: true,result ,status: 'Bạn đã thêm sản phẩm thành công' })


    }
    catch(error){
        next(error)
    }
}

const getProductId=async(req,res,next)=>{
    try{
            // console.log(id)
        // console.log(req.params)
        const product=await Product.findById(req.params.productId).lean();
        if(!product){
                next(error)
        }
        else{
            await Product.updateOne(
               {_id:req.params.productId}, { $inc: { view:1 } }
            ).exec()
            const size=await Size.find({product:product._id}).select('-_id name numberInStock').lean();
            const result={...product,size};
            res.status(200).json({success:true,result,status:"Lấy thành công"})
        }
        }
    catch(error){
            next(error)
        }
}

module.exports={
    addProduct,
    searchProduct,
    getProductId
}