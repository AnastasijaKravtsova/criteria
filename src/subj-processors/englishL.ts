import {AbstractProcessor} from "./abstractProcessor";
import {Operations} from "../support/operations";

export class EnglishL extends AbstractProcessor {
    criterions = {
        K1: 0,
        K2: 0,
        K3: 0,
        K4: 0,
        K5: 0
    }

    predefinedValues: string[] = [
        'ПРОБЛЕМА', 'ЛМНЕНИЕ', 'ПРМНЕНИЕ', 'ДОВОД', 'ОБОСНОВАНИЕ', 'ВЫВОД',
        'А.стиль', 'А.аспект', 'А.объем', 'А.непрод',
        'А.логика', 'А.нсвязь', 'А.связь', 'А.абзац', 'А.лексика', 'А.запас',
        'А.грамм', 'А.повтор', 'А.уровень', 'А.несоотв',
        'А.орф', 'А.пункт']

    LMElem: any
    PMElem: any
    firstPClose: number | null = 0
    firstClose: number | null = 0
    endClose: number | null = 0
    endPClose: number | null = 0
    arReason: any = []
    arPReason: any = []

    oshPlanErrorsCount: number = 0


    /*

        ошАспекты = [ЛМНЕНИЕ=0] + [ПРМНЕНИЕ=0] + max(3 – ДОВОД, 0) + [ОБОСНОВАНИЕ=0];
        если (А.объем<200 слов) или (А.непрод>30% слов) то К1 = 0;
        иначе если (ошАспекты=0) и (А.аспект=0) и (А.стиль<=1) то К1 = 3;
        иначе если (ошАспекты=0) и (А.аспект<=2) и (А.стиль<=3), то К1 = 2;
        иначе если (ошАспекты*2+А.аспект<=4) и (А.стиль<=4), то К1 = 1;
        иначе К1 = 0;
        если (К1 = 0), то К = 0 и остальные критерии не вычисляем;
        @todo необходимо, чтобы ДОВОД-ы ЛМНЕНИЯ имели одинаковые теги с ЛМНЕНИЕ, равно как и ДОВОД-ы ПРМНЕНИЕ с ПРМНЕНИЕ
        @todo - уточнить - блоки значения ошПлан следуют один за другим и не могут быть вложены друг в друга?
        ошПлан = число блоков, отсутствующих или нарушающих порядок следования в последовательности {ПРОБЛЕМА, ЛМНЕНИЕ, {ДОВОД-ы, относящиеся к ЛМНЕНИЕ}, ПРМНЕНИЕ, {ДОВОД-ы, относящиеся к ПРМНЕНИЕ}, ОБОСНОВАНИЕ, ВЫВОД};
        если (ошПлан=0) и (А.логика=0) и (А.нсвязь=0) и (А.связь=0) и (А.абзац=0) то К2 = 3;
        иначе если (ошПлан + А.логика + А.нсвязь + А.абзац<=4) и (А.связь=0) то К2 = 2;
        иначе если (ошПлан + А.логика + А.связь + А.абзац<=8) то К2 = 1;
        иначе К2 = 0;
        если (А.лексика<=1) и (А.запас=0) то К3 = 3;
        иначе если (А.лексика+3*А.запас<=3) то К3 = 2;
        иначе если (А.лексика<=4) и (А.запас<=1) то К3 = 1;
        иначе К3 = 0;

        если (А.грамм<=2) и (А.уровень=0) и (А.несоотв=0) то К4 = 3;
        иначе если (А.грамм<=4) и (А.уровень=0) и (А.несоотв=0) то К4 = 2;
        иначе если (А.грамм<=7) и (А.уровень=0) и (А.несоотв<=1) то К4 = 1;
        иначе К4 = 0;

        если (А.орф<=1) и (А.пункт<=1) то К5 = 2;
        иначе если (А.орф+А.пункт<=4) то К5 = 1;
        иначе К5 = 0;
        итоговая оценка K = К1 + К2 + К3 + К4 + К5  (максимальное значение К=14).
     */
    analyze(): any {
        //считаем количество ошПлан
        this.setOshErrors()

        super.analyze()
        this.setK1()

        if (this.criterions.K1 === 0) {
            return this.criterions
        }

        this.setK2()
        this.setK3()
        this.setK4()
        this.setK5()

        return this.criterions
    }

