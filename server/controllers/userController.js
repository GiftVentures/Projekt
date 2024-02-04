const User = require('../models/userModel')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const nodeMailer = require('nodemailer')
const {welcomeMail} = require('../mails/welcome')

const sendMail = async (name, recipientEmail) => {
    const html = welcomeMail(name);

    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL, // A Gmail címed
            pass: process.env.SENDER_EMAIL_PASSWORD // A Gmail jelszavad
        }
    });

    // Levél küldése
    const mailOptions = {
        from: `GiftVentures <${process.env.SENDER_EMAIL}>`,
        to: recipientEmail, // A címzett e-mail címe
        subject: 'Regisztráció',
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail elküldve:', info.response);
    } catch (error) {
        console.error('Hiba az e-mail küldésekor:', error);
    }
};


const createToken = (_id, isAdmin) =>{
    return jwt.sign({_id, isAdmin}, process.env.SECRET, {expiresIn:'3d'})
}

const loginUser = async (req, res) => {
   const {email, password} = req.body
   try{
    const user = await User.login(email,password)
    const id = user._id
    const token = createToken(user._id, user.isAdmin)
    res.status(200).json({id, token})
}catch(error){
    res.status(400).json({error: error.message})
}
}

const signupUser = async (req, res) => {
    const {email, firstName, secondName, password} = req.body
    try{
        const user = await User.signup(email, firstName, secondName, password)
        const id = user._id
        const token = createToken(user._id)
        if (token) {
            sendMail(user.firstName, user.email)
        }
        res.status(200).json({id, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

const getUserData = async (req, res) => {
    const userId = req.user._id; 
    try {
        const user = await User.findOne({ _id: userId }, 'email firstName secondName mobile birthDate placeOfBirth address savedPrograms');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Felhasználó nem található' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Szerverhiba' });
    }
}

const updateUser = async (req, res) => {
    const { email, firstName, secondName, password, mobile, placeOfBirth, birthDate, address, programId } = req.body;
    const userId = req.user._id; 
    try {
        let updateFields = {};
        
        // Felhasználó keresése az adatbázisban
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Jelszó frissítése
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
            updateFields.password = hash;
        }

        // Egyéb mezők frissítése, ha meg vannak adva
        if (email) updateFields.email = email;
        if (firstName) updateFields.firstName = firstName;
        if (secondName) updateFields.secondName = secondName;
        if (mobile) updateFields.mobile = mobile;
        if (placeOfBirth) updateFields.placeOfBirth = placeOfBirth;
        if (birthDate) updateFields.birthDate = birthDate;
        if (address) updateFields.address = address;

        if (programId) {
            if (!user.savedPrograms.includes(programId)) {
                user.savedPrograms.push(programId);
                await user.save();
                return res.status(200).json({ message: 'Program hozzáadva a felhasználóhoz' });
            } else {
                user.savedPrograms.pull(programId);
                await user.save();
                return res.status(200).json({ message: 'Program eltávolítva a felhasználótól' });
            }
        }
        

        // Felhasználó frissítése az adatbázisban
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateFields, { new: true });

        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { signupUser, loginUser, getUserData, updateUser };