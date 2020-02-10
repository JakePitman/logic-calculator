type TruthValue = 1 | 0

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