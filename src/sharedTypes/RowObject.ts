import {TruthValue} from "./index"

export type WorkingRow = (string | TruthValue | null)[]

export type RowObject = {
  originalRow: string[],
  workingRow: WorkingRow,
  evaluatedRow: (TruthValue | null)[]
}