    setK1(): void {
        let oshAspects = this.setOshAspects()

        //@todo А.непрод - не понятно, как считать
        if (this.formattedEr['А.объем'] || this.formattedEr['А.непрод']) {
            this.criterions.K1 = 0
        } else if (oshAspects === 0 && this.formattedEr['А.аспект'] === 0 && this.formattedEr['А.стиль'] <= 1) {
            this.criterions.K1 = 3
        } else if (oshAspects === 0 && this.formattedEr['А.аспект'] <= 2 && this.formattedEr['А.стиль'] <= 3) {
            this.criterions.K1 = 2
        } else if ((oshAspects * 2 + this.formattedEr['А.аспект']) <= 4 && this.formattedEr['А.стиль'] <= 4) {
            this.criterions.K1 = 1
        } else {
            this.criterions.K1 = 0
        }
    }

    setK2(): void {
        if (this.oshPlanErrorsCount === 0 && this.formattedEr['А.логика'] === 0 &&
            this.formattedEr['А.нсвязь'] === 0 && this.formattedEr['А.связь'] === 0 && this.formattedEr['А.абзац'] === 0) {
            this.criterions.K2 = 3
        } else if (Operations.sum(this.oshPlanErrorsCount, this.formattedEr['А.логика'], this.formattedEr['А.нсвязь'], this.formattedEr['А.абзац']) <= 4 &&
            this.formattedEr['А.связь'] === 0) {
            this.criterions.K2 = 2
        } else if (Operations.sum(this.oshPlanErrorsCount, this.formattedEr['А.логика'], this.formattedEr['А.связь'], this.formattedEr['А.абзац']) <= 8) {
            this.criterions.K2 = 1
        } else {
            this.criterions.K2 = 0
        }
    }

    setK3(): void {
        if (this.formattedEr['А.лексика'] <= 1 && this.formattedEr['А.запас'] === 0) {
            this.criterions.K3 = 3
        } else if ((this.formattedEr['А.лексика'] + 3 * this.formattedEr['А.запас']) <= 3) {
            this.criterions.K3 = 2
        } else if (this.formattedEr['А.лексика'] <= 4 && this.formattedEr['А.запас'] <= 1) {
            this.criterions.K3 = 1
        } else {
            this.criterions.K3 = 0
        }
    }

    setK4(): void {
        if (this.formattedEr['А.грамм'] <= 2 && this.formattedEr['А.уровень'] === 0 && this.formattedEr['А.несоотв'] === 0) {
            this.criterions.K4 = 3
        } else if (this.formattedEr['А.грамм'] <= 4 && this.formattedEr['А.уровень'] === 0 && this.formattedEr['А.несоотв'] === 0) {
            this.criterions.K4 = 2
        } else if (this.formattedEr['А.грамм'] <= 7 && this.formattedEr['А.уровень'] === 0 && this.formattedEr['А.несоотв'] <= 1) {
            this.criterions.K4 = 1
        } else {
            this.criterions.K4 = 0
        }
    }

    setK5(): void {
        if (this.formattedEr['А.орф'] <= 1 && this.formattedEr['А.пункт'] <= 1) {
            this.criterions.K5 = 2
        } else if ((this.formattedEr['А.орф'] + this.formattedEr['А.пункт']) <= 4) {
            this.criterions.K5 = 1
        } else {
            this.criterions.K5 = 0
        }
    }

    setOshAspects(): number {
        let param1 = this.formattedEr['ЛМНЕНИЕ'] === 0 ? 1 : 0
        let param2 = this.formattedEr['ПРМНЕНИЕ'] === 0 ? 1 : 0
        let param3 = Math.max(3 - this.formattedEr['ДОВОД'], 0)
        let param4 = this.formattedEr['ОБОСНОВАНИЕ'] === 0 ? 1 : 0

        return param1 + param2 + param3 + param4
    }

