import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fsp from 'fs/promises';
import puppeteer from 'puppeteer';
import { tmpPath, publicPath, generateRandomFileName } from '../shared/utils';
import axios from 'axios';
import report from 'puppeteer-report';
import { getPdfTemplate } from '../template/pdfTemplate';

async function fetchHtml(url: string) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    throw err;
  }
}

async function generatePDF(html: string) {
  try {
    const browser: any = await puppeteer.launch({
      headless: true,
      defaultViewport: null
    });
    
    const htmlFilePath = path.resolve(tmpPath, generateRandomFileName('html'));
    const pdfFilePath = path.resolve(tmpPath, generateRandomFileName('pdf'));

    const options: any = {
      path: pdfFilePath,
      scale: 1,
      printBackground: true,
      format: 'a4',
      margin: {
        left: '30px',
        right: '30px',
        top: '20px',
        bottom: '20px'
      }
    };

    await fsp.writeFile(htmlFilePath, html);

    await report.pdf(browser, htmlFilePath, options);

    await fsp.unlink(htmlFilePath);

    await browser.close();

    return pdfFilePath;
  } catch (err) {
    throw err;
  }
}

export default class Controller {
  static async uploadPage(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.body;

      const html = await fetchHtml(url);

      // const pdfPath = await generatePDF(html);
      const resetStylePath = path.resolve(publicPath, 'reset.css');
      const stylePath = path.resolve(publicPath, 'style.css');

      const pdfContext = {
        textTitle: '10  САМЫХ ДЛИННЫХ СЛОВ',
        textHeader: '10  САМЫХ ДЛИННЫХ СЛОВ',
        textFooter: 'Все права защищены &copy; 2024',
        styles: [resetStylePath, stylePath],
        scripts: [],
        words: [
          'Антиконституционный',
          'Транскрипция',
          'Интернационализация',
          'Электронный',
          'Микроорганизм',
          'Параллелепипед',
          'Декларация',
          'Субкультура',
          'Неопределённость',
          'Многообразие'
        ]
      };

      const htmlTemplate = getPdfTemplate(pdfContext);
      const pdfPath = await generatePDF(htmlTemplate);
      return res.json({ message: 'successfully', pdfPath, html });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      return res.json({ message: 'successfully' });
    } catch (err) {
      return next(err);
    }
  }
}
