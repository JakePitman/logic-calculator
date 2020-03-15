import { VariableAssignments, RowObject } from "../src/sharedTypes"
const Table = require("tty-table")
import chalk from "chalk"

type EvaluatedRows = {
  variableAssignments: VariableAssignments,
  rowObject: RowObject
}[]

const createHeader = (originalProposition: string[]) => {
  const header = originalProposition.map(char => {
    return {
      value: char
    }
  })
  header.unshift({ value: "Variable Assignments" } )
  return header
}

const createRows = (evaluatedRows: EvaluatedRows) => {
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
  return rows
}

export default (
    originalProposition: string[],
    evaluatedRows: EvaluatedRows
  ) => {
  const header = createHeader(originalProposition)
  const rows = createRows(evaluatedRows)
  return Table(header, rows).render()
}
