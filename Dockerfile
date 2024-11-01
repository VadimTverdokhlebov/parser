# Используем официальный образ Node.js в качестве базового
FROM node:23

# Устанавливаем необходимые зависимости для Chromium
RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    libnss3 \
    libxss1 \
    libgconf-2-4 \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    fonts-liberation \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Добавляем репозиторий Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list

# Устанавливаем Google Chrome
RUN apt-get update && apt-get install -y google-chrome-stable

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения в контейнер
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# Открываем порт, если ваше приложение использует его (например, 3000)
EXPOSE 3000

# Определяем команду для запуска приложения
# CMD ["npm", "start"]