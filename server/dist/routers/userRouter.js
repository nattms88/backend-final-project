import { Router } from "express";
import { check } from 'express-validator';
import UserController from "../controllers/UserController.js";
const router = Router();
router.get('/users', UserController.searchUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/register', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email format.'),
    check('password').isStrongPassword()
        .withMessage(`minLength: 6, maxLength: 10, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1`),
    check('role').isIn(['USER', 'ADMIN']).withMessage('Invalid role')
], UserController.registerUser);
router.post('/login', [
    check('username').isEmail().withMessage('Invalid username format.'),
    check('password').isLength({ min: 6, max: 10 }).withMessage('Password should have 6 to 10 chars long')
], UserController.loginUser);
router.put('/users/:id', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email format.'),
    check('password').isStrongPassword()
        .withMessage(`minLength: 6, maxLength: 10, minLowercase: 1,
    minUppercase: 1, minNumbers: 1, minSymbols: 1`),
    check('role').isIn(['USER', 'ADMIN']).withMessage('Invalid role')
], UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);
export default router;
//# sourceMappingURL=userRouter.js.map