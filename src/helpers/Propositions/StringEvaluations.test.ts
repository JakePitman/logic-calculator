import { propositionStringToArray, createRowObject, resolveVariableAssignments, } from './StringEvaluations'
import { VariableAssignments, } from "../../sharedTypes"

describe('propositionStringToArray', () => {
  test("adds an extra bracket pair around entire proposition", () => {
    const testString = "avb"
    const result = propositionStringToArray(testString)
    expect(result[0]).toBe("(")
    expect(result[result.length - 1]).toBe(")")
  })

  test ('removes whitespace', () => {
    const testString = "a >b "
    const result = propositionStringToArray(testString)
    expect(result).toStrictEqual(["(", "a", ">", "b", ")"])
  })

  test ('resolves "<" as "<>"', () => {
    const testString = "a<b"
    const result = propositionStringToArray(testString)
    expect(result).toStrictEqual(["(", "a", "<>", "b", ")"])
  })

  test ('resolves ["<", ">"] as "<>"', () => {
    const testString = "a<>b"
    const result = propositionStringToArray(testString)
    expect(result).toStrictEqual(["(", "a", "<>", "b", ")"])
  })
})

describe('createRowObject', () => {
  test('returns a workingRow property equivalent to the given array', () => {
    const testArray = ["(", "(", "a", ">", "b", ")", "&", "~", "(", "a", "v", "b", ")", ")"]
    const result = createRowObject(testArray)
    expect(result.workingRow).toStrictEqual(testArray)
  });

  test('evaluatedRow is an array of null with same length as working row', () => {
    const testArray = ["(", "a", ">", "b", ")"]
    const result = createRowObject(testArray)
    expect(result.evaluatedRow).toStrictEqual([null, null, null, null, null])
    expect(result.evaluatedRow.length).toEqual(result.workingRow.length)
  })
})

describe("resolveVariableAssignments", () => {
  let rowObject
  beforeEach(() => {
    rowObject = {
      workingRow: ["(", "~", "(", "(", "a", "&", "b", ")", "<>", "p", ")", ")"],
      evaluatedRow: [null, null, null, null, null, null, null, null, null, null, null, null]
    }
  })

  it("replaces variable strings with the values given in variableAssignments", () => {
    const variableAssignments: VariableAssignments = {
      "a": 1,
      "b": 0,
      "p": 1
    }
    const result = resolveVariableAssignments(rowObject, variableAssignments)
    expect(result.workingRow).toStrictEqual(
      ["(", "~", "(", "(", 1, "&", 0, ")", "<>", 1, ")", ")"]
    )
    expect(result.evaluatedRow).toStrictEqual(
      [null, null, null, null, 1, null, 0, null, null, 1, null, null]
    )
  })

  it("throws an error if variableAssignments is incomplete", () => {
    const variableAssignments: VariableAssignments = { "p": 1 }
    expect(() => { resolveVariableAssignments( rowObject, variableAssignments )}).toThrow()
  })
})

