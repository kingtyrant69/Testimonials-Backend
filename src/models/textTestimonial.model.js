import mongoose,{Schema} from "mongoose";

const testimonialSchema = new Schema(
{
    name:{
        type:String,
    },
    email:{
        type:String, 
    },
    review:{
        type:String, 
    },
    starRating:{
        type:Number,
        default:null
    },
    space:{
        type:Schema.Types.ObjectId,
        ref:'Space'
    }, 
},
{
    timestamps:true
})

export default Testimonial = mongoose.model('Testimonial', testimonialSchema);