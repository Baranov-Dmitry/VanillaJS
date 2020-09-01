import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners)
    this.name = options.name || ''
    this.emmiter = options.emmiter
    this.unnsubscribers = []
  }

  // настраиваем компонент
  prepare() {}

  toHTML() {
    return ''
  }


  // Уведомляем слушателей про событие event
  $emit(event, ...arg) {
    this.emmiter.emit(event, ...arg)
  }

  // подписываемся на событие on
  $on(event, fn) {
    this.unnsubscribers.push(this.emmiter.subscribe(event, fn))
  }

  // Инициализируем компонент добовляем DOM слушателей
  init() {
    this.initDOMListeners()
  }

  // удаляем компонент
  destroy() {
    this.removeDOMListeners()
    this.unnsubscribers.forEach(unsub => unsub())
  }
}
