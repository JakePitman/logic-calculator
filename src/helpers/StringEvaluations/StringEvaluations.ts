import { TruthValue } from "../../sharedTypes"
import { permittedChars, VariableAssignment } from "../../sharedTypes"

export type WorkingRow = (string | TruthValue | null)[]

type RowObject = {
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
  const filteredByPermittedChars = proposition.split("").filter(e => isPermittedChar(e))
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
  const result = {...rowObject}
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