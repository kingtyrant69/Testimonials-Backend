import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {Testimonial} from '../models/textTestimonial.model';

const createTestimonial = asyncHandler(async(req,res)=>{
    const {name, email, review, starRating} = req.body

    if([name, email, review].some((field) => field?.trim()==="")){
        throw new ApiError("Name, Email, Review is required");
    }
    let testimonial = null
    if(!starRating){
    testimonial = await Testimonial.create({
        name, email, review
    })
    }else{
    testimonial = await Testimonial.create({
            name, email, review, starRating
        })
    }
    if(!testimonial){
        throw new ApiError(500, "Something went wrong while creating the testimonial");
    } 
})

export {createTestimonial}