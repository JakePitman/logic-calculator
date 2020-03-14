import { RowObject, VariableAssignments } from "../../sharedTypes"
import { resolveVariableAssignments } from "./StringEvaluations"
import { evaluateFullProposition } from "./LogicEvaluations"

export const generatePermutations = (unassignedVariables: string[], variableAssignments: VariableAssignments): VariableAssignments[] => {
  const AMOUNT_OF_VARIABLES = unassignedVariables.length;
  const result = []

  for (let i = 0; i < (1 << AMOUNT_OF_VARIABLES); i++) {
    let permutation: VariableAssignments = {};
    for (let j = AMOUNT_OF_VARIABLES - 1; j >= 0; j--) {
      const truthValue = Boolean(i & (1 << j)) ? 1 : 0
      permutation[unassignedVariables[j]] = truthValue
    }
    result.push({ ...variableAssignments, ...permutation })
  }
  return(result)
}

export const evaluateVariablePermutation = (rowObject: RowObject, variableAssignments: VariableAssignments): RowObject => {
  const withVariablesAssigned = resolveVariableAssignments(rowObject, variableAssignments)
  return evaluateFullProposition(withVariablesAssigned)
}

export const evaluateAllVariablePermutations = 
  (rowObject: RowObject, variableAssignments: VariableAssignments)
  : {variableAssignments: VariableAssignments, rowObject: RowObject}[] => {
    const assignedVars: string[] = []
    const unassignedVars: string[] = []
    Object.keys(variableAssignments).forEach(variable => {
      if (variableAssignments[variable] === null) {
        unassignedVars.push(variable)
      } else {
        assignedVars.push(variable)
      }
    })

    const permutations = generatePermutations(unassignedVars, variableAssignments)

    const result = permutations.map(permutation => {
      return({
        variableAssignments: permutation,
        rowObject: evaluateVariablePermutation(rowObject, permutation)
      })
    })

    return(result)
}