import {evalNot, evalOperator} from "../Operators"
import { TruthValue } from "../../sharedTypes"
import { permittedChars, permittedOperators, VariableAssignment } from "../../sharedTypes"
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

export const resolveVariableAssignments = (rowObject: RowObject, variableAssignment: VariableAssignment): RowObject => {
  const result = _.cloneDeep(rowObject)
  const assignedVars = Object.keys(variableAssignment)
  result.workingRow.forEach(( char, i ) => {
    if (typeof char === "string" && assignedVars.includes(char)) {
      result.workingRow[i] = variableAssignment[char]
      result.evaluatedRow[i] = variableAssignment[char]
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

export const evaluateVariablePermutation = (rowObject: RowObject, variableAssignment: VariableAssignment): RowObject => {
  const withVariablesAssigned = resolveVariableAssignments(rowObject, variableAssignment)
  return evaluateFullProposition(withVariablesAssigned)
}