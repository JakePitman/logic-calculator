import {TruthValue} from "./index"

export type WorkingRow = (string | TruthValue | null)[]

export type RowObject = {
  workingRow: WorkingRow,
  evaluatedRow: (TruthValue | null)[]
}
