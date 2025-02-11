import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import genToken from "../utils/token.js";


// Email validation function
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};


export const signUp = async (req, res) => {

    try {
        const { name, username, email, password, gender } = req.body

        const user = await User.findOne({ username })

        if (user)
            return res.status(400).json({ error: "user already exits" })

        // Check if the email is valid
        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        //random profilePic
        //profilepic random
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`


        const newUser = await User({
            name,
            username,
            email,
            password: hashPassword,
            gender,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            await newUser.save()
            genToken(newUser._id, res)

            return res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                gender: newUser.gender,
                profilePic: newUser.profilePic
            })
        }
        else {
            res.status(500).json({ error: "bad request" })
        }


    } catch (error) {

        console.log(error.message)
        res.status(404).json({ error: "some error has occured" })

    }


}


export const login = async (req, res) => {
    const { username, password } = req.body


    try {

        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        // console.log(isPasswordCorrect)
        if (!user) {

            return res.status(400).json({ error: "user not exists" })
        }

        if(!isPasswordCorrect)
        {
            return res.status(400).json({ error: "password is not correct" })

        }

        genToken(user._id, res)

        return res.status(200).json({

            _id: user._id,
            name: user.name,
            username: user.username,
            email:user.email,
            gender: user.gender,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: error.message })
    }

}

export const logout = (req, res) => {
    try {
        res.cookie("cookie", "", { maxAge: 0 })
        res.status(200).json({ message: "loged out successfully" })

    } catch (error) {
        console.log(error.message)
        return res.status(404).json({ error: error.message })
    }
}