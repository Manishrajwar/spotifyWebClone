const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    // fetch the data
    const { userName, firstName, password, lastName, email , gender } = req.body;

    // validation
    if (!firstName || !lastName || !email || !password || !userName ) {
      return res.status(403).json({
        success: false,
        message: `please give the all details `,
      });
    }

    // does the user is already exist with this email or not
    const user = await User.findOne({email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: `user already exist with this  email `,
      });
    }

    // check the another user exist with same userName or not
    const checkUserName = await User.findOne({userName:userName});
    if(checkUserName){
      return res.status(400).json({
        success:false,
        message:"please enter unique userName"
      })
    }

    // this is a valid request

    // now create a new User
    //todo: we do not store password in plane text-> so we convert it into hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password:hashPassword,
      userName,
      gender
    });

    newUser.toObject();
    newUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: `successfully signup`,
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in signup , please try again ",
    });
  }
};

// ! login 
exports.login = async (req, res) => {
  try {
    // get email and password
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: `please fill the follwing details first `,
      });
    }

    // check user exist with email or not
    let userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(403).json({
        success: false,
        message: "user do not exist with this email id ",
      });
    }

    const payload = {
      email: userExist.email,
      id: userExist._id,
    };

    // check password
    if (await bcrypt.compare(password, userExist.password)) {
      //  create token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      userExist = userExist.toObject();
      userExist.token = token ;
      userExist.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 34 * 60 * 60*60*60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        userExist,
        message: "login successfully",
      });
    }
    else{
        return res.json({
            success:false,
            message:"please enter valid password "
        })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in the login ",
    });
  }
};
