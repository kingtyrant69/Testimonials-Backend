import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from 'mongoose'

const getSpaces = asyncHandler(async(req,res)=>{
    const user = req.user
    if(!user){
        throw new ApiError(400, "User Not Found");
    }
    if(!isValidObjectId(user?._id)){
        throw new ApiError(400, "Invalid Object")
    }
    const spaces = await Space.find({
        owner:user._id
    })
    if(spaces.length=== 0){
        return res.status(200).json(new ApiResponse(200, {}, "User has no spaces"));
    }
    return res.status(200).json(new ApiResponse(200, spaces, "Spaces Fetched Successfully"))
})


export {getSpaces}