const User = require("../models/User");

const { BadRequestError, UnauthenticatedError } = require("../errors");

const authResponse = (name,email,mobile, token) => {
    return {
        name,
        email,
        mobile,
        token,
    };
};

const registerUser = async (userData) => {
    console.log("register route hit!!");
    try {
        const user = await User.create(userData);
        const token = user.createJWT();
        return {signup:true,token};
    } catch (error) {
        throw new UnauthenticatedError("User Creation Failed");
    }
};

const loginUser = async (userData) => {
    const { email, password } = userData;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError("Can not find the user");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("wrong password");
    }

    const token = user.createJWT();
    console.log(token);
    return authResponse(user.name,user.email,user.mobile,token);
};

module.exports = { registerUser, loginUser };
