import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { WordService } from '../services/WordService';
import { PdfManager } from '../services/PdfService';
import config from '../config';
import path from 'path';

const wordService = new WordService(['en_US']);

export async function downloadPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const { url } = req.body;
    const { data } = await axios.get(url);

    const words = wordService.extractUniqueWordsFromHtml(data).sortedWords().validateEnglishWords().getWords(10);

    const pdfContext = {
      textTitle: '10 самых длинных слов',
      textHeader: 'Список слов',
      textFooter: 'Все права защищены &copy; 2024',
      words
    };

    const pdfManager = new PdfManager(pdfContext);
    const pdfFileName = (await pdfManager.generatePDF()).getPdfFileName();

    return res.json({ url: path.join(config.appUrl || '', pdfFileName || '') });
  } catch (err) {
    return next(err);
  }
}
