import express from 'express';
import validateRequest from '../../middleWares/validateRequest';
import {OfferedCourseValidations } from './OfferedCourse.validation';
import { OfferedCourseControllers } from './OfferedCourse.controller';

const router = express.Router();

router.get('/', OfferedCourseControllers.getAllOfferedCourses);

router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse);

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);


router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse);

export const OfferedCourseRoutes = router;
