const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new mongodb.MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const database = client.db('Smart_Bell');
const User = database.collection("Authentication");
const InvestorRegister = database.collection("InvestorRegister");
const ClientRegister = database.collection("ClientRegister");
const UserType = database.collection("UserType");

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            password: hashedPassword
        };

        await User.insertOne(newUser)

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post("/ClientRegister",async (req,res)=>{
    const {role,
        companyName,
        industry,
        experienceLevel,
        linkedinProfile,
        otherIndustry,
        referralCode,email} = req.body;
        try{
            await UserType.insertOne({email:email,type:"Client"});
            await ClientRegister.insertOne({role:role,
                companyName:companyName,
                industry:industry,
                experienceLevel:experienceLevel,
                linkedinProfile:linkedinProfile,
                referralCode:referralCode,
                otherIndustry:otherIndustry,
                email:email
            });
            res.status(200).json({message:"successfully registered"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"})
        }
});

app.post("/InvestorRegister",async (req,res)=>{
    console.log(req.body);
    const {investorType,
        investmentRange,
        industries,
        location,
        linkedinProfile,
        accreditation,
        termsAccepted,
        investmentExperience,email} = req.body;
        try{
            await UserType.insertOne({email:email,type:'Investor'});
            await InvestorRegister.insertOne({
                investorType:investorType,
        investmentRange:investmentRange,
        industries:industries,
        location:location,
        linkedinProfile:linkedinProfile,
        accreditation:accreditation,
        termsAccepted:termsAccepted,
        investmentExperience:investmentExperience,
        email:email
            })
            res.status(200).json({message:"successfully registered"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"})
        }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});
