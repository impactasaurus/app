import {ILabel, ILikertScale} from 'models/question';

export function modeScale(questions: ILikertScale[]): ILikertScale {
  const lookup = {};
  const hashScale = (scale: ILikertScale): string => {
    const sorted = [...scale.labels].sort((a, b) => a.value - b.value);
    const hash = JSON.stringify({
      left: scale.leftValue,
      right: scale.rightValue,
      labels: sorted.map((l) => l.label),
      values: sorted.map((l) => l.value),
    });
    lookup[hash] = scale;
    return hash;
  };
  const counts = questions.reduce((c, q) => {
    const hash = hashScale(q);
    if (c[hash] === undefined) {
      c[hash] = 0;
    }
    c[hash]++;
    return c;
  }, {});
  const maxHash = Object.keys(counts).reduce((max, hsh) => {
    if (max === undefined) {
      return hsh;
    }
    return counts[hsh] > counts[max] ? hsh: max;
  }, undefined);
  return lookup[maxHash];
}

export function sharedLabels(questions: ILikertScale[]): boolean {
  const doesMatch = (l1: ILikertScale, l2: ILikertScale): boolean => {
    const s1 = compiledScale(l1).map((l) => l.label);
    const s2 = compiledScale(l2).map((l) => l.label);
    if (s1.length !== s2.length) {
      return false;
    }
    for (let ct = 0; ct < s1.length; ct++) {
      if (s1[ct] !== s2[ct]) {
        return false;
      }
    }
    return true;
  };
  return questions.reduce<boolean>((same: boolean, q: ILikertScale): boolean => {
    return same && doesMatch(q, questions[0]);
  }, true);
}

export function getLabel(value: number, q: ILikertScale): string|undefined {
  const search = q.labels.find((l) => l.value === value);
  return search !== undefined ? search.label : undefined;
}

export function compiledScale(q: ILikertScale): ILabel[] {
  const min = Math.min(q.leftValue, q.rightValue);
  const max = Math.max(q.leftValue, q.rightValue);
  const inverted = q.leftValue > q.rightValue;
  const out: ILabel[] = [];
  for (let ct = min; ct <= max; ct++) {
    out.push({
      value: ct,
      label: getLabel(ct, q),
    });
  }
  return inverted ? out.reverse() : out;
}
