const User = require('../models/user.model');
const createError = require('http-errors');
const login = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const userCurrent = await User.findOne({ userId });
        if(!userCurrent)  {
            res.status(404).json({
                statusCode: 404,
                message: `The UserID ${userId} was undefined. Please check your User ID and try again.`
            })
        }
        res.status(200).json({
            status: 200,
            message: `${userId} login success`
        })
    } catch (error) {
        // console.log(error);
        next(error);
    }
}

const register = async (req, res, next) => {
   try {
        const { userId } = req.body;
        const userCurrent = await User.findOne({ userId });
        if(userCurrent) {
            res.status(404).json({
                statusCode: 409,
                message: `The ${userId} is already exist`
            })
        }
        const newUser = await User.create({ userId });
        res.status(200).json({
            message: `${userId} has been created`,
            newUser
        })
   } catch (error) {
        next(error);
   }

}

module.exports = {
    login,
    register
}