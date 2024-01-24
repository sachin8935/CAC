const user = require("../models/adminAuthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// exports.signup = async (req, res) => {
//   try {
//     const { userid, password, role } = req.body;
//     const existingUser = await user.findOne({ userid });
//     if (existingUser) {
//       res.status(400).json({
//         message: "User already exists",
//         success: false,
//       });
//     }
//     let hashedPassword;
//     try {
//       hashedPassword = await bcrypt.hash(password, 10);
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         message: "error in hashing the password",
//       });
//     }
//     const entry = await user.create({
//       userid,
//       password: hashedPassword,
//       role,
//     });
//     return res.status(200).json({
//       success: true,
//       message: "User created successfully",
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.login = async (req, res) => {
  try {
    const { userid, password } = req.body;

    if (!userid || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username and password.",
      });
    }

    const entry = await user.findOne({ userid });

    if (!entry) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. User does not exist.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, entry.password);

    if (isPasswordMatch) {
      const payload = {
        userid: entry.userid,
        id: entry._id,
        role: entry.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      entry.token = token;
      entry.password = undefined;

      const cookieOptions = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Ensure HTTPS in production
        // sameSite: "Strict", // or "Lax" based on your requirements
      };

      res.cookie("token", token, cookieOptions).status(200).json({
        success: true,
        token,
        entry,
        role: entry.role,
        message: "User logged in successfully.",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials. Password did not match.",
      });
    }
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};
