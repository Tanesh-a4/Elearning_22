import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique : true,
    },
    password:{
        type: String,
        required:true,
    },
    role :{
        type : String,
        enum : ['admin','user', 'teacher'],
        default : 'user', 
    },
    designation:{
        type:String, 
        default : 'user',   
    },
    mainrole:{
        type: String,
        default : 'user',
    },
    subscription:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref :"Courses",
        },
    ]
},{
    timestamps:true,
}
);

export const User = mongoose.model("User",schema);