import { Router } from 'express';
import {borrowCreate, getAllBorrow, getOneBorrow, deleteBorrow, updateBorrow} from '../controllers/borrowController';
import { protect, restrictTo } from '../controllers/authController';


const borrowRoute = Router();

borrowRoute.get('/', protect, restrictTo("Admin", "Employé"), getAllBorrow);
borrowRoute.get('/:id', protect, getOneBorrow);
borrowRoute.post('/create', protect, restrictTo("Employé", 'Admin'), borrowCreate);
borrowRoute.post('/update/:id', protect, restrictTo("Employé", "Admin"), updateBorrow);
borrowRoute.delete('/delete/:id', protect, restrictTo("Employé", "Admin"), deleteBorrow);


export default borrowRoute;