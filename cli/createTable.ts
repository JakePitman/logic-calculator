import { VariableAssignments, RowObject } from "../src/sharedTypes"
const Table = require("tty-table")
import chalk from "chalk"

export default (
    originalProposition: string[],
    evaluatedRows: {variableAssignments: VariableAssignments, rowObject: RowObject}[]
  ) => {
  const header = originalProposition.map(char => {
    return {
      value: char
    }
  })
  header.unshift({ value: "Variable Assignments" } )
  const rows = evaluatedRows.map((evaluation) => {
    const { evaluatedRow, workingRow } = evaluation.rowObject
    const overallTruthValue = workingRow.find(e => {return typeof e === "number"})
    const indexOfOverallTruthValue = workingRow.indexOf(overallTruthValue)
    const result = evaluatedRow.map((char, i) => {
      if (i === indexOfOverallTruthValue) {
        return char === 1 ? chalk.green("1") : chalk.red("0")
      } else {
        return char === null ? "" : `${char}`
      }
    })
    const variableAssignmentsString = Object.keys(evaluation.variableAssignments).map(variableKey => {
      return `${variableKey}: ${evaluation.variableAssignments[variableKey]}`
    }).join(", ")
    result.unshift(variableAssignmentsString)
    return result
  })

  return Table(header, rows).render()
}