    //@todo параметр ошПлан до конференции считаем равным 1
    setOshErrors() {
        return this.oshPlanErrorsCount = 1
        let arStartParams: { [key: string]: number } = {}
        let arEndParams: { [key: string]: number } = {}

        for (let i in this.markUpData.selections) {
            //
            if (this.markUpData.selections[i].code !== 'ДОВОД') {
                arStartParams[this.markUpData.selections[i].code] = this.markUpData.selections[i].startSelection
                arEndParams[this.markUpData.selections[i].code] = this.markUpData.selections[i].endSelection
            }

            if (this.markUpData.selections[i].code === 'ЛМНЕНИЕ') {
                this.LMElem = this.markUpData.selections[i]
            }

            if (this.markUpData.selections[i].code === 'ПРМНЕНИЕ') {
                this.PMElem = this.markUpData.selections[i]
            }
        }

        this.setReasonCoordinates()
        this.calculateReasonErrors(arStartParams, arEndParams)


        // console.log(this.firstClose);
        // console.log(this.endClose);
        console.log('----------------');
        console.log(arStartParams);
        console.log('-------end------');
        console.log(arEndParams);
        console.log('----------------');

        let arStrStandard: string[] = []
        let arStrMarkUp = ['ПРОБЛЕМА', 'ЛМНЕНИЕ', 'ПРМНЕНИЕ', 'ВЫВОД', 'ОБОСНОВАНИЕ']

        for (let i in this.markUpData.selections) {
            if (arStrMarkUp.includes(this.markUpData.selections[i].code)) {
                arStrStandard.push(this.markUpData.selections[i].code)
            }
        }

        //считаем разницу в массивах смысловых блоков
        let difference = arStrMarkUp.filter(x => !arStrStandard.includes(x));
        this.oshPlanErrorsCount = this.oshPlanErrorsCount + difference.length
        // console.log(difference.length);

        arStrStandard.forEach((item, key, array) => {
            if (item !== arStrMarkUp[key]) {
                this.oshPlanErrorsCount++
                // console.log('----- элемент - ' + item + '   не на своем месте');
            }
        })

        console.log(this.oshPlanErrorsCount);
    }

    setReasonCoordinates(): void {
        let l = 0
        let q = 0
        for (let j in this.markUpData.selections) {
            if (this.markUpData.selections[j].code === 'ДОВОД') {
                if (this.markUpData.selections[j].tag === this.LMElem.tag) {
                    this.arReason[l] = {
                        id: l,
                        start: this.markUpData.selections[j].startSelection,
                        end: this.markUpData.selections[j].endSelection,
                    }
                    l++
                }

                if (this.markUpData.selections[j].tag === this.PMElem.tag) {
                    this.arPReason[q] = {
                        id: q,
                        start: this.markUpData.selections[j].startSelection,
                        end: this.markUpData.selections[j].endSelection,
                    }
                    q++
                }
            }
        }
    }

    calculateReasonErrors(arStartParams: any, arEndParams: any): void {
        //если доводов нет - запишем в ошибки ошПлан
        if (this.arReason.length === 0) {
            this.oshPlanErrorsCount++
        } else {
            for (let k in this.arReason) {
                console.log('ключ');
                console.log(k);
                //1й довод должен следовать аккурат за ЛМНЕНИЕ-м
                this.firstClose = this.findTheClosest(arStartParams, this.arReason[k].start)
                this.endClose = this.findTheClosest(arEndParams, this.arReason[k].end)

                //в случае, если ближайшее совпадение вниз не соответствует ЛМНЕНИЮ - записываем в ошибки
                if (this.LMElem.startSelection !== this.firstClose && this.PMElem.endSelection !== this.endClose) {
                    this.oshPlanErrorsCount++
                }
                console.log(k);
            }
        }

        if (this.arPReason.length === 0) {
            this.oshPlanErrorsCount++
        } else {
            for (let f in this.arPReason) {
                //1й довод должен следовать аккурат за ПРМНЕНИЕ-м
                this.firstPClose = this.findTheClosest(arStartParams, this.arPReason[f].start)
                this.endPClose = this.findTheClosest(arEndParams, this.arPReason[f].end)

                //в случае, если ближайшее совпадение вниз не соответствует ПРМНЕНИЕ - записываем в ошибки
                if (this.LMElem.startSelection !== this.firstPClose && this.LMElem.endSelection !== this.endPClose) {
                    this.oshPlanErrorsCount++
                }
                console.log(f);
            }
        }
    }

    findTheClosest(arr: { [key: string]: number }, base: number) {
        let theClosest = null

        for (let i in arr) {
            if (arr[i] <= base && (theClosest == null || (base - arr[i]) < (base - theClosest))) {
                theClosest = arr[i]
            }
        }

        return theClosest
    }
}
