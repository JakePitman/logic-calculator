import { VariableAssignments, RowObject } from "../../sharedTypes"
import {
  generatePermutations,
  evaluateVariablePermutation,
  evaluateAllVariablePermutations
} from "./Permutations"

describe("evaluateVariablePermutation", () => {
  const rowObject = {
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
    workingRow: ["(", "(", "a", "v", "b", ")", ">", "b", ")"],
    evaluatedRow: [null, null, null, null, null, null, null, null, null]
  }
  const permutationResults = { 
    "a-1,b-1": {
      variableAssignments: { a: 1, b: 1 },
      rowObject: {
        workingRow: [null, null, null, null, null, null, 1, null, null],
        evaluatedRow: [null, null, 1, 1, 1, null, 1, 1, null]
      }
    },
    "a-0,b-1": {
      variableAssignments: { a: 0, b: 1 },
      rowObject: {
        workingRow: [null, null, null, null, null, null, 1, null, null],
        evaluatedRow: [null, null, 0, 1, 1, null, 1, 1, null]
      }
    },
    "a-1,b-0": {
      variableAssignments: { a: 1, b: 0 },
      rowObject: {
        workingRow: [null, null, null, null, null, null, 0, null, null],
        evaluatedRow: [null, null, 1, 1, 0, null, 0, 0, null]
      }
    },
    "a-0,b-0": {
      variableAssignments: { a: 0, b: 0 },
      rowObject: {
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