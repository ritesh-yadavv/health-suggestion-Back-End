
import bcrypt from 'bcrypt'
import User from '../models/user.model.js';
export const updateuser = async (req, res) => {
    // console.log("this is me")

    try {
        if (req.body.password) {
            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
        }
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${req.body.username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${req.body.username}`
        req.body.profilePic = req.body.gender === 'male' ? boyProfilePic : girlProfilePic
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

        if (!updatedUser)
            return res.status(500).json({ message: "unable to update the user" })
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            gender: updatedUser.gender,
            profilePic: updatedUser.profilePic,
        })


    } catch (error) {
        console.log(error.message)
        return res.status(404).json({ error: error.message })



    }
}

