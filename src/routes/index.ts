import express from 'express';
import { downloadPdf } from '../controllers/ParserController';
import validation from '../middlewares/middleware';

const Router = express.Router();

Router.use('/api/download/pdf', validation, downloadPdf);

export default Router;
