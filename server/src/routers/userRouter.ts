import { Router } from "express";
import { check } from 'express-validator';
import UserController from "../controllers/UserController.js";
import { checkRoles } from "../middlewares/authMiddleware.js";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /auth/users:
 *   get:   
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/User'
 */

// Get all users
router.get('/users', [checkRoles(['ADMIN'])], UserController.getAllUsers);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// Register a new user
router.post(
    '/register',
    [
        check('username').notEmpty().withMessage('Username is required'),
        check('email').isEmail().withMessage('Invalid email format.'),
        check('password').isStrongPassword()
        .withMessage(`minLength: 6, maxLength: 10, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1`),
    ],
    UserController.registerUser
);

/**
 * @swagger
 * /auth/login:
 *   post:   
 *     summary: Login of a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// Login
router.post(
    '/login',
    [
        check('username').isEmail().withMessage('Invalid username format.'),
        check('password').isLength({ min: 6, max: 10 }).withMessage('Password should have 6 to 10 chars long')
    ],
    UserController.loginUser
);

/**
 * @swagger
 * /auth/users/{id}:
 *   put:   
 *     summary: Update an existing user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// Update an existing user
router.put('/users/:id',
[
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email format.'),
    check('password').isStrongPassword()
    .withMessage(`minLength: 6, maxLength: 10, minLowercase: 1,
    minUppercase: 1, minNumbers: 1, minSymbols: 1`),
    checkRoles(['ADMIN'])
],
UserController.updateUser
);

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:   
 *     summary: Delete an existing user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */


// Delete a user
router.delete('/users/:id', [checkRoles(['ADMIN'])], UserController.deleteUser);

export default router;