interface PdfContext {
  textTitle?: string;
  textHeader?: string;
  textFooter?: string;
  styles: string[];
  scripts: string[];
  words: string[];
} 

export function getPdfTemplate<T extends PdfContext>(context: T): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${context.textTitle || 'title'}</title>

    ${context.styles.map(item => `<link rel="stylesheet" charset="utf-8" href="${item}" />`).join('')}

</head>
<body>
    <header id="header">
        <div>${context.textHeader || 'header'}</div>
    </header>

    <div id="content">
        ${context.words.map(item => `<div>${item}</div>`).join('')}
    </div>

    <footer id="footer">
        <div>${context.textFooter || 'footer'}</div>
    </footer>

    ${context.scripts.map(item => `<script charset="utf-8" src="${item}"></script>`).join('')}

</body>
</html>`;
}
