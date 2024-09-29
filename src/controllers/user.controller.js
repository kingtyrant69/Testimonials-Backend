import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
       const user = await User.findById(userId)
 
       const accessToken = await user.generateAccessToken() 
       const refreshToken = await user.generateRefreshToken()
 
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave: false});
 
       return {accessToken, refreshToken}
    }catch(error){
       throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {email, fullname, password} = req.body;

    if([email,fullname,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All the fields are required")
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(400, "User with email already exists");
    }

    const user = await User.create({
        fullname, 
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating a user")
    }

    return res.status(201).json(new ApiResponse(201, user, "User account created Successfully"))
});

const loginUser = asyncHandler(async(req,res) => {
    try {
        const {email, password} = req.body;
    
        if([email, password].some((field)=>field?.trim()==="")){
            throw new ApiError(400, "All fields are required");
        }
    
        const user = await User.findOne({email:email});
        if(!user){
            throw new ApiError(400, "User not found");
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if(!isPasswordValid){
            throw new ApiError(400, "Incorrect Password entered")
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite:'lax'
        }
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {user:loggedInUser, accessToken, refreshToken}, "User logged In Successfully"))
    } catch (error) {
        console.log(error)
    }
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{    
                refreshToken:1,
            },
        },
        {
            new:false
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorised Request")
    }
    
    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const options = { 
            httpOnly : true,
            secure:true
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user?._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {accessToken, refreshToken}, "Access Token Refreshed Successfully"))
    }
    catch(error){
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


export{registerUser, loginUser, logoutUser, refreshAccessToken}