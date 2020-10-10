import {toInlineStyles} from '@core/utils';
import {parse} from '@core/parse';
import {defaultStyles} from '@/constants';

const CODES = {
  A: 65,
  Z: 90
}

const DEFAULT_WIDTH = 80
const DEFAULT_HEIGHT = 24

function getWidth(width, index) {
  return (width[index] || DEFAULT_WIDTH) + 'px'
}

function getHeight(height, index) {
  return (height[index] || DEFAULT_HEIGHT) + 'px'
}

function toCell(state, row) {
  return (_, col) => {
    const id = `${row}:${col}`
    const data = state.dataState[id]
    console.log(state)
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id]
    })
    return `
      <div 
        class="cell" 
        contenteditable=""
        data-col="${col}"
        data-id="${row}:${col}"
        data-type="cell"
        data-value="${data || ''}"
        style="${styles}; width: ${getWidth(state.colState, col)}"
      >
      ${parse(data) || ''}
      </div>
    `
  }
}

function toColumn({col, index, width}) {
  return `
    <div class="column" data-type="resizable" data-col="${index}" style="width: ${width}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

function createRow(content, index = '', rowState = {}) {
  const resize = index ? '<div class="row-resize" data-resize="row"></div>' : ''
  return `
    <div 
      class="row" 
      data-type="resizable" 
      data-row="${index}" 
      style="height: ${getHeight(rowState, index)}"
    >
        <div class="row-info">
          ${index}
          ${resize}
        </div>
        <div class="row-data">${content}</div>
    </div>
  `
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

function getWithCallback(state) {
  return (col, index) => {
    return {
      col, index, width: getWidth(state.colState, index)
    }
  }
}

export function createTable(rowsCount = 15, state = {}) {
  const colsCount = CODES.Z - CODES.A
  const rows = []
  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(getWithCallback(state))
      .map(toColumn)
      .join('')

  rows.push(createRow(cols))

  for (let row = 0; row < rowsCount; row++) {
    const emptyCols = []
    emptyCols.push(new Array(colsCount)
        .fill('')
        .map(toCell(state, row,))
        .join('')
    )
    rows.push(createRow(emptyCols, row + 1, state.rowState))
  }
  return rows.join('')
}
