"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var criterionFabric_1 = require("./estimate/criterionFabric");
var appointmentFabric_1 = require("./appointment/appointmentFabric");
var markUpExample = {
    meta: {
        topic: 'topic',
        class: 11,
        year: 2020,
        subject: 'his',
        test: 'test',
        category: 'category',
        expert: 'expert',
        timeMarkup: 'timeMarkup',
        timeSecondMarkup: 'timeSecondMarkup',
    },
    criterias: {
        'K1': 0,
        'K2': 0,
        'K3': 0
    },
    selections: [
        {
            id: 1,
            startSelection: 50,
            endSelection: 52,
            code: 'О.теорсвязь',
            comment: 'Комментарий1',
            explanation: 'Пояснение1',
            correction: 'Исправление1',
            tag: 'tag1',
            type: 'error',
        },
        {
            id: 2,
            startSelection: 50,
            endSelection: 52,
            code: 'Р.знач',
            comment: 'Комментарий1',
            explanation: 'Пояснение1',
            correction: 'Исправление1',
            tag: 'tag1',
            type: 'error',
        },
        {
            id: 3,
            startSelection: 50,
            endSelection: 52,
            code: 'Р.мест',
            comment: 'Комментарий1',
            explanation: 'Пояснение1',
            correction: 'Исправление1',
            tag: 'tag1',
            type: 'error',
        },
        {
            id: 4,
            startSelection: 50,
            endSelection: 52,
            code: 'Р.прист',
            comment: 'Комментарий1',
            explanation: 'Пояснение1',
            correction: 'Исправление1',
            tag: 'tag1',
            type: 'error',
        },
        {
            id: 5,
            startSelection: 7,
            endSelection: 20,
            code: 'ПОНЯТИЕ',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'tag2',
            type: 'meaning',
        },
        {
            id: 6,
            startSelection: 7,
            endSelection: 20,
            code: 'ПОНЯТИЕ',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'tag2',
            type: 'meaning',
        },
        {
            id: 7,
            startSelection: 7,
            endSelection: 20,
            code: 'РОЛЬ',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ1',
            type: 'meaning',
        },
        {
            id: 8,
            startSelection: 7,
            endSelection: 20,
            code: 'И.личность',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ1',
            type: 'meaning',
        },
        {
            id: 9,
            startSelection: 7,
            endSelection: 20,
            code: 'РОЛЬ',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ2',
            type: 'meaning',
        },
        {
            id: 10,
            startSelection: 7,
            endSelection: 20,
            code: 'РОЛЬ',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ3',
            type: 'meaning',
        },
        {
            id: 10,
            startSelection: 7,
            endSelection: 20,
            code: 'И.лроль',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ3',
            type: 'meaning',
        },
        {
            id: 11,
            startSelection: 7,
            endSelection: 20,
            code: 'И.личность',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ1',
            type: 'meaning',
        },
        {
            id: 12,
            startSelection: 7,
            endSelection: 20,
            code: 'И.лроль',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ1',
            type: 'meaning',
        },
        {
            id: 13,
            startSelection: 7,
            endSelection: 20,
            code: 'И.лроль',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'РОЛЬ2',
            type: 'meaning',
        },
        {
            id: 14,
            startSelection: 7,
            endSelection: 20,
            code: 'ПРИЧИНА',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС1',
            type: 'meaning',
        },
        {
            id: 15,
            startSelection: 7,
            endSelection: 20,
            code: 'СЛЕДСТВИЕ',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС1',
            type: 'meaning',
        },
        {
            id: 16,
            startSelection: 7,
            endSelection: 20,
            code: 'И.причин',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС1',
            type: 'meaning',
        },
        {
            id: 17,
            startSelection: 7,
            endSelection: 20,
            code: 'И.следств',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС1',
            type: 'meaning',
        },
        {
            id: 18,
            startSelection: 7,
            endSelection: 20,
            code: 'И.следств',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС2',
            type: 'meaning',
        },
        {
            id: 18,
            startSelection: 7,
            endSelection: 20,
            code: 'И.понятие',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС2',
            type: 'meaning',
        },
        {
            id: 18,
            startSelection: 7,
            endSelection: 20,
            code: 'И.неиспол',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС2',
            type: 'meaning',
        },
        {
            id: 18,
            startSelection: 7,
            endSelection: 20,
            code: 'И.понятие',
            comment: 'Комментарий2',
            explanation: 'Пояснение2',
            correction: 'Исправление2',
            tag: 'ПСС2',
            type: 'meaning',
        },
    ],
    originalText: "Подтип ошибки или комментарий кратко объясняет учащемуся суть ошибки. Для каждого типа ошибок в классификаторе предусмотрено несколько подтипов. Каждому подтипу соответствует свой стандартный комментарий (то есть подтип ошибки – это, по сути, аббревиатура для стандартного комментария). Если эксперт считает, что ни один из стандартных комментариев не подходит для данного случая, то он может записать свой комментарий. Текст комментария должен быть лаконичным и называть типовую ошибку, встречающуюся во многих работах. Комментарий не должен обращаться к тексту данной работы."
};
var y = new criterionFabric_1.CriterionFabric(markUpExample).run();
console.log(y);
var x = new appointmentFabric_1.AppointmentFabric(markUpExample, markUpExample).appointThirdExpert();
console.log(x);
