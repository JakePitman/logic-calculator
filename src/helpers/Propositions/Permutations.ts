import { RowObject, VariableAssignments } from "../../sharedTypes"
import { resolveVariableAssignments } from "./StringEvaluations"
import { evaluateFullProposition } from "./LogicEvaluations"

export const generatePermutations = (unassignedVariables: string[]): VariableAssignments[] => {
  const AMOUNT_OF_VARIABLES = unassignedVariables.length;
  const result = []

  for (let i = 0; i < (1 << AMOUNT_OF_VARIABLES); i++) {
    let permutation = {};
    for (let j = AMOUNT_OF_VARIABLES - 1; j >= 0; j--) {
      const truthValue = Boolean(i & (1 << j)) ? 1 : 0
      permutation[unassignedVariables[j]] = truthValue
    }
    result.push(permutation)
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
    const assignedVars = []
    const unassignedVars = []
    Object.keys(variableAssignments).forEach(variable => {
      if (variableAssignments[variable] === null) {
        unassignedVars.push(variable)
      } else {
        assignedVars.push(variable)
      }
    })

    //TODO: handle this in generatePermutations
      // (pass in variableAssignments, and spread there instead)
    //without variableAssignments
    const permutations = generatePermutations(unassignedVars)
    //with variableAssignments
    const completePermutations = permutations.map(permutation => {
      return({...variableAssignments, ...permutation })
    })

    const result = completePermutations.map(permutation => {
      return({
        variableAssignments: permutation,
        rowObject: evaluateVariablePermutation(rowObject, permutation)
      })
    })

    return(result)
}