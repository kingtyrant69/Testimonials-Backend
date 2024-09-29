import { isValidObjectId } from 'mongoose'
import {Space} from '../models/space.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'

const createSpace = asyncHandler(async(req,res)=>{
    const {header, customMessage, theme, spaceName, isStarRating, questions} = req.body

    const user = req.user;

    if(!user){
        throw new ApiError(400, "User Not found")
    }

    if([header,customMessage,spaceName].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All the fields are required")
    }

    const existedSpace = await Space.findOne({spaceName:spaceName})

    if(existedSpace){
        throw new ApiError(400, "Space with this name already exists")
    }

    const space = await Space.create({
        header, 
        customMessage,
        spaceName,
        isStarRating:isStarRating || false,
        questions:questions||[],
        theme:theme||'light',
        owner:req.user?._id
    })

    if(!space){
        throw new ApiError(401, "Something went wrong while creating the space");
    } 
    return res
    .status(200)
    .json(new ApiResponse(200, space, "Space Created Successfully"));
}
)

const deleteSpace = asyncHandler(async(req,res)=>{
    const {spaceId} = req.params

    if(!isValidObjectId(spaceId)){
        throw new ApiError(400, "Invalid Space ID");
    }

    const space = await Space.findByIdAndDelete(spaceId)

    if(!space){
        throw new ApiError(400, "Space Not Found");
    }

   return res.status(200).json(new ApiResponse(200, {}, "Space deleted Successfully"))
})

const updateSpace = asyncHandler(async(req,res)=>{
    const {header, customMessage, theme, isStarRating, questions} = req.body
    const {spaceId} = req.params

    if(!isValidObjectId(spaceId)){
        throw new ApiError(400, "Invalid Space ID");
    }

    if([header, customMessage].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "Header and custom Message are required");
    }

    const space = await Space.findByIdAndUpdate(spaceId, 
    {
        $set:{
            header,
            customMessage,
            theme, 
            isStarRating,
            questions
        },
    },
    {new:true}
)
    if(!space){
        throw new ApiError(400, "Space not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, space, "Space Updated Successfully"));
})

const getSpaceById = asyncHandler(async(req,res)=>{
    const {spaceId} = req.params;
    if (!isValidObjectId(spaceId)) {
        throw new ApiError(400, "Invalid Space ID");
    }
    const space = await Space.findById(spaceId)
    if(!space){
        throw new ApiError(400, "Space not found");
    }

    return res.status(200)
    .json(new ApiResponse(200, space, "Fetched Space Successfully"))
})

const getUserSpaces = asyncHandler(async(req,res)=>{
    const user = req.user
    if(!user){
        throw new ApiError(400, "User not found")
    }
    const UserSpaces = await Space.find({
        owner:user._id
    })

    if(UserSpaces.length=== 0){
        return res.status(200).json(new ApiResponse(200, {}, "User has no spaces"));
    }

    return res.status(200).json(new ApiResponse(200, UserSpaces, "User Spaces Fetched Successfully"));
})


export {
        createSpace, 
        deleteSpace, 
        updateSpace, 
        getSpaceById, 
        getUserSpaces
       }





