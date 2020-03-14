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
  const rows = evaluatedRows.map((evaluation) => {
    const { evaluatedRow, workingRow } = evaluation.rowObject
    const overallTruthValue = workingRow.find(e => {return typeof e === "number"})
    const indexOfOverallTruthValue = workingRow.indexOf(overallTruthValue)
    return evaluatedRow.map((char, i) => {
      if (i === indexOfOverallTruthValue) {
        return char === 1 ? chalk.green("1") : chalk.red("0")
      } else {
        return char === null ? "" : `${char}`
      }
    })
  })

  return Table(header, rows).render()
}
