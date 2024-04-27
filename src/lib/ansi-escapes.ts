export const curNLeft = (n: number) => `\x1b[${n}D`
export const curNRight = (n: number) => `\x1b[${n}C`
export const eraseFromCursorToEndLine = '\x1b[K'
export const eraseFromLineStartToCursor = '\x1b[1K'
export const eraseLine = '\x1b[2K'
