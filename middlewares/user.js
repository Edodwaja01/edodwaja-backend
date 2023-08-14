import jwt from 'jsonwebtoken';
import user from '../models/users.js';
export const AuthenticateUser = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(400).json({ message: 'No Headers' });
  }
  // let token = req.headers.authorization.split(' ')[1]; //when using postman this line
  let token = req.headers.authorization.split(' ')[0]; //when using browser this line
  try {
    if (token.length < 500) {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
      const verifiedUser = await user
        .findOne({ _id: verifyToken.id })
        .select('-password');
      if (!verifiedUser)
        return res.status(401).json({ message: 'Not Authorize! Login first' });
      req.rootUser = verifiedUser;
      req.token = token;
    } else {
      let data = jwt.decode(token);
      console.log(data);
      const googleUser = await user
        .findOne({ email: data.email })
        .select('-password');
      if (!googleUser)
        return res.status(401).json({ message: 'Not Authorize! Login first' });
      req.rootUser = googleUser;
      req.token = token;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Invalid Access Token' });
  }
};
