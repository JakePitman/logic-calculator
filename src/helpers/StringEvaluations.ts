import { TruthValue } from "./Operators"

type RowObject = {
  originalRow: string[],
  workingRow: (string | TruthValue | null)[],
  evaluatedRow: (TruthValue | null)[]
}

const permittedVars = "abcdefghijklmnopqrstuwxyz"
const permittedOperators = "v&~<>"
const permittedExtra = "()"
const permittedChars = permittedVars + permittedOperators + permittedExtra

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
