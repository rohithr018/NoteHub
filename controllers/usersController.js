const User = require('../models/user')
const Note = require('../models/note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//GET
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No Users Found!' })
    }
    res.json(users)
})
//POST
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    //confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All Fields are Required' })
    }

    //Check duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Username' })
    }

    //Hash Password
    const hashedPwd = await bcrypt.hash(password, 10)//salt rounds
    const userObject = { username, 'password': hashedPwd, roles }

    //Create and Store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid User Data Received' })
    }


})
//UPDATE
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    //confirm Data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All Fields are Required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User Not Found!' })
    }

    //Check for Duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    //Allow updates to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        //hash pasword
        user.password = await bcrypt.hash(password, 10)//salt
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} Updated` })

})
//DELETE
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'User Id Required' })
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note?.length) {
        return res.status(400).json({ message: 'User has Asssigned Notes' })
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }
    //const result=

    const { username, _id } = user;
    await user.deleteOne()
    // const reply=`Username ${username} with ID ${_id} Deleted`
    // await user.deleteOne()
    const reply = `Username ${username} with ID ${_id} Deleted`

    res.json(reply)

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}