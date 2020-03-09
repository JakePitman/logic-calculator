import { VariableAssignments } from "../../sharedTypes"
import { evaluateAllVariablePermutations } from "./Permutations"
import { createRowObject } from "./StringEvaluations"

const evaluateRawDetails = (proposition: string, variableAssignments: VariableAssignments) => {
  const rowObject = createRowObject(proposition)
  return evaluateAllVariablePermutations(rowObject, variableAssignments)
}

export default evaluateRawDetails