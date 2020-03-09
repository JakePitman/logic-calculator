import { createRowObject, resolveVariableAssignments, } from './StringEvaluations'
import { VariableAssignments, } from "../../sharedTypes"

describe('createRowObject', () => {
  test('splits string arg into array & sets as originalRow and workingRow properties', () => {
    const testString = "(a>b)&~(avb)"
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["(", "(", "a", ">", "b", ")", "&", "~", "(", "a", "v", "b", ")", ")"])
    expect(result.workingRow).toStrictEqual(["(", "(", "a", ">", "b", ")", "&", "~", "(", "a", "v", "b", ")", ")"])
  });

  test("adds an extra bracket pair around entire proposition", () => {
    const testString = "avb"
    const result = createRowObject(testString)
    expect(result.originalRow[0]).toBe("(")
    expect(result.originalRow[result.originalRow.length - 1]).toBe(")")
  })

  test('evaluatedRow is an array of null with same length as original & working rows', () => {
    const testString = "a>b"
    const result = createRowObject(testString)
    expect(result.evaluatedRow).toStrictEqual([null, null, null, null, null])
    expect(result.evaluatedRow.length).toEqual(result.originalRow.length)
    expect(result.evaluatedRow.length).toEqual(result.workingRow.length)
  })

  test ('removes whitespace', () => {
    const testString = "a >b "
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["(", "a", ">", "b", ")"])
    expect(result.workingRow).toStrictEqual(["(", "a", ">", "b", ")"])
    expect(result.evaluatedRow.length).toEqual(result.originalRow.length)
  })

  test ('resolves "<" as "<>"', () => {
    const testString = "a<b"
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["(", "a", "<>", "b", ")"])
    expect(result.workingRow).toStrictEqual(["(", "a", "<>", "b", ")"])
  })

  test ('resolves ["<", ">"] as "<>"', () => {
    const testString = "a<>b"
    const result = createRowObject(testString)
    expect(result.originalRow).toStrictEqual(["(", "a", "<>", "b", ")"])
    expect(result.workingRow).toStrictEqual(["(", "a", "<>", "b", ")"])
  })
})

describe("resolveVariableAssignments", () => {
  let rowObject
  beforeEach(() => {
    rowObject = {
      originalRow: ["(", "~", "(", "(", "a", "&", "b", ")", "<>", "p", ")", ")"],
      workingRow: ["(", "~", "(", "(", "a", "&", "b", ")", "<>", "p", ")", ")"],
      evaluatedRow: [null, null, null, null, null, null, null, null, null, null, null, null]
    }
  })

  it("replaces corresponding null in workingRow & evaluatedRow with value assigned to variable in originalRow", () => {
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

