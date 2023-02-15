import { body } from 'express-validator';

export const loginValidation = [body('email').exists().isEmail()];
