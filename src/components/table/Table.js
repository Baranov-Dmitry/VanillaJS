import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.size';
import {isCell, matrix, nextSelector, shouldResize} from '@/components/table/table.functions';
import {TableSelection} from '@/components/table/TableSelection';
import {$} from '@core/dom';
import * as actions from '@/components/redux/actions'
import {defaultStyles} from '@/constants';
import {parse} from '@core/parse';

export class Table extends ExcelComponent {
  static className = 'excel__table'
  static rowsCount = 20

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      subscribe: ['currentText'],
      ...options
    })
    this.prepare()
  }

  prepare() {
    this.selection = new TableSelection()
  }

  toHTML() {
    return createTable(Table.rowsCount, this.store.getState())
  }

  init() {
    super.init();
    this.selectCell(this.$root.find('[data-id="0:0"]'))

    this.$on('formula:input', value => {
      this.selection.current.attr('data-value', value)
      this.selection.current.text(parse(value))
      this.updateTextInStore(value)
    })

    this.$on('formula:enter', () => {
      this.selection.current.focus()
    })

    this.$on('toolbar:applyStyle', value => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds
      }))
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
    const styles = $cell.getStyles(Object.keys(defaultStyles))
    this.$dispatch(actions.changeStyles(styles))
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event)
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('Resize error', e.message)
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event)
    } else if (isCell(event)) {
      const $target = $(event.target)
      if (event.shiftKey) {
        this.selection.selectGroup(matrix(this.selection.current, $target)
            .map((id) => {
              return this.$root.find(`[data-id="${id}"]`)
            })
        )
      } else {
        this.selectCell($target)
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

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }))
  }

  onInput(event) {
    this.updateTextInStore($(event.target).text())
  }
}
