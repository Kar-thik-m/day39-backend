import mongoose from "mongoose";

const appUserSchema=new mongoose.Schema({
    id: {
        type: 'string',
        require: true,
    },
    Name: {
        type: 'string',
        require: true,
    },
   
   email:{
        type:'string',
        require: true,
    },
    password:{
        
        type:'string',
        require: true,
    },
    ResetKey:{
        type:'string',
        require: true,
    }
});
     


export const AppUserModel = mongoose.model('users ',appUserSchema);