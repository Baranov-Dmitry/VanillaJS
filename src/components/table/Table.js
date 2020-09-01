import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.size';
import {isCell, matrix, nextSelector, shouldResize} from '@/components/table/table.functions';
import {TableSelection} from '@/components/table/TableSelection';
import {$} from '@core/dom';

export class Table extends ExcelComponent {
  static className = 'excel__table'
  static rowsCount = 20

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options
    })
    this.prepare()
  }

  prepare() {
    this.selection = new TableSelection()
  }

  toHTML() {
    return createTable(Table.rowsCount)
  }

  init() {
    super.init();
    this.selectCell(this.$root.find('[data-id="0:0"]'))

    this.$on('formula:input', text => {
      this.selection.current.text(text)
    })
    this.$on('formula:enter', () => {
      this.selection.current.focus()
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this.$root, event)
    } else if (isCell(event)) {
      if (event.shiftKey) {
        this.selection.selectGroup(matrix(this.selection.current, $(event.target))
            .map((id) => {
              return this.$root.find(`[data-id="${id}"]`)
            })
        )
      } else {
        this.selection.select($(event.target))
      }
    }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight'
    ]
    const {key} = event

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault()
      const {row, col} = this.selection.current.id(true)
      this.selectCell(this.$root.find(nextSelector(row, col, key)))
    }
  }

  onInput(event) {
    this.$emit('table:input', $(event.target))
  }
}
