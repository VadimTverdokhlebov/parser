import path from 'path';
import fsp from 'fs/promises';
import puppeteer from 'puppeteer';
import report from 'puppeteer-report';
import { publicPath, tmpPath } from '../shared/utils';

interface PdfContext {
  textTitle: string;
  textHeader: string;
  textFooter: string;
  words: string[];
}

interface Context extends PdfContext {
  styles: Array<string>;
  scripts: Array<string>;
}

export class PdfManager {
  private pdfContext: PdfContext;

  private context: Context;

  private styles: Array<string>;

  private scripts: Array<string>;

  private resetStylePath: string;

  private stylePath: string;

  private fileSaveBuffer: Buffer | undefined;

  private pdfFileName: string | undefined;

  private htmlFileName: string | undefined;

  private pdfFilePath: string | undefined;

  private htmlFilePath: string | undefined;

  constructor(pdfContext: PdfContext) {
    this.pdfContext = pdfContext;
    this.resetStylePath = path.resolve(publicPath, 'reset.css');
    this.stylePath = path.resolve(publicPath, 'style.css');
    this.styles = [this.resetStylePath, this.stylePath];
    this.scripts = [];
    this.context = {
      textTitle: this.pdfContext.textTitle,
      textHeader: this.pdfContext.textHeader,
      textFooter: this.pdfContext.textFooter,
      styles: this.styles,
      scripts: this.scripts,
      words: this.pdfContext.words
    };
  }

  public async generatePDF() {
    const browser: any = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.pdfFileName = this.generateRandomFileName('pdf');
    this.htmlFileName = this.generateRandomFileName('html');

    this.pdfFilePath = path.resolve(tmpPath, this.pdfFileName);
    this.htmlFilePath = path.resolve(tmpPath, this.htmlFileName);

    const options: any = {
      path: this.pdfFilePath,
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

    const html = this.getHtmlTemplate();

    await fsp.writeFile(this.htmlFilePath, html);
    await report.pdf(browser, this.htmlFilePath, options);

    this.fileSaveBuffer = await fsp.readFile(this.pdfFilePath);

    await fsp.unlink(this.htmlFilePath);
    await browser.close();

    return this;
  }

  public getPdf() {
    return {
      filename: this.pdfFileName,
      content: this.fileSaveBuffer,
      contentType: 'application/pdf'
    };
  }

  public getPathToPdf() {
    return this.pdfFilePath;
  }

  public getPdfFileName() {
    return this.pdfFileName;
  }

  private generateRandomFileName(extension = 'txt', length = 8) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    const date = new Date();
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    return `${date.getTime()}${randomString}.${extension}`;
  }

  private getHtmlTemplate(): string {
    return `<!DOCTYPE html>
  <html lang="ru">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${this.context.textTitle}</title>
      ${this.context.styles.map(item => `<link rel="stylesheet" charset="utf-8" href="${item}" />`).join('\n\t')}
  </head>
  <body>
      <header id="header">
          <div>${this.context.textHeader}</div>
      </header>
  
      <div id="content">
          ${this.context.words.map(item => `<div>${item}</div>`).join('\n\t\t')}
      </div>
  
      <footer id="footer">
          <div>${this.context.textFooter}</div>
      </footer>
      ${this.context.scripts.map(item => `<script charset="utf-8" src="${item}"></script>`).join('\n\t')}
  </body>
  </html>`;
  }
}
