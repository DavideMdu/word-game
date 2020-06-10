import UI from './ui.js';

export default class Stats {
  constructor() {
    this.startTime = Date.now();
    this.ui = new StatsUI();
    this.longest = 0;
    this.mostDistinctLetters = 0;
    this.hints = 0;
  }

  init() {
    this.timer = setInterval(() => {
      this.updateWordsPerMinute();
    }, 30000);
  }

  set foundWord(foundWord) {
    if (foundWord.length > this.longest) {
      this.longest = foundWord.length;
      this.ui.setLongestWordCount(this.longest);
    }

    const distinctLetters = new Set(foundWord);
    if (distinctLetters.size > this.mostDistinctLetters) {
      this.mostDistinctLetters = distinctLetters.size;
      this.ui.setMostLetters(this.mostDistinctLetters);
    }
  }

  set foundWords(foundWords) {
    this._foundWords = foundWords;
    this.ui.setFoundWordCount(foundWords.size);

    if (this._totalWordCount) {
      this.ui.setProgress(foundWords.size, this._totalWordCount);
    }

    if (!foundWords.size) {
      return;
    }

    const totalLength = Array.from(foundWords).reduce((sum, word) => sum += word.length, 0);
    const avgLength = totalLength / foundWords.size;
    this.ui.setAverageWordLength(avgLength);

    this.updateWordsPerMinute();
  }

  set totalWordCount(totalWordCount) {
    this._totalWordCount = totalWordCount;
    this.ui.setTotalWordCount(totalWordCount);

    this.ui.setProgress(this._foundWords?.size || 0, totalWordCount);
  }

  updateWordsPerMinute() {
    const wordsPerMinute = this._foundWords.size / ((Date.now() - this.startTime) / 60000);
    this.ui.setWordsPerMinute(wordsPerMinute);
  }

  toggleStats(force) {
    this.ui.toggleStats(force);
  }

  countHint(numHints) {
    numHints = numHints || 1;
    this.hints += numHints;
    this.ui.setHints(this.hints);
  }

  clearTimer() {
    clearTimeout(this.timer);
  }
}

class StatsUI extends UI {
  constructor() {
    super();
    this.toggleButton = StatsUI.getEl('toggle-stats');
    this.expandedStats = StatsUI.getEl('expanded-stats');
    this.progressBar = StatsUI.getEl('progress-bar');
    this.foundWordCount = StatsUI.getEl('found');
    this.totalWordCount = StatsUI.getEl('total');
    this.longestWordCount = StatsUI.getEl('longest');
    this.mostLetters = StatsUI.getEl('most-letters');
    this.avgLength = StatsUI.getEl('avg-length');
    this.wordsPerMinute = StatsUI.getEl('wpm');
    this.hints = StatsUI.getEl('hints');

    this.init();
  }

  init() {
    this.toggleButton.addEventListener('click', e => {
      this.toggleStats();
    });
  }

  toggleStats(force) {
    this.expandedStats.classList.toggle('hidden', force);
  }

  setFoundWordCount(foundWordCount) {
    this.foundWordCount.innerText = foundWordCount;
  }

  setTotalWordCount(totalWordCount) {
    this.totalWordCount.innerText = totalWordCount;
  }

  setProgress(foundWordCount, totalWordCount) {
    this.progressBar.style.width = `${foundWordCount * 100 / totalWordCount}%`;
  }

  setLongestWordCount(longestWordCount) {
    this.longestWordCount.innerText = longestWordCount;
  }

  setMostLetters(mostLetters) {
    this.mostLetters.innerText = mostLetters;
  }

  setAverageWordLength(avgLength) {
    this.avgLength.innerText = avgLength.toFixed(1);
  }

  setWordsPerMinute(wordsPerMinute) {
    this.wordsPerMinute.innerText = wordsPerMinute.toFixed(1);
  }

  setHints(hints) {
    this.hints.innerText = hints;
  }
}