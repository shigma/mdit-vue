import { describe, expect, it } from 'vitest';
import { slugify } from '../src/index.js';

const TEST_CASES: [string, string][] = [
  ['Привет', 'привет'],
  ['Лед üäöß', 'лед-uaoß'],
  ['hangul 가', 'hangul-가'],
  ['ع', 'ع'],
  ['ǆℍΩ', 'dzhω'],
  ['ｶi⁹', 'カi9'],
  // ㌀ -> アパート'
  ['㌀', decodeURIComponent('%E3%82%A2%E3%83%8F%E3%82%9A%E3%83%BC%E3%83%88')],
  ['¼', '_1⁄4'],
  ['ǆℍΩｶi⁹¼', 'dzhωカi91⁄4'],
  ['Iлｔèｒｎåｔïｏｎɑｌíƶａｔï߀ԉ', 'iлternationɑliƶati߀ԉ'],
  [
    'Båｃòл íｐѕùｍ ðｏɭ߀ｒ ѕïｔ ａϻèｔ âùþê ａԉᏧ߀üïｌɭê ƃëéｆ ｃｕｌρá ｆïｌèｔ ϻｉǥｎòｎ ｃｕρｉᏧａｔａｔ ｕｔ êлｉｍ ｔòлɢùê.',
    'bacoл-ipѕum-ðoɭ߀r-ѕit-aϻet-auþe-aԉꮷ߀uilɭe-ƃeef-culρa-filet-ϻiǥnon-cuρiꮷatat-ut-eлim-toлɢue',
  ],
  ['ᴎᴑᴅᴇȷʂ', 'ᴎᴑᴅᴇȷʂ'],
  ['hambúrguer', 'hamburguer'],
  ['hŒllœ', 'hœllœ'],
  ['Fußball', 'fußball'],
  ['ABCDEFGHIJKLMNOPQRSTUVWXYZé', 'abcdefghijklmnopqrstuvwxyze'],
];

describe('should slugify string correctly', () => {
  TEST_CASES.forEach(([source, expected]) => {
    it(`${source} => ${expected}`, () => {
      expect(slugify(source)).toBe(expected);
    });
  });
});
