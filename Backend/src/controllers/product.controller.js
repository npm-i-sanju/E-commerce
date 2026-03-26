import { asyancHandler } from "../utils/AsynceHendler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const createProduct = asyancHandler(async (req, res) => {
    const { name, description, price, category, stock } = req.body
    if (!name == "") {
        throw new ApiError(400, "Product name is required")
    }
    if (!description == "") {
        throw new ApiError(400, "Product description is required")
    }

    if (price === undefined || price === null) {
        throw new ApiError(400, "Product price is required")
    }

    if (!category == "") {
        throw new ApiError(400, "Product category is required")
    }

    if (stock === undefined || stock === null) {
        throw new ApiError(400, "Stock quantity is required")
    }
const product =  await Product.create({
...req.body , 
seller: req.user._id
})

if (!product) {
    throw new ApiError(500, "Something went wrong while creating the product")
}

return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));


})

const getProduct = asyancHandler(async (req, res) => {
    const product = await Product.find().sort({ createdAt: -1 })
})


const updateProduct = asyancHandler(async (req, res) => {

})


export { createProduct }