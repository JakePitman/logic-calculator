import { VariableAssignments } from "../../sharedTypes"
import { evaluateAllVariablePermutations } from "./Permutations"
import { createRowObject } from "./StringEvaluations"

//TODO return an object with evalutations, AND original proposition
//** Instead of having original proposition (originalRow) in the rowObject
const evaluateRawDetails = (proposition: string, variableAssignments: VariableAssignments) => {
  const rowObject = createRowObject(proposition)
  return evaluateAllVariablePermutations(rowObject, variableAssignments)
}

export default evaluateRawDetails