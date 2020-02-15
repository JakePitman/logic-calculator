import {createRowObject} from './StringEvaluations'

describe('createRowObject', () => {
  test.only('splits string arg into array & sets as originalRow and workingRow properties', () => {
    const testString = "(a>b)&~(avb)"
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["(", "a", ">", "b", ")", "&", "~", "(", "a", "v", "b", ")"])
    expect(result.workingRow).toStrictEqual(["(", "a", ">", "b", ")", "&", "~", "(", "a", "v", "b", ")"])
  });

  test('evaluatedRow is an array of null with same length as original & working rows', () => {
    const testString = "a>b"
    const result = createRowObject(testString)
    expect(result.evaluatedRow).toStrictEqual([null, null, null])
    expect(result.evaluatedRow.length).toEqual(result.originalRow.length)
    expect(result.evaluatedRow.length).toEqual(result.workingRow.length)
  })

  test ('removes whitepsace', () => {
    const testString = "a >b "
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["a", ">", "b"])
    expect(result.workingRow).toStrictEqual(["a", ">", "b"])
    expect(result.evaluatedRow.length).toEqual(result.originalRow.length)
  })

  test ('resolves "<" as "<>"', () => {
    const testString = "a<b"
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["a", "<>", "b"])
    expect(result.workingRow).toStrictEqual(["a", "<>", "b"])
  })

  test ('resolves ["<", ">"] as "<>"', () => {
    const testString = "a<>b"
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["a", "<>", "b"])
    expect(result.workingRow).toStrictEqual(["a", "<>", "b"])
  })
})
