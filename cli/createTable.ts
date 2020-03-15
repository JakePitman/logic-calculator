import { VariableAssignments, RowObject } from "../src/sharedTypes"
import { colorizeDarkBlue, colorizeTrue, colorizeFalse } from "./colorize"

const Table = require("tty-table")

type EvaluatedRows = {
  variableAssignments: VariableAssignments,
  rowObject: RowObject
}[]

const createHeader = (originalProposition: string[]) => {
  const header = originalProposition.map(char => {
    return {
      value: colorizeDarkBlue(char),
    }
  })
  header.unshift({ value: colorizeDarkBlue("Variable Assignments")})
  return header
}

const createRows = (evaluatedRows: EvaluatedRows) => {
  const rows = evaluatedRows.map((evaluation) => {
    const { evaluatedRow, workingRow } = evaluation.rowObject
    const overallTruthValue = workingRow.find(e => {return typeof e === "number"})
    const indexOfOverallTruthValue = workingRow.indexOf(overallTruthValue)
    const result = evaluatedRow.map((char, i) => {
      if (i === indexOfOverallTruthValue) {
        return char === 1 ? colorizeTrue("1") : colorizeFalse("0")
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
