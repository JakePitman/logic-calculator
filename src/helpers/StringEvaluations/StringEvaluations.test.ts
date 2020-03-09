import {
  evaluateNegations,
  evaluateInnermostBrackets,
  createRowObject,
  resolveVariableAssignments,
  innermostBrackets,
  WorkingRow,
  RowObject,
  evaluateFullProposition,
  generatePermutations,
  evaluateVariablePermutation,
  evaluateAllVariablePermutations
} from './StringEvaluations'
import {VariableAssignments} from "../../sharedTypes"

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

describe("innermostBrackets", () => {
  it("returns the opening & closing index positions of innermost bracket pair", () => {
    const workingRow: WorkingRow = ["(", "~", "(", "(", "a", "&", "b", ")", "<>", 1, ")", ")"]
    const result = innermostBrackets(workingRow)
    expect(result).toStrictEqual({opening: 3, closing: 7})
  })
})

describe("evaluateNegations", () => {
  const rowObject: RowObject = {
      originalRow: ["(", "(", "~", "a", "&", "~", "~", "b", ")", "&", "a", ")"],
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
      originalRow: ["(", "(", "(", "a", "&", "~", "b", ")", "<>", "c", ")", ">", "a", ")"],
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
      originalRow: ["(", "(", "(", "a", "&", "~", "b", "a", ")", "<>", "c", ")", ">", "a", ")"],
      workingRow: ["(", "(", "(", 1, "&", "~", 1, 1, ")", "<>", 0, ")", ">", 1, ")"],
      evaluatedRow: [null, null, null, 1, null, null, 1, 1, null, null, 0, null, null, 1, null]
    }
    expect(() => {evaluateInnermostBrackets(rowObject)}).toThrow()
  })
})

