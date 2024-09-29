import mongoose,{Schema} from "mongoose";

const spaceSchema = new Schema(
{
    spaceName:{
        type:String,
        required:true,
        unique:true,
    },
    header:{
        type:String, 
        required:[true, "Header is required"]
    },
    customMessage:{
        type:String,
        required:[true, "Custom Message is required"]
    },
    questions:[String],
    isStarRating:{
        type:Boolean,
        default: false
    },
    theme:{
        type:String,
        default: 'light'    
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},
{timestamps:true});


export const Space = mongoose.model('Space', spaceSchema);