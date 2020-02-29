import {evaluateNegations, evaluateInnermostBrackets, createRowObject, resolveVariableAssignments, innermostBrackets, WorkingRow, RowObject} from './StringEvaluations'
import {VariableAssignment} from "../../sharedTypes"

describe('createRowObject', () => {
  test('splits string arg into array & sets as originalRow and workingRow properties', () => {
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

describe("resolveVariableAssignments", () => {
  let rowObject
  beforeEach(() => {
    rowObject = {
      originalRow: ["~", "(", "(", "a", "&", "b", ")", "<>", "p", ")"],
      workingRow: ["~", "(", "(", "a", "&", "b", ")", "<>", "p", ")"],
      evaluatedRow: [null, null, null, null, null, null, null, null, null, null]
    }
  })

  it("replaces corresponding null in workingRow & evaluatedRow with value assigned to variable in originalRow", () => {
    const variableAssignment: VariableAssignment = {
      "a": 1,
      "b": 0,
      "p": 1
    }
    const result = resolveVariableAssignments(rowObject, variableAssignment)
    expect(result.workingRow).toStrictEqual(
      ["~", "(", "(", 1, "&", 0, ")", "<>", 1, ")"]
    )
    expect(result.evaluatedRow).toStrictEqual(
      [null, null, null, 1, null, 0, null, null, 1, null]
    )
  })

  it("leaves corresponding index positions unchanged if var is not assigned", () => {
    const variableAssignment: VariableAssignment = { "p": 1 }
    const result = resolveVariableAssignments(rowObject, variableAssignment)
    expect(result.workingRow).toStrictEqual(
      ["~", "(", "(", "a", "&", "b", ")", "<>", 1, ")"]
    )
    expect(result.evaluatedRow).toStrictEqual(
      [null, null, null, null, null, null, null, null, 1, null]
    )
  })
})

describe("innermostBrackets", () => {
  it("returns the opening & closing index positions of innermost bracket pair", () => {
    const workingRow: WorkingRow = ["~", "(", "(", "a", "&", "b", ")", "<>", 1, ")"]
    const result = innermostBrackets(workingRow)
    expect(result).toStrictEqual({opening: 2, closing: 6})
  })
})

describe("evaluateNegations", () => {
  const rowObject: RowObject = {
      originalRow: ["(", "~", "a", "&", "~", "~", "b", ")", "&", "a"],
      workingRow: ["(", "~", 1, "&", "~", "~", 0, ")", "&", 1],
      evaluatedRow: [null, null, 1, null, null, null, 0, null, null, 1]
  }

  it("replaces negation operator with negation of negand in workingRow, and replaces negand with null", () => {
    const result = evaluateNegations(rowObject, {opening: 0, closing: 7})
    expect(result.workingRow).toStrictEqual(["(", 0, null, "&", 0, null, null, ")", "&", 1])
  })

  it("replaces negation operator with negation of negand in evaluatedRow", () => {
    const result = evaluateNegations(rowObject, {opening: 0, closing: 7})
    expect(result.evaluatedRow).toStrictEqual([null, 0, 1, null, 0, 1, 0, null, null, 1])
  })

  it("handles null values between ~ and the truth value it negates", () => {
    const rowObject: RowObject = {
      originalRow: ["(", "~", "(", "a", "&", "b", ")", "<>", "b", ")"],
      workingRow: ["(", "~", null, null, 1, null, null, "<>", 1, ")"],
      evaluatedRow: [null, null, null, null, 1, null, null, null, 1, null]
    }
    const result = evaluateNegations(rowObject, {opening: 0, closing: 9})
    expect(result.workingRow).toStrictEqual(["(", 0, null, null, null, null, null, "<>", 1, ")"])
    expect(result.evaluatedRow).toStrictEqual([null, 0, null, null, 1, null, null, null, 1, null])
  })
})

describe("evaluateInnermostBrackets", () => {
  let rowObject
  beforeEach(() => {
    rowObject = {
      originalRow: ["(", "(", "a", "&", "~", "b", ")", "<>", "c", ")", ">", "a"],
      workingRow: ["(", "(", 1, "&", "~", 1, ")", "<>", 0, ")", ">", 1],
      evaluatedRow: [null, null, 1, null, null, 1, null, null, 0, null, null, 1]
    }
  })

  it("updates the null value corresponding to the innermost brackets' operator", () => {
    const result = evaluateInnermostBrackets(rowObject)
    expect(result.evaluatedRow).toStrictEqual([null, null, 1, 0, 0, 1, null, null, 0, null, null, 1])
  })

  it("updates the operator in the innermostbrackets and replaces everything else in the brackets with null in the workingRow", () => {
    const result = evaluateInnermostBrackets(rowObject)
    expect(result.workingRow).toStrictEqual(["(", null, null, 0, null, null, null, "<>", 0, ")", ">", 1 ])
  })

  it("throws an error when innermost brackets are badly formed", () => {
    const rowObject: RowObject = {
      originalRow: ["(", "(", "a", "&", "~", "b", "a", ")", "<>", "c", ")", ">", "a"],
      workingRow: ["(", "(", 1, "&", "~", 1, 1, ")", "<>", 0, ")", ">", 1],
      evaluatedRow: [null, null, 1, null, null, 1, 1, null, null, 0, null, null, 1]
    }
    expect(() => {evaluateInnermostBrackets(rowObject)}).toThrow()
  })
})