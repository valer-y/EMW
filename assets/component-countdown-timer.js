/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
class CountdownTimer extends HTMLElement {
  constructor() {
    super();
    this.daysDigits = new Array(this.maxDays.length).fill(0);
    this.lastDigits = [...this.daysDigits, 0, 0, 0, 0, 0, 0];
    this.digitContainers = this.querySelectorAll('[data-digit]');
    this.firstInit = true;
    this.wethemeGlobal = document.querySelector('script#wetheme-global');
    this.translationsObject = JSON.parse(this.wethemeGlobal.textContent);
  }

  connectedCallback() {
    this.init();
  }

  init() {
    if (this.timeRemaining > this.timeRemainingMax) return;

    if (this.timeRemaining < 0) {
      this.showTimerCompleteContent();
    }

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.updateTimer();
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  updateTimer() {
    const timeValues = this.getTimeValues(this.timeRemaining);
    const nowDigits = this.getDigitsFromTimeValues(timeValues);

    // If time digit has changed, animate in the new digit
    nowDigits.map((nowDigit, index) => {
      const lastDigit = this.lastDigits[index]
      if (nowDigit != lastDigit) {
        this.animateDigit(this.digitContainers[index], nowDigit, this.firstInit);
      }
    });
    
    this.handleTimerComplete(nowDigits);

    this.lastDigits = nowDigits;
    this.firstInit = false;
    this.setAttribute('aria-label', `${timeValues.days} ${this.translationsObject.translations.days} ${timeValues.hours} ${this.translationsObject.translations.hours} ${timeValues.minutes} ${this.translationsObject.translations.minutes} ${timeValues.seconds} ${this.translationsObject.translations.seconds} remaining`);
  }

  animateDigit(container, now, firstInit) {

    // Add roll in animation class (unless timer is first loading)
    if (!firstInit) {
      container.classList.add('countdown-timer__roll-in');
    }

    // Populate rolling in element with the time now
    const now_digit = container.querySelector('[data-digit-now]');
    now_digit.innerHTML = now;

    // Reset after animation
    setTimeout(() => {
      // Remove roll in animation class
      container.classList.remove('countdown-timer__roll-in');

      // Update visible element with the time now
      const last_digit = container.querySelector('[data-digit-last]');
      last_digit.innerHTML = now;
    }, 500)
    
    this.hideWhenZero(container, now);
  }

  // Takes an object with days, hours, minutes and seconds, returns an array of 9 digits
  getDigitsFromTimeValues(timeValues) {
    return [
      ...timeValues.days.toString().padStart(this.maxDays.length, '0').split('').map(Number),
      ...timeValues.hours.toString().padStart(2, '0').split('').map(Number),
      ...timeValues.minutes.toString().padStart(2, '0').split('').map(Number),
      ...timeValues.seconds.toString().padStart(2, '0').split('').map(Number)
    ];
  }

  // Takes a time in milliseconds, returns an object with days, hours, minutes and seconds
  getTimeValues(time) {
    return {
      days: Math.floor(time / (1000 * 60 * 60 * 24)),
      hours: Math.floor((time / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((time / 1000 / 60) % 60),
      seconds: Math.floor((time / 1000) % 60)
    };
  }

  hideWhenZero(element, digit) {
    if (!element) return;
    if (element.hasAttribute('data-hide-when-zero') && digit === 0) element.parentElement.classList.add('hide');
  }

  handleTimerComplete(nowDigits) {
    // If digit array is full of zeros, time is complete
    const isComplete = !nowDigits.filter(digit => digit !== 0).length;
    if (!isComplete) return;

    if (this.hideWhenComplete) {
      this.hideTimer();
    }

    this.showTimerCompleteContent();
  }

  hideTimer() {
    this.classList.add('hide');
  }

  showTimerCompleteContent() {
    const timerCompleteContent = document.querySelectorAll('[data-timer-complete-content]');
    if (!timerCompleteContent) return;
    timerCompleteContent.forEach(content => {
      if (content.dataset.sectionId === this.sectionId) {
        content.classList.remove('hide')
      }
    });
  }

  get timeRemaining() {
    return +new Date(`${this.year}/${this.month}/${this.day} ${this.hour}:${this.minute}:${this.second} ${this.timezone}`).getTime() - +new Date().getTime();
  }

  get timeRemainingMax() {
    return parseInt(this.maxDays) * 1000 * 60 * 60 * 24;
  }

  get maxDays() {
    return this.dataset.maxDays;
  }

  get hideWhenComplete() {
    return this.dataset.hideWhenComplete === 'true';
  }

  get timezone() {
    return this.dataset.timezone;
  }

  get year() {
    return this.dataset.year;
  }

  get month() {
    return this.dataset.month;
  }

  get day() {
    return this.dataset.day;
  }

  get hour() {
    return this.dataset.hour;
  }

  get minute() {
    return this.dataset.minute;
  }

  get second() {
    return this.dataset.second;
  }

  get sectionId() {
    return this.dataset.sectionId;
  }

  disconnectedCallback() {
    clearInterval(this.timerInterval);
  }
}

customElements.define('countdown-timer', CountdownTimer);

/******/ })()
;