import express from 'express';
import { changePassword, deleteUser, forgotPassword, getLoggedUser, getUser, getUsers, handleLogin, handleReg, resendVerifyEmail, resetPassword, updateLoggedUser, updateUser, verifyEmail } from '../controller/user.controller.js';
import { verifyToken } from '../middlewere/verify.token.js';

export const userRoute = express.Router();

userRoute.post('/register', handleReg);

userRoute.post('/login', handleLogin);

userRoute.post('/verify-email', verifyEmail);

userRoute.post('/resend-verify-email', resendVerifyEmail);

userRoute.get('/me', verifyToken, getLoggedUser);

userRoute.put('/user/edit/:id', verifyToken, updateUser);
    
userRoute.get('/users', verifyToken, getUsers);

userRoute.get('/user/:id', verifyToken, getUser);

userRoute.put('/user/update', verifyToken, updateLoggedUser);

userRoute.delete('/users/delete/:id', verifyToken, deleteUser);

userRoute.put('/change-password', verifyToken, changePassword);

userRoute.post('/forgot-password', forgotPassword); //for submit email

userRoute.post('/reset-password', resetPassword); //for submit new password
