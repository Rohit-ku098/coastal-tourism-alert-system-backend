// state management
class State {
  state;
  get() {
    return this.state;
  }
  set(state) {
    this.state = state;
  }
  reset() {
    this.state = null;
  }
  constructor(state) {
    this.state = state;
  }
}

export default State