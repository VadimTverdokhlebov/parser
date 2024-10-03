import path from 'path';
import Typo from 'typo-js';
import * as cheerio from 'cheerio';
import { publicPath } from '../shared/utils';

export class WordService {
  private langs: string[];
  private dictionaries: Map<string, Typo>;
  private words: string[];

  constructor(langs: string[]) {
    this.langs = langs;
    this.words = [];
    this.dictionaries = this.loadDictionaries();
  }

  private loadDictionaries(): Map<string, Typo> {
    console.time('dictionaryDownloadTime');
    const dictionaries = new Map();
    const availableDictionaries = new Set(['en_US', 'ru_RU']);

    for (const candidateLang of this.langs) {
      if (availableDictionaries.has(candidateLang)) {
        dictionaries.set(
          candidateLang,
          new Typo(candidateLang, null, null, { dictionaryPath: path.join(publicPath, 'dictionaries') })
        );
      }
    }

    console.timeEnd('dictionaryDownloadTime');

    return dictionaries;
  }

  public getDictionaries(): Map<string, Typo> {
    return this.dictionaries;
  }

  public checkRuWord(word: string): Boolean | undefined {
    const isCorrectly = this.dictionaries.get('ru_RU')?.check(word);
    return isCorrectly;
  }

  public checkEnWord(word: string): Boolean | undefined {
    const isCorrectly = this.dictionaries.get('en_US')?.check(word);
    return isCorrectly;
  }

  public extractUniqueWordsFromHtml(html: string) {
    const $ = cheerio.load(html);
    const text = $('body').text();
    const words = text.match(/\w+/g) || [];
    this.words = [...new Set(words)];
    return this;
  }

  public sortedWords() {
    this.words.sort((a, b) => b.length - a.length);
    return this;
  }

  public validateEnglishWords() {
    this.words = this.words.filter(word => this.checkEnWord(word));
    return this;
  }

  public validateRussianWords() {
    this.words = this.words.filter(word => this.checkRuWord(word));
    return this;
  }

  public getWords(count: number) {
    return this.words.slice(0, count);
  }
}
