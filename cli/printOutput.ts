import { colorizeDarkBlue } from "./colorize"
import { EvaluatedRows } from "../src/sharedTypes"
import figlet from "figlet"
import createTable from "./createTable"

export const printBanner = () => {
  console.log(
    colorizeDarkBlue(
      figlet.textSync('Logic\nCalculator', { font: "Small Poison" , horizontalLayout: 'fitted' })
    )
  );
}

export const printTable = (originalProposition: string[], evaluatedRows: EvaluatedRows) => {
  const table = createTable(originalProposition, evaluatedRows)
  console.log(table)
}