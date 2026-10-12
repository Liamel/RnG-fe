// Latin → Elder Futhark transliteration for decorative runic captions (as on the Skald console site)
const MAP: Record<string, string> = {
  a: 'ᚨ', b: 'ᛒ', c: 'ᚲ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ', g: 'ᚷ', h: 'ᚺ', i: 'ᛁ', j: 'ᛃ', k: 'ᚲ', l: 'ᛚ', m: 'ᛗ',
  n: 'ᚾ', o: 'ᛟ', ö: 'ᛟ', p: 'ᛈ', q: 'ᚲ', r: 'ᚱ', s: 'ᛊ', t: 'ᛏ', u: 'ᚢ', v: 'ᚹ', w: 'ᚹ', x: 'ᚲᛊ', y: 'ᛃ', z: 'ᛉ',
}

export const toRunes = (text: string) =>
  text.toLowerCase()
    .replace(/th/g, 'ᚦ').replace(/ng/g, 'ᛜ')
    .replace(/[a-zö]/g, (c) => MAP[c])
    .replace(/[^ᚠ-ᛰ]+/g, '᛫') // spaces and punctuation become the runic word separator
    .replace(/^᛫|᛫$/g, '')