describe("evaluateFullProposition", () => {
    const rowObject1: RowObject = {
      originalRow: ["(", "~", "(", "a", ">", "(", "a", "v", "b", ")", ")", "&", "(", "p", "<>", "a", ")", ")"],
      workingRow: ["(", "~", "(", 1, ">", "(", 1, "v", 0, ")", ")", "&", "(", 0, "<>", 1, ")", ")"],
      evaluatedRow: [null, null, null, 1, null, null, 1, null, 0, null, null, null, null, 0, null, 1, null, null]
    }
    const result1 = evaluateFullProposition(rowObject1)

    const rowObject2: RowObject = {
      originalRow: ["(", "b", "v", "~", "(", "~", "(", "~", "~", "a", "&", "~", "~", "~", "b",")", "<>", "~", "(", "p", "&", "~", "a", ")", ")", ")"],
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

    it("returns the same originalRow from input", () => {
      expect(result1.originalRow).toStrictEqual(rowObject1.originalRow)
      expect(result2.originalRow).toStrictEqual(rowObject2.originalRow)
    })

  it("handles multiple outer bracket pairs", () => {
    const rowObjectWithExtraBracketPair: RowObject = {
      originalRow: ["(", "(", "(", "a", ">", "(", "a", "v", "b", ")", ")", ")", ")"],
      workingRow: ["(", "(", "(", 1, ">", "(", 1, "v", 0, ")", ")", ")", ")"],
      evaluatedRow: [null, null, null, 1, null, null, 1, null, 0, null, null, null, null],
    }
    const result = evaluateFullProposition(rowObjectWithExtraBracketPair)
    expect(result.evaluatedRow).toStrictEqual([null, null, null, 1, 1, null, 1, 1, 0, null, null, null, null])
  })
})

describe("evaluateVariablePermutation", () => {
  const rowObject = {
    originalRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
    workingRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
    evaluatedRow: [null, null, null, null, null, null, null, null, null]
  }
  it("returns a rowObject, evaluated with the given variableAssignments", () => {
    const variableAssignmentsPermutation1: VariableAssignments = {a: 0, b: 1}
    const resultTrue = evaluateVariablePermutation(rowObject, variableAssignmentsPermutation1)
    expect(resultTrue.evaluatedRow).toStrictEqual([null, null, 0, 1, 1, null, 1, 1, null])
    expect(resultTrue.workingRow).toStrictEqual([null, null, null, null, null, null, 1, null, null])

    const variableAssignmentsPermutation2: VariableAssignments = {a: 1, b: 0}
    const resultFalse = evaluateVariablePermutation(rowObject, variableAssignmentsPermutation2)
    expect(resultFalse.evaluatedRow).toStrictEqual([null, null, 1, 1, 0, null, 0, 0, null])
    expect(resultFalse.workingRow).toStrictEqual([null, null, null, null, null, null, 0, null, null])
  })
})

describe("generatePermutations", () => {
  describe("with one unassigned variable", () => {
    const unassignedVariables = ["b"]
    it("returns both possibilities of unassigned variable", () => {
      expect(generatePermutations(unassignedVariables)).toStrictEqual([
        {b: 0},
        {b: 1}
      ])
    })
  })
  describe("with two unassigned variables", () => {
    const unassignedVariables = ["b", "c"]
    it("returns all 4 possible permutations", () => {
      expect(generatePermutations(unassignedVariables)).toStrictEqual([
        {b: 0, c: 0},
        {b: 1, c: 0},
        {b: 0, c: 1},
        {b: 1, c: 1}
      ])
    })
  }),
  describe("with three unassigned variables", () => {
    const unassignedVariables = ["b", "c", "d"]
    const expected: VariableAssignments[] = [
      {b: 0, c: 0, d: 0},
      {b: 1, c: 0, d: 0},
      {b: 0, c: 1, d: 0},
      {b: 1, c: 1, d: 0},
      {b: 0, c: 0, d: 1},
      {b: 1, c: 0, d: 1},
      {b: 0, c: 1, d: 1},
      {b: 1, c: 1, d: 1},
    ]
    const result = generatePermutations(unassignedVariables)
    it("returns all 8 possible permutations", () => {
      expect(result).toStrictEqual(expected)
    })
  })
})

describe("evaluateAllVariablePermutations", () => {
  const rowObject: RowObject = {
    originalRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
    workingRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
    evaluatedRow: [null, null, null, null, null, null, null, null, null]
  }
  const permutationResults = { 
    "a-1,b-1": {
      variableAssignments: { a: 1, b: 1 },
      rowObject: {
        originalRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
        workingRow: [null, null, null, null, null, null, 1, null, null],
        evaluatedRow: [null, null, 1, 1, 1, null, 1, 1, null]
      }
    },
    "a-0,b-1": {
      variableAssignments: { a: 0, b: 1 },
      rowObject: {
        originalRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
        workingRow: [null, null, null, null, null, null, 1, null, null],
        evaluatedRow: [null, null, 0, 1, 1, null, 1, 1, null]
      }
    },
    "a-1,b-0": {
      variableAssignments: { a: 1, b: 0 },
      rowObject: {
        originalRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
        workingRow: [null, null, null, null, null, null, 0, null, null],
        evaluatedRow: [null, null, 1, 1, 0, null, 0, 0, null]
      }
    },
    "a-0,b-0": {
      variableAssignments: { a: 0, b: 0 },
      rowObject: {
        originalRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
        workingRow: [null, null, null, null, null, null, 1, null, null],
        evaluatedRow: [null, null, 0, 0, 0, null, 1, 0, null]
      }
    }
  }

  describe("with all variables unassigned", () => {
    const variableAssignmentsWithNoAssigns: VariableAssignments = { a: null, b: null }
    const result = evaluateAllVariablePermutations(rowObject, variableAssignmentsWithNoAssigns)
    it("returns evaluated rowObjects for all possible permutations", () => {
      Object.keys( permutationResults ).forEach((key) => {
        expect(result).toContainEqual(permutationResults[key])
      })
    })
  })

  describe("with some variables assigned", () => {
    const variableAssignmentsWithSomeAssigns: VariableAssignments = { a: 1, b: null }
    const result = evaluateAllVariablePermutations(rowObject, variableAssignmentsWithSomeAssigns)
    it("returns evaluated rowObjects for all permutations of unassigned variables", () => {
      expect(result).toContainEqual(permutationResults["a-1,b-1"])
      expect(result).toContainEqual(permutationResults["a-1,b-0"])
    })
    it("returns with length matching number of possible unassigned permutations", () => {
      expect(result.length).toEqual(2)
    })
  })

  describe("with all variables assigned", () => {
    const variableAssignmentsWithAllAssigns: VariableAssignments = { a: 1, b: 0 }
    const result = evaluateAllVariablePermutations(rowObject, variableAssignmentsWithAllAssigns)
    it("returns evaluated rowObject for specified permutation", () => {
    expect(result).toContainEqual(permutationResults["a-1,b-0"])
    })
    it("returns with length matching number of possible unassigned permutations", () => {
      expect(result.length).toEqual(1)
    })
  })
})