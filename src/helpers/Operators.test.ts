import { evalAnd, evalOr, evalIfThen, evalBiconditional, evalNot } from './Operators'

describe('evalAnd', () => {
  test('returns 1 when both conjuncts are 1', () => {
    expect(evalAnd(1, 1)).toBe(1);
  });
  test('returns 0 when one or both conjuncts are 0', () => {
    expect(evalAnd(1, 0)).toBe(0);
    expect(evalAnd(0, 1)).toBe(0);
    expect(evalAnd(0, 0)).toBe(0);
  });
})

describe('evalOr', () => {
  test('returns 1 when at least one disjunct is 1', () => {
    expect(evalOr(1, 1)).toBe(1);
    expect(evalOr(1, 0)).toBe(1);
    expect(evalOr(0, 1)).toBe(1);
  });
  test('returns 0 when one or both disjuncts are 0', () => {
    expect(evalOr(0, 0)).toBe(0);
  });
})

describe('evalIfThen', () => {
  test('returns 1 when the antecedent and consequent are both 1', () => {
    expect(evalIfThen(1, 1)).toBe(1);
  });
  test('returns 1 when the antecedent is 0', () => {
    expect(evalIfThen(0, 0)).toBe(1);
    expect(evalIfThen(0, 1)).toBe(1);
  })
  test('returns 0 when the antecedent is 1, and the consequent is 0', () => {
    expect(evalIfThen(1, 0)).toBe(0);
  });
})

describe('evalBiconditional', () => {
  test('returns 1 when the left and right expressions are the same', () => {
    expect(evalBiconditional(1, 1)).toBe(1);
    expect(evalBiconditional(0, 0)).toBe(1);
  });
  test('returns 0 when the left and right expressions are different', () => {
    expect(evalBiconditional(0, 1)).toBe(0);
    expect(evalBiconditional(1, 0)).toBe(0);
  })
})

describe('evalNot', () => {
  test('returns 1 when truthValue is 0', () => {
    expect(evalNot(1)).toBe(0);
  });
  test('returns 0 when truthValue is 1', () => {
    expect(evalNot(0)).toBe(1);
  })
})
