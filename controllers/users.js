import user from '../models/users.js';
import { validateEmail, validateUsername } from '../utils/validations.js';
import { OAuth2Client } from 'google-auth-library';
export const getAllUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json({ users: users });
  } catch (error) {
    console.log('Error in getAllUsers ' + error);
  }
};

export const register = async (req, res) => {
  const {
    username,
    email,
    // password,
    phoneNumber,
    state,
    institutionName,
    course,
  } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const isUsernameValid = validateUsername(username);
  if (!isUsernameValid) {
    return res.status(400).json({ message: 'Invalid username' });
  }

  const usernameExists = await user.findOne({ username: username });
  if (usernameExists) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  // if (password.length < 6)
  //   return res
  //     .status(400)
  //     .json({ message: 'Password should contain atleast 6 Characters' });
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const emailExists = await user.findOne({ email: email });
  if (emailExists) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  try {
    const newUser = new user({
      email,
      username,
      password,
      phoneNumber,
      state,
      institutionName,
      course,
    });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const client = new OAuth2Client(process.env.CLIENT_ID);
    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID,
    });
    const { email_verified, email, name, picture } = verify.payload;
    if (!email_verified) res.json({ message: 'Email Not Verified' });
    const userExist = await user.findOne({ email });
    if (userExist) {
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: tokenId, user: userExist });
    } else {
      // const password = email + process.env.CLIENT_ID;
      let username = name.replace(/\s+/g, '');
      const newUser = await user({
        username,
        profilePic: picture,
        // password,
        email,
      });
      await newUser.save();
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ message: 'User registered Successfully', token: tokenId });
    }
  } catch (error) {
    res.status(500).json({ error: error });
    console.log('error in googleAuth backend' + error);
  }
};

export const login = async (req, res) => {
  return;
};
