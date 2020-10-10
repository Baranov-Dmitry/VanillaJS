export class Emmiter {
  constructor() {
    this.listeners = {}
  }

  // Уведомлеям слушателей если они есть
  emit(event, ...args) {
    // проверяем есть ли данное событие (event)
    if (!Array.isArray(this.listeners[event])) {
      return false
    }
    
    //
    this.listeners[event].forEach(listener => {
      listener(...args)
    })
    return true
  }

  // подписываемся на уведомления
  subscribe(event, fn) {
    // создаем пустой массив с ключом event без пораметра по дефолту [] не булет работать push
    this.listeners[event] = this.listeners[event] || []

    // в массив пушим функции для вызова их по срабатыванию события
    this.listeners[event].push(fn)

    // возвращаем функцию для отписки замыкаем переменую event в колбек функции
    return () => {
      this.listeners[event] = this.listeners[event].filter(listener => {
        return listener !== fn
      })
    }
  }
}

// // example
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
