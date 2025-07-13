const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();

module.exports = (collections) => {
  const { User,UserType } = collections;

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const check = await UserType.findOne({email});
      if(!check){
        const result = await User.deleteOne({email});
        if(!result){
          return res.status(400).json({message:'Cannot find details'});
        }
        return res.status(400).json({message:'Registration was incomplete, deleting the exisiting account'});
      }
      const jwtToken = jwt.sign({email,id:user.id},process.env.PRIVATEKEY,{expiresIn:process.env.EXPIRETIME})
      return res.status(200).json({ message: 'Login successful',jwtToken,id:user.id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/forgotPassword',async (req,res)=>{
    try{
      const {email,newPassword} = req.body;
    const user = await User.findOne({email});
    console.log(email);
    if(!user){
      return res.status(400).json({message:'Invalid Email'});
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.updateOne({email},{$set:{'password':hashedPassword}});
    if(result.modifiedCount === 0){
      return res.status(400).json({message:'No changes were made'});
    }
    res.status(200).json({message:'sucessfully updated'});
    }
    catch(error){
      console.log(error);
      return res.status(500).json({error:'Internal Server Error'});
    }
  });
  router.get('/emailCheck',async (req,res)=>{
    try{
      const {email} = req.query;
      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({message:'Couldnt find user',success:false});
      }
      return res.status(200).json({message:'Email Successfully found',success:true})
    }catch(err){
      console.log(err);
      return res.status(500).json({error:'Internal Server Error',success:false});
    }
  })
  return router;
};
