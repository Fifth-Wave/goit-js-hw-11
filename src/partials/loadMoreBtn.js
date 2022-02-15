export class LoadMoreBnt {
  #isOn = false;
  btnEl;

  constructor(selector) {
    this.btnEl = document.querySelector(selector);
  }

  turnOn() {
    if (this.#isOn) return;
    this.#isOn = true;
    this.btnEl.classList.remove('visually-hidden');
  }

  turnOff() {
    if (!this.#isOn) return;
    this.#isOn = false;
    this.btnEl.classList.add('visually-hidden');
  }
}
