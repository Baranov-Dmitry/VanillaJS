export class Emmiter {
  constructor() {
    this.listeners = {}
  }

  // Уведомлеям слушателей если они есть
  emit(event, ...args) {
    if (!Array.isArray(this.listeners[event])) {
      return false
    }
    this.listeners[event].forEach(listener => {
      listener(...args)
    })
    return true
  }

  // подписываемся на уведомления
  subscribe(event, fn) {
    this.listeners[event] = this.listeners[event] || []
    this.listeners[event].push(fn)
    return () => {
      this.listeners[event] = this.listeners[event].filter(listener => {
        return listener !== fn
      })
    }
  }
}

// example
// const emmiter = new Emmiter()
//
// const uncubscribe = emmiter.subscribe('Dmitry', data => console.log('Sub: ', data))
//
// emmiter.emit('hgserth', 42)
// emmiter.emit('Dmitry', 42)
//
// setTimeout(() => {
//   emmiter.emit('Dmitry', 'after 2 sec')
// }, 2000)
//
// setTimeout(() => {
//   uncubscribe()
// }, 3000)
//
// setTimeout(() => {
//   emmiter.emit('Dmitry', 'after 4 sec')
// }, 4000)
