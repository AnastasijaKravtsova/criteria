import { MarkUpData } from '../../interfaces/iCriterionFabric';
import { Operations } from '../../support/operations';

export abstract class AbstractProcessor {
  punctuationMarks = ['.', ',', ':', ';', '-', '–', '?', '!', '_'];
  markUpData: MarkUpData;

  wordsCount = 0;
  formattedEr: any;
  predefinedValues: string[] = [];

  constructor(markUpData: any) {
    this.markUpData = markUpData;
  }

  countWords(): void {
    this.wordsCount = Operations.countWords(this.markUpData.text);
  }

  tallyErrors(): void {
    let arSelCounts = [];

    for (let i in this.markUpData.selections) {
      arSelCounts.push({
        code: this.markUpData.selections[i].type.toLowerCase(),
        tag: this.markUpData.selections[i].tag,
        count: 1,
      });
    }

    this.formattedEr = this.getCountIds(arSelCounts);
  }

  getCountIds = (target: { code: string; tag: string; count: number }[]) => {
    type Result = { [key: string]: number };
    type tagMark = { [key: string]: boolean };
    let result: Result = {};
    let tagTempVar: tagMark = {};

    target.forEach((item) => {
      if (item.code !== undefined) {
        result[item.code] && !tagTempVar[item.code]
          ? result[item.code]++
          : (result[item.code] = 1);
        if (item.tag !== '') {
          tagTempVar[item.code] = true;
        }
      }
    });
    return this.countCategoryMistakes(result);
  };

  countCategoryMistakes(result: { [key: string]: number }) {
    //орфографические ошибки *
    let spellingMistakes: number = 0;
    //пунктуационные ошибки *
    let punctuationMistakes: number = 0;

    //грамматические ошибки
    let grammaticalMistakes: number = 0;
    //речевые ошибки
    let speechMistakes: number = 0;
    //логические ошибки
    let logicMistakes: number = 0;
    //фактические ошибки
    let factualMistakes: number = 0;
    //этические ошибки
    let ethicalMistakes: number = 0;

    // console.log(result);

    for (let key in result) {
      if (key.match(/^г\./)) {
        grammaticalMistakes++;
        delete result[key];
      }
      if (key.match(/^р\./)) {
        speechMistakes++;
        delete result[key];
      }
      if (key.match(/^л\./)) {
        logicMistakes++;
        delete result[key];
      }
      if (key.match(/^ф\./)) {
        factualMistakes++;
        delete result[key];
      }
      if (key.match(/^э\./)) {
        ethicalMistakes++;
        delete result[key];
      }
    }
    grammaticalMistakes !== 0
      ? (result['ошграм'] = grammaticalMistakes)
      : (result['ошграм'] = 0);
    speechMistakes !== 0
      ? (result['ошреч'] = speechMistakes)
      : (result['ошреч'] = 0);
    logicMistakes !== 0
      ? (result['ошлог'] = logicMistakes)
      : (result['ошлог'] = 0);
    factualMistakes !== 0
      ? (result['ошфакт'] = factualMistakes)
      : (result['ошфакт'] = 0);
    ethicalMistakes !== 0
      ? (result['ошэтич'] = ethicalMistakes)
      : (result['ошэтич'] = 0);

    //@todo зануляем непонятные ошибки
    result['ошпункт'] = 0;
    result['ошорф'] = 0;

    this.fillBasicMarkUps(result);

    return result;
  }

  fillBasicMarkUps(finalResult: any): void {
    this.predefinedValues.forEach((element: string) => {
      if (!finalResult.hasOwnProperty(element)) {
        finalResult[element] = 0;
      }
    });
  }

  analyze(): any {
    this.predefinedValues.forEach((value, index, array) => {
      array[index] = value.toLowerCase();
    });
    this.countWords();
    this.tallyErrors();
  }
}
