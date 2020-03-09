import {evalNot, evalOperator} from "../Operators"
import { TruthValue } from "../../sharedTypes"
import {
  permittedChars,
  permittedVars,
  permittedOperators,
  VariableAssignments
} from "../../sharedTypes"
import _ from "lodash"

export type WorkingRow = (string | TruthValue | null)[]

export type RowObject = {
  originalRow: string[],
  workingRow: WorkingRow,
  evaluatedRow: (TruthValue | null)[]
}

const isPermittedChar = (char: string) => {
  return (permittedChars.includes(char))
}

const resolveBiconditionals = (splitProposition: string[]) => {
  const result = []
  splitProposition.forEach((char, i, arr) => {
    if (char === "<") {
      result.push("<>") 
    } else if (char === ">" && arr[i - 1] === "<") {
      return;
    } else {
      result.push(char)
    }
  })
  return result
}

export const createRowObject = (proposition: string): RowObject => {
  const propositionCopy = `(${proposition})`

  const filteredByPermittedChars = propositionCopy.split("").filter(e => isPermittedChar(e))
  const symbolsArray = resolveBiconditionals(filteredByPermittedChars)
    
  return ( 
    {
      originalRow: symbolsArray,
      workingRow: symbolsArray,
      evaluatedRow: symbolsArray.map(e => null)
    }
  )
}

export const resolveVariableAssignments = (rowObject: RowObject, variableAssignments: VariableAssignments): RowObject => {
  const result = _.cloneDeep(rowObject)
  const assignedVars = Object.keys(variableAssignments)

  result.workingRow.forEach(( char, i ) => {
    if (typeof char === "string" && assignedVars.includes(char)) {
      result.workingRow[i] = variableAssignments[char]
      result.evaluatedRow[i] = variableAssignments[char]
    } else if (typeof char === "string" && permittedVars.includes(char)) {
      throw Error(`Found unassigned var in proposition: ${char}`)
    }
  })
  return result
}

export const innermostBrackets = (row: WorkingRow): {opening: number, closing: number} => {
  const closing = row.findIndex(char => char === ")")
  const charsLeftOfClosing = row.slice(0, closing)
  const opening = charsLeftOfClosing.lastIndexOf("(")
  return {opening, closing}
}

// For use in evaluateInnermostBrackets only
export const evaluateNegations = (rowObject: RowObject, innermostBrackets: {opening: number, closing: number}): RowObject => {
  const result = _.cloneDeep(rowObject)
  const {workingRow, evaluatedRow} = result
  const {opening, closing} = innermostBrackets
  let lastKnownValueIndex
  let i
  for (i = closing; i > (opening - 1); i--) {
    if (typeof workingRow[i] === "number") {
      lastKnownValueIndex = i
    } else if (workingRow[i] === "~") {
      const negationResult = evalNot(evaluatedRow[lastKnownValueIndex])
      evaluatedRow[i] = negationResult
      workingRow[i] = negationResult
      workingRow[lastKnownValueIndex] = null
      lastKnownValueIndex = i
    }
  }
  return result
}

export const evaluateInnermostBrackets = (rowObject: RowObject): RowObject => {
  const { opening, closing } = innermostBrackets(rowObject.workingRow)
  const result = _.cloneDeep(evaluateNegations(rowObject, {opening, closing}))
  const {workingRow, evaluatedRow} = result

  // if there is only one number, replace all brackets with null
  const remainingTruthValues = workingRow.filter(e => {
    return typeof e === "number"
  })
  if (remainingTruthValues.length === 1) {
    workingRow.forEach((e, i) => {
      if (e === "(" || e === ")") {
        workingRow[i] = null
      }
    })
    return result
  }

  // get index positions of left operator, operand, right operator
  const indexes = []
  let i
  for (i = opening; i < closing + 1; i++){
    const currentChar = workingRow[i]
    if (
      (typeof currentChar === "number")
      || (typeof currentChar === "string" && permittedOperators.includes(currentChar))
      ) {
      indexes .push(i)
    }
  }

  if(indexes.length > 3) { throw Error("Too many characters given in single bracket pair") }

  const leftOperandIndex = indexes[0]
  const operatorIndex = indexes[1]
  const rightOperandIndex = indexes[2]
  const leftOperand = workingRow[indexes[0]]
  const operator = workingRow[indexes[1]]
  const rightOperand = workingRow[indexes[2]]

  let operatorResult
  if((typeof leftOperand !== "string") && (typeof operator === "string") && (typeof rightOperand !== "string")){
    operatorResult = evalOperator(
      leftOperand,
      operator,
      rightOperand
    )
  } else {
    throw Error("Invalid operator or operand found")
  }

  workingRow[leftOperandIndex] = null
  workingRow[rightOperandIndex] = null
  workingRow[opening] = null
  workingRow[closing] = null

  workingRow[operatorIndex] = operatorResult
  evaluatedRow[operatorIndex] = operatorResult

  return result
}

export const evaluateFullProposition = (rowObject: RowObject): RowObject => {
  if ( rowObject.workingRow[0] === "(" && rowObject.workingRow[rowObject.workingRow.length -1 ] === ")" ) {
    const withInnerBracketsEvaluated = evaluateInnermostBrackets(rowObject)
    return evaluateFullProposition(withInnerBracketsEvaluated)
  } else {
    return rowObject
  }
}

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