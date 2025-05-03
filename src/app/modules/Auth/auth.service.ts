import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload?.id);
  console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not foundsss!!');
  }

  // // Check if the user already exists
  // const isUserExists = await User.findOne({ id: payload?.id });
  // console.log(isUserExists);
  // if (!isUserExists) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'User is not found!!');
  // }

  // // checking if the user is already deleted
  // const isDeleted = isUserExists?.isDeleted;
  // if (isDeleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!!');
  // }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!!');
  }

  // // checking if the user is blocked
  // const userStatus = isUserExists?.status;
  // if (userStatus === 'blocked') {
  //   throw new AppError(httpStatus.FORBIDDEN, 'User not found. {BLOCKED}!');
  // }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User not found. {BLOCKED}!');
  }

  // // Checking if the password is correct
  // const isPasswordMatched = await bcrypt.compare(
  //   payload?.password,
  //   isUserExists?.password,
  // );
  // console.log(isPasswordMatched);
  // if (!isPasswordMatched) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'User Password did not matched!');
  // }

  // Checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Password did not matched!');
  }

  // Access granted: Send access token, send refresh token
  // CREATE TOKEN AND SEND TO THE CLIENT

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  //ACCESS TOKEN
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_exprires_in as string,
  );

  //REFRESH TOKEN
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_exprires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exists
  const user = await User.isUserExistsByCustomId(userData?.userId);
  console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not foundsss!!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User not found. {BLOCKED}!');
  }

  // Checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Password did not matched!');
  }

  // if everthing ok, hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData?.userId,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  // return result;
  return null;
};

const refreshToken = async (token: string) => {
  //JOD ALREADY HANDALING IT
  // // check if the token is send from client
  // if (!token) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize user!!');
  // }

  // // check if the given token is valid

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  // console.log(decoded);
  const { userId, iat } = decoded;

  //VALIDATION
  const user = await User.isUserExistsByCustomId(userId);
  console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not foundsss!!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is BLOCKED!');
  }

  // check if token hecked! is changedPass issued later
  if (
    user?.passwordChangedAt &&
    (await User.isJWTIssuedBeforePasswordChanged(
      user?.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized. HM..Refresh Token!!',
    );
  }

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  //ACCESS TOKEN
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_exprires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  //checking if the user is exists
  const user = await User.isUserExistsByCustomId(userId);
  console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not foundsss!!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is BLOCKED!');
  }

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  //RESET TOKEN
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '15m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user?.email, resetUILink);
  console.log(resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  //checking if the user is exists
  const user = await User.isUserExistsByCustomId(payload?.id);
  //console.log({user});

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not foundsss!!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is BLOCKED!');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if(payload?.id !== decoded?.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is not authorized!');
  }


    // if everthing ok, hash new password
    const newHashedPassword = await bcrypt.hash(
      payload?.newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    
  await User.findOneAndUpdate(
    {
      id: decoded?.userId,
      role: decoded?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  //console.log({decoded});

};



export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
