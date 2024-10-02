import express from 'express';
import Controller from '../controllers/pdf';
import validation from '../middlewares/validation';

const Router = express.Router();

Router.use('/api/upload/pdf', validation, Controller.uploadPage);

export default Router;
