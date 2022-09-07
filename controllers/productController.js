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

const searchProductPage=async(search='',page=1,limit=50,sort='-_id')=>{
        const vPage=parseInt(page);
        const vLimit=parseInt(limit)
         const query={}
         if(search){
            query.$text={$search:search};
         }
         console.log(query);
         // chay nhieu promise cung luc va tra ve tat ca promise cung luc
         const [products,total] = await Bluebird.all([searchProductSize(query,vPage,vLimit,sort),Product.countDocuments(query)])
         const pages=Math.ceil(total/vLimit) //lam tron page
        //  console.log(products)
         return {products,total,pages,page:vPage};
        }

const searchProduct=async (req,res,next)=>{
    console.log("call searchProducts function")
    console.log(req.query);
    try{

        const {query, page,limit,sort}={...req.query};
        const products=await searchProductPage(query,page,limit,sort) 
        console.log(products);
       return res.status(200).json({success:true,products,status:'ok'})
    }
    catch(error){
        next(error)
    }
}
        
const addProduct = async(req,res,next)=>{
    try{

        console.log("call function add product")
        const {size , ...rest}=req.body;
         const product=  await Product.create(rest);
         const sizeProudct=size.map(size=>({
            ...size,
            product:product._id
        }))
        await Size.create(sizeProudct);
        console.log("thêm thành công ");
        const result={...product,sizes:sizeProudct}
       return  res.status(200).json({ success: true,result ,status: 'Bạn đã thêm sản phẩm thành công' })


    }
    catch(error){
        next(error)
    }
}


module.exports={
    addProduct,
    searchProduct
}