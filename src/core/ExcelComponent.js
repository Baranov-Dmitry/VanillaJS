import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners)
    this.name = options.name || ''
    this.emmiter = options.emmiter
    this.subscribe = options.subscribe || []
    this.store = options.store
    this.unnsubscribers = []
    this.storeSub = null

    this.prepare()
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

  $dispatch(action) {
    this.store.dispatch(action)
  }

  storeChanged() {}

  isWatching(key) {
    return this.subscribe.includes(key)
  }

  // Инициализируем компонент добовляем DOM слушателей
  init() {
    this.initDOMListeners()
  }

  // удаляем компонент
  destroy() {
    this.removeDOMListeners()
    this.unnsubscribers.forEach(unsub => unsub())
    this.storeSub.unsubscribe()
  }
}
