export default class Counter {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  increment() {
    return ++this.value;
  }

  decrement() {
    return --this.value;
  }

  set(newValue) {
    this.value = newValue;
  }
}
