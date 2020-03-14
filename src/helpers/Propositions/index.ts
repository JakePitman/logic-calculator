import { VariableAssignments } from "../../sharedTypes"
import { evaluateAllVariablePermutations } from "./Permutations"
import { propositionStringToArray, createRowObject } from "./StringEvaluations"

const evaluateRawDetails = (proposition: string, variableAssignments: VariableAssignments) => {
  const originalProposition = propositionStringToArray(proposition)
  const rowObject = createRowObject(originalProposition)
  const evaluatedRows = evaluateAllVariablePermutations(rowObject, variableAssignments)
  return {originalProposition, evaluatedRows}
}

export default evaluateRawDetails