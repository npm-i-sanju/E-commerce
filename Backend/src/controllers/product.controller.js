import { asyancHandler } from "../utils/AsynceHendler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const createProduct = asyancHandler(async()=>{
const {title, description, price, category, image, stock} = req.body;

if(!title?.trim()){
    throw new ApiError(400, "Title is Require");
}
if(!description?.trim()){
throw new ApiError(400,"Description is Require")
}

if(!price?.trim()){
    throw new ApiError(400,"Price is Require")
}
if(!category?.trim()){
    throw new ApiError(400,"Category Is Require")
}

if (!image?.trim()) {
    throw new ApiError(400,"Image is Require")
}
if


})

export { createProduct }