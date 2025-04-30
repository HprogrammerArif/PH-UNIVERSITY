import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check if the token is send from client
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorize user!!',
      );
    }

    // // check if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    //VALIDATION
    const user = await User.isUserExistsByCustomId(userId);
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
        'You are not authorized. HM..Token!!',
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized. HM..!!',
      );
    }
    // const { userId, role } = decoded;
    req.user = decoded as JwtPayload;
    next();

    // // check if the token is valid
    // jwt.verify(
    //   token,
    //   config.jwt_access_secret as string,
    //   function (err, decoded) {
    //     if (err) {
    //       throw new AppError(
    //         httpStatus.UNAUTHORIZED,
    //         'You are not authorized!!',
    //       );
    //     }

    //     const role = (decoded as JwtPayload)?.role;

    //     if (requiredRoles && !requiredRoles.includes(role)) {
    //       throw new AppError(
    //         httpStatus.UNAUTHORIZED,
    //         'You are not authorized. HM..!!',
    //       );
    //     }

    //     // decoded
    //     // const { userId, role } = decoded;
    //     req.user = decoded as JwtPayload;
    //     next();
    //   },
    // );
  });
};

export default auth;
