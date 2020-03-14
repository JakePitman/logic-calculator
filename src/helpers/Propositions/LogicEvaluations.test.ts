import {
  evaluateNegations,
  innermostBrackets,
  evaluateInnermostBrackets,
  evaluateFullProposition
} from "./LogicEvaluations"
import {
  WorkingRow,
  RowObject
} from "../../sharedTypes"

describe("innermostBrackets", () => {
  it("returns the opening & closing index positions of innermost bracket pair", () => {
    const workingRow: WorkingRow = ["(", "~", "(", "(", "a", "&", "b", ")", "<>", 1, ")", ")"]
    const result = innermostBrackets(workingRow)
    expect(result).toStrictEqual({opening: 3, closing: 7})
  })
})

describe("evaluateNegations", () => {
  const rowObject: RowObject = {
      workingRow: ["(", "(", "~", 1, "&", "~", "~", 0, ")", "&", 1, ")"],
      evaluatedRow: [null, null, null, 1, null, null, null, 0, null, null, 1, null]
  }

  it("replaces negation operator with negation of negand in workingRow, and replaces negand with null", () => {
    const result = evaluateNegations(rowObject, {opening: 1, closing: 8})
    expect(result.workingRow).toStrictEqual(["(", "(", 0, null, "&", 0, null, null, ")", "&", 1, ")"])
  })

  it("replaces negation operator with negation of negand in evaluatedRow", () => {
    const result = evaluateNegations(rowObject, {opening: 1, closing: 8})
    expect(result.evaluatedRow).toStrictEqual([null, null, 0, 1, null, 0, 1, 0, null, null, 1, null])
  })

  it("handles null values between ~ and the truth value it negates", () => {
    const rowObject: RowObject = {
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
      workingRow: ["(", "(", "(", 1, "&", "~", 1, ")", "<>", 0, ")", ">", 1, ")"],
      evaluatedRow: [null, null, null, 1, null, null, 1, null, null, 0, null, null, 1, null]
    }
  })

  it("updates the null value corresponding to the innermost brackets' operator", () => {
    const result = evaluateInnermostBrackets(rowObject)
    expect(result.evaluatedRow).toStrictEqual([null, null, null, 1, 0, 0, 1, null, null, 0, null, null, 1, null])
  })

  it("updates the operator in the innermostbrackets and replaces everything else in the brackets with null in the workingRow", () => {
    const result = evaluateInnermostBrackets(rowObject)
    expect(result.workingRow).toStrictEqual(["(", "(", null, null, 0, null, null, null, "<>", 0, ")", ">", 1 , ")"])
  })

  it("throws an error when innermost brackets are badly formed", () => {
    const rowObject: RowObject = {
      workingRow: ["(", "(", "(", 1, "&", "~", 1, 1, ")", "<>", 0, ")", ">", 1, ")"],
      evaluatedRow: [null, null, null, 1, null, null, 1, 1, null, null, 0, null, null, 1, null]
    }
    expect(() => {evaluateInnermostBrackets(rowObject)}).toThrow()
  })
})

describe("evaluateFullProposition", () => {
  const rowObject1: RowObject = {
    workingRow: ["(", "~", "(", 1, ">", "(", 1, "v", 0, ")", ")", "&", "(", 0, "<>", 1, ")", ")"],
    evaluatedRow: [null, null, null, 1, null, null, 1, null, 0, null, null, null, null, 0, null, 1, null, null]
  }
  const result1 = evaluateFullProposition(rowObject1)

  const rowObject2: RowObject = {
    workingRow: ["(", 0, "v", "~", "(", "~", "(", "~", "~", 1, "&", "~", "~", "~", 0,")", "<>", "~", "(", 0, "&", "~", 1, ")", ")", ")"],
    evaluatedRow: [null, 0, null, null, null, null, null, null, null, 1, null, null, null, null, 0,null, null, null, null, 0, null, null, 1, null, null, null]
  }
  const result2 = evaluateFullProposition(rowObject2)

  it("evaluates values of all operators in evaluated row, in corresponding index positions", () => {
    expect(result1.evaluatedRow).toStrictEqual([null, 0, null, 1, 1, null, 1, 1, 0, null, null, 0, null, 0, 0, 1, null, null])
    expect(result2.evaluatedRow).toStrictEqual([null, 0, 1, 1, null, 0, null, 1, 0, 1, 1, 1, 0, 1, 0, null, 0, 1, null, 0, 0, 0, 1, null, null, null])
  })

  it("returns a workingRow with only one truthValue, which equals the truthValue of the proposition", () => {
    const filteredWorkingRow1 = result1.workingRow.filter(e => {return e !== null})
    expect(filteredWorkingRow1.length).toEqual(1)
    expect(filteredWorkingRow1[0]).toEqual(0)

    const filteredWorkingRow2 = result2.workingRow.filter(e => {return e !== null})
    expect(filteredWorkingRow2.length).toEqual(1)
    expect(filteredWorkingRow2[0]).toEqual(1)
  })

  it("handles multiple outer bracket pairs", () => {
    const rowObjectWithExtraBracketPair: RowObject = {
      workingRow: ["(", "(", "(", 1, ">", "(", 1, "v", 0, ")", ")", ")", ")"],
      evaluatedRow: [null, null, null, 1, null, null, 1, null, 0, null, null, null, null],
    }
    const result = evaluateFullProposition(rowObjectWithExtraBracketPair)
    expect(result.evaluatedRow).toStrictEqual([null, null, null, 1, 1, null, 1, 1, 0, null, null, null, null])
  })
})
