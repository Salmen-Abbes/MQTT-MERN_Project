const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser,updateUser,findUserById } = require('../models/userModel');
const nodemailer = require('nodemailer');


const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await findUserByEmail(email);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await createUser({ name, email, password: hashedPassword, role: 'user' });
  res.status(201).json({ message: 'User created', userId });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'No User Found with this email' });
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user.id, role: user.role }, '590dca403de6d33a3402e01b88b56ae0e26a36e6fd5f2ecd41e80841e2a0bb1a', { expiresIn: '1h' });
  res.status(200).json({ token });
};

let transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "dottaabbes3344@gmail.com",
    pass: "sysn iexd xivh ukaj",
  },
});

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate and save password reset token
    const token = jwt.sign({ id: user.id, role: user.role }, '590dca403de6d33a3402e01b88b56ae0e26a36e6fd5f2ecd41e80841e2a0bb1a', { expiresIn: '1h' });
    user.resetPasswordToken = token;
    await updateUser(user);

    // Send email with password reset link
    let mailOptions = {
      from: 'dottaabbes3344@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:3000/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent with further instructions' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, '590dca403de6d33a3402e01b88b56ae0e26a36e6fd5f2ecd41e80841e2a0bb1a');

    // Find user by id
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if token is valid
    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await updateUser(user);

    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const validate = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, '590dca403de6d33a3402e01b88b56ae0e26a36e6fd5f2ecd41e80841e2a0bb1a');
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, access: user.access });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  validate
};
