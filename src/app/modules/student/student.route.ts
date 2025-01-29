import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middleWares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

//client => router will call => controler
//router.post('/create-student', StudentControllers.createStudent);

router.get('/:studentId', StudentControllers.getSingleStudent);

router.patch('/:studentId', validateRequest(studentValidations.updateStudentValidationSchema) ,StudentControllers.updateStudent);

router.delete('/:studentId', StudentControllers.deleteStudent);

router.get('/', StudentControllers.getAllStudents);

export const StudentRoutes = router;