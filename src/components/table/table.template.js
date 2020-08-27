const CODES = {
  A: 65,
  Z: 90
}

function toCell(content) {
  return `
    <div class="cell" contenteditable="">${content}</div>
  `
}

function toCol(content) {
  return `
    <div class="column">${content}</div>
  `
}

function createRow(content, index = '') {
  return `
    <div class="row">
        <div class="row-info">${index}</div>
        <div class="row-data">${content}</div>
    </div>
  `
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A
  const rows = []
  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(toCol)
      .join('')

  rows.push(createRow(cols))

  for (let i = 0; i < rowsCount; i++) {
    const emptyCols = []
    emptyCols.push(new Array(colsCount)
        .fill('')
        .map(toCell)
        .join('')
    )
    rows.push(createRow(emptyCols, i + 1))
  }
  return rows.join('')
}
