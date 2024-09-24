/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from '../utils/emailSend.js';
import { createError } from '../middlewere/error.handler.js';
import userModel from '../models/user.model.js';

// register user
export const handleReg = async (req, res, next) => {
  const {name, username, email,phone, password , role} = req.body;

  if (!username || !email || !password) {
    return next(createError(400, 'All fields are required!'));
  }

  try {
    let user = await userModel.findOne({ username });
    if (user) {
      return next(createError(400, 'Username already exists!'));
    }

    user = await userModel.findOne({ email });
    if (user) {
      return next(createError(400, 'Email already exists!'));
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 3600000; // 1 hour

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      username,
      email,
      phone,
      role,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry
    });

    await newUser.save();

    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).send({
      message: 'Registration complete! Please check your email to verify your account.',
      success: true
    });
  } catch (error) {
    next(error);
  }
};

// verify email
export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(createError(400, 'Invalid token'));
  }

  try {
    const user = await userModel.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return next(createError(400, 'Invalid or expired token'));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();
    res.status(200).send('Email verified successfully!');
  } catch (error) {
    next(error);
  }
};

// resend verify email  
export const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(createError(400, 'Email is required!'));
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return next(createError(404, 'User not found!'));
    }

    if (user.isVerified) {
      return next(createError(400, 'Email is already verified!'));
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).send('Verification email resent successfully!');
  } catch (error) {
    next(error);
  }
};

// login user
export const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return next(createError(404, 'Email Not Found'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(createError(400, 'Incorrect Password'));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userDetails } = user._doc;

    res.status(200).send({
      jwt: token,
      message: 'Login successful.',
      user: userDetails
    });
  } catch (error) {
    next(error);
  }
};

// get all users
export const getUsers = async (req, res, next) => {
  const { status, search } = req.query;

  try {
    const filter = status && status !== 'all' ? { status } : {};

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive regex
      filter.$or = [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } }
      ];
    }
    res.status(200).json(usersWithOrders);
  } catch (error) {
    next(error);
  }
};

// get user by id
export const getUser = async (req,res,next) => {
  try {
    const user = await userModel.findById(req.params.id);
    // const userOrders = await orderModel.find({userId: req.params.id})
    res.status(201).send({
      ...user.toObject(),
      // userOrders
    });
  } catch (error) {
    next(error)
  }
};

// get logged user info
export const getLoggedUser = async (req,res,next) => {
  try {
    const user = await userModel.findById(req.user.id);
    const { password: _, ...userDetails } = user._doc;
    res.status(200).send({
      ...user.toObject(),
    });
  } catch (error) {
    next(error)
  }
};

// update logged user
export const updateLoggedUser = async (req, res,next) => {
  const { name, phone, img,address } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, img, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(createError(404, 'User not found!'));
    }

    res.status(200).send('Update SuccessFull');
  } catch (error) {
    next(error);
  }
};

// update user
export const updateUser = async (req, res,next) => {
  const { id } = req.params;
  const { username, email, status } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { username, email, status },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(createError(404, 'User not found!'));
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (req, res,next) => {
  const { id } = req.params;

  try {
    const deleteUser = await userModel.findByIdAndDelete(id);

    if (!deleteUser) {
      return next(createError(404, 'User not found!'))
    }

    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error)
  }
};

// change password
export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(createError(400, 'Current password and new password are required'));
  }

  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(createError(400, 'Current password is incorrect'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send('Password changed successfully' );
  } catch (error) {
    next(error);
  }
};

// forgot password
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // const resetUrl = `${req.protocol}://${req.get('host')}/password-reset/${resetToken}`;
    const resetUrl = `http://localhost:3000/password-reset/${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

// reset password
export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('Invalid token or token has expired');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    await sendPasswordResetConfirmationEmail(user.email);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};



