import express from 'express';
import { AppUserModel } from '../db-connect/model.js';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

import { transport,mailOptions } from './mail.js';
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {

    try {
        const payload = req.body;
        const appUser = await AppUserModel.findOne({ email: payload.email }, { id: 1, Name: 1, email: 1, _id: 0 });
        if (appUser) {
            res.status(409).send({ msg: 'user already exits' });
            return;
        }
        // hashing the password for storing in db
        bcrypt.hash(payload.password, 10, async function (err, hash) {
            if (err) {
                res.status(500).send({ msg: 'Error in registring' });
                return;
            }
            const authuser = new AppUserModel({ ...payload, password: hash, id: v4() });
            await authuser.save();
        })
        res.send({ msg: 'user register successfully ' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: 'Error in creating' })
    }
});





authRouter.post('/login', async function (req, res) {
    try {
        const payload = req.body;
        const appUser = await AppUserModel.findOne({ email: payload.email }, { id: 1, name: 1, email: 1, password: 1, _id: 0 });
        if (appUser) {
             bcrypt.compare(payload.password, appUser.password, (_err, result) => {
                if (!result) {
                    res.status(401).send({ msg: "invalid credentials" });
                } else {
                    const responceObj = appUser.toObject();
                    delete responceObj.password;
                    res.send(responceObj);
                }
            })
        }
        else {
            res.status(404).send({ msg: 'user not found' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).send({ msg: 'user not found' });
    }
});

authRouter.post('password',async(req,res)=>{
    const payload=req.body;
    const appUser=await AppUserModel.findOne({ email:payload.email }, { name: 1, email: 1, _id: 0 });
    try {
    
        if (appUser) {
            const responceObj = appUser.toObject();
            const link = `${process.env.FRONTEND_URL}/?resetpassword`;
            console.log(link);
    
            await transport.sendMail({
                ...mailOptions,
                to: payload.email,
                text: link,
            });
    
            res.send({ responceObj, msg: 'user updated ' });
        } else {
            res.status(404).send({ msg: 'user not found' });
        }
    } catch (err) {
        console.log(err);
    }
})

authRouter.put('/resetpassword',async (req,res)=>{
    try{
        const payload=req.body;
        
            
           const hashedPassword=await bcrypt.hash(payload.password,10)
          
            await AppUserModel.updateOne({email:payload.email},{'$set':{password:hashedPassword,}});
            res.send({msg:"updated password"})
       
    
    }catch{
        res.status(500).send({msg:"passwords updation failed"})  
    }
})



export default authRouter;