import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middleWares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

//client => router will call => controler
//router.post('/create-student', StudentControllers.createStudent);

router.get('/:id', StudentControllers.getSingleStudent);

router.patch('/:id', validateRequest(studentValidations.updateStudentValidationSchema) ,StudentControllers.updateStudent);

router.delete('/:id', StudentControllers.deleteStudent);

router.get('/', StudentControllers.getAllStudents);

export const StudentRoutes = router;