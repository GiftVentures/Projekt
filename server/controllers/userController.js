const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')


const createToken = (_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'})
}


//login user
const loginUser = async (req, res) => {
   const {email, password} = req.body
   try{
    const user = await User.login(email,password)
    const id = user._id

    const token = createToken(user._id)

    res.status(200).json({id, token})
}catch(error){
    res.status(400).json({error: error.message})
}
}

//signup user
const signupUser = async (req, res) => {
    const {email, firstName, secondName, password} = req.body
    try{
        const user = await User.signup(email, firstName, secondName, password)
        const id = user._id

        const token = createToken(user._id)

        res.status(200).json({id, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}


//Getting the user data
const getUserData = async (req, res) => {
    const userId = req.user._id; 
    try {
        const user = await User.findOne({ _id: userId }, 'email firstName secondName mobile birthDate placeOfBirth address');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Felhasználó nem található' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Szerverhiba' });
    }
}

//Updating the user
const updateUser = async (req, res) => {
    const { email, firstName, secondName, password, mobile, placeOfBirth, birthDate, address } = req.body;
    console.log(req.body);
    const userId = req.user._id; 
    try {
        
        const user = await User.findOne({ _id: userId });
        if (password){
            const match = await bcrypt.compare(password, user.password)
            console.log(match);
            if (match) {
                return res.status(400).json('Az új jelszó nem lehet a korábbi jelszavad!')
            }
            if (!validator.isStrongPassword(password)){
                return res.status(400).json('Nem elég erős a jelszó')
            }
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            user.password = hash;
        }
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user properties if provided in the request body
        user.email = email;
        user.firstName = firstName;
        user.secondName = secondName;
        user.mobile = mobile;
        user.placeOfBirth = placeOfBirth;
        user.birthDate = birthDate;
        user.address = address;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { signupUser, loginUser, getUserData, updateUser };