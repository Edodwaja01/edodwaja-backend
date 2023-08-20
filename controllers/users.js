import user from '../models/users.js';
import { validateEmail, validateUsername } from '../utils/validations.js';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';

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
    phoneNumber,
    password,
    state,
    institutionName,
    course, //class = course
  } = req.body;
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

  if (!state) return res.status(400).json({ message: 'Provide state' });
  if (!course) return res.status(400).json({ message: 'Provide class' });
  if (!institutionName)
    return res.status(400).json({ message: 'Provide Institution Name' });

  try {
    const newUser = new user({
      email,
      username,
      password,
      phoneNumber,
      state,
      institutionName,
      class: course,
    });
    const accessToken = await newUser.generateAuthToken();
    await newUser.save();
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      message: 'User registered successfully',
      token: accessToken,
      user: {
        userId: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
export const additionalInfo = async (req, res) => {
  const { userId, age, domains } = req.body;
  if (!userId) return res.status(403).json({ message: 'User not provided' });
  if (!age) return res.status(400).json({ message: 'Age should not be empty' });

  if (!domains || !Array.isArray(domains)) {
    return res
      .status(400)
      .json({ message: 'Domains should be an array of strings' });
  }
  if (domains.length === 0) {
    return res
      .status(400)
      .json({ message: 'Domains array should not be empty' });
  }
  const areAllDomainsStrings = domains.every(
    (domain) => typeof domain === 'string'
  );

  if (!areAllDomainsStrings)
    return res
      .status(400)
      .json({ message: 'Domains should be an array of strings' });
  const userExits = await user.findOne({ _id: userId });
  if (!userExits) return res.status(403).json({ message: "User dosn't exits" });
  try {
    await user.findByIdAndUpdate(userId, {
      age,
      domains,
    });

    return res.status(201).json({ message: 'Age and domains added' });
  } catch (error) {
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
    console.log(verify);
    const { email_verified, email, name, picture } = verify.payload;
    if (!email_verified) res.json({ message: 'Email Not Verified' });
    const userExist = await user.findOne({ email });
    if (userExist) {
      res.cookie('accessToken', tokenId, {
        httpOnly: true,
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: tokenId, user: userExist });
    } else {
      let username = name.replace(/\s+/g, '') || 'test';
      const password = email + Date.now().toString();
      const newUser = await user({
        username,
        profilePic: picture,
        email,
        password,
      });
      res.cookie('accessToken', tokenId, {
        httpOnly: true,
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
      await newUser.save();
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
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const userExist = await user.findOne({ email: email });

  if (!userExist) {
    return res.status(409).json({ message: 'User not exists' });
  }

  if (!password) return res.status(400).json({ message: 'Provide Password' });
  if (password.length < 6)
    res
      .status(400)
      .json({ message: 'Password should contain more than 6 characters' });

  const validPassword = await bcrypt.compare(password, userExist.password);

  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid Password' });
  }
  const accessToken = await userExist.generateAuthToken();
  const userData = {
    userId: userExist._id,
    userName: userExist.username,
  };
  await userExist.save();
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 60 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    message: 'Login Sucessfull',
    accessToken: accessToken,
    user: userData,
  });
};
export const validUser = async (req, res) => {
  const userValid = await user
    .findOne({ _id: req.rootUser._id })
    .select('-password');
  console.log(userValid);

  if (!userValid)
    return res.status(403).json({ message: 'User not Authenticated' });
  return res.status(200).json({ message: 'User Authenticated' });
};
export const reportIssue = async (req, res) => {
  const { image, description, transactionId } = req.body;
  if (!image && !description && !transactionId)
    return res.status(400).json({ message: 'Provide atleast one field' });
  if (image) res.send('Image sended');
  if (description) res.send('Description send');
  if (transactionId) res.send('transactionid send');
};
export const getUser = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: 'Provide User Id' });
  try {
    const requestedUser = await user
      .findOne({ _id: userId })
      .populate({
        path: 'courses',
        modal: 'Course',
      })
      .populate({
        path: 'products',
        modal: 'Product',
      })
      .select('-password');

    res.status(200).json({ user: requestedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
