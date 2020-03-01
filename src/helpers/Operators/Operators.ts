import { TruthValue } from "../../sharedTypes"

export const evalAnd = (arg1: TruthValue, arg2: TruthValue ): TruthValue => {
  return arg1 && arg2
}

export const evalOr = (arg1: TruthValue, arg2: TruthValue ): TruthValue => {
  return arg1 || arg2
}

export const evalIfThen = (arg1: TruthValue, arg2: TruthValue ): TruthValue => {
  return arg1 && !arg2 ? 0 : 1
}

export const evalBiconditional = (arg1: TruthValue, arg2: TruthValue ): TruthValue => {
  return arg1 === arg2 ? 1 : 0
}

export const evalNot = (value: TruthValue): TruthValue => {
  return value === 1 ? 0 : 1
}

export const evalOperator = (leftOperand: TruthValue, operator: string, rightOperand: TruthValue): TruthValue => {
  switch(operator) {
    case "&":
      return evalAnd(leftOperand, rightOperand)
    case "v":
      return evalOr(leftOperand, rightOperand)
    case ">":
      return evalIfThen(leftOperand, rightOperand)
    case "<>":
      return evalBiconditional(leftOperand, rightOperand)
    default:
      throw Error("Invalid operator found")
  }
} 