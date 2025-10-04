import User from "../models/User.js"; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
dotenv.config();

//Get the user data for the frontend:
/*const getUserDataForResponse = (user) => ({
    _id: user._id,
    fullName: user.fullName, // bcos I changed the initial FullName to  'fullName'
    email: user.email,
    role: user.role,
});*/

const registerUser = async (req, res) => {
    try {
        console.log("request recevied");
        const { fullName, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ fullName, email, password: hashedPassword, role: role || "user" });  // Default role is "user"
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });  
//to implement an improving, we can get the user data in this way: res.json({ token, user: getUserDataForResponse(user) });
        res.json({ token, userId: user._id, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
//login logic:
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" }); //it´s better use 401 for credentials

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); //playload token using standard id and role

        res.json({ token, userId: user._id, role: user.role }); //if we implement the improving, in this line we shoul chanche th res.json too: res.json({ token, user: getUserDataForResponse(user) });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



export { registerUser, loginUser };
