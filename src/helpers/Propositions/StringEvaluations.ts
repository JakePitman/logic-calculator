import {
  RowObject,
  permittedChars,
  permittedVars,
  VariableAssignments
} from "../../sharedTypes"
import _ from "lodash"

const isPermittedChar = (char: string) => {
  return (permittedChars.includes(char))
}

const resolveBiconditionals = (splitProposition: string[]) => {
  const result: string[] = []
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

export const propositionStringToArray = (propositionString: string): string[] => {
  const withExtraBracketPair = `(${propositionString})`
  const filteredByPermittedChars = withExtraBracketPair.split("").filter(e => isPermittedChar(e))
  return resolveBiconditionals(filteredByPermittedChars)
}

export const createRowObject = (propositionArray: string[]): RowObject => {
  return ( 
    {
      workingRow: propositionArray,
      evaluatedRow: propositionArray.map(e => null)
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
