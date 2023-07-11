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
    phoneNumber,
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

      phoneNumber,
      state,
      institutionName,
      class: course,
    });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
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
    const { email_verified, email, name, picture } = verify.payload;
    if (!email_verified) res.json({ message: 'Email Not Verified' });
    const userExist = await user.findOne({ email });
    if (userExist) {
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: tokenId, user: userExist });
    } else {
      let username = name.replace(/\s+/g, '');
      const newUser = await user({
        username,
        profilePic: picture,

        email,
      });
      await newUser.save();
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 60 * 24 * 60 * 60 * 1000,
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
  const { phoneNumber } = req.data;
  return;
};
