import { makeObservable, observable, action } from "mobx";

export default class RendererInfo {
  @observable.ref memory = {};
  @observable.ref render = {};
  @observable fps = 0;
  constructor() {
    makeObservable(this);
    this.timestamps = [];
    this.queueSizeLimit = 20;
  }

  @action update(rendererInfo) {
    const now = performance.now();
    this.memory = rendererInfo.memory;
    this.render = rendererInfo.render;
    if (this.timestamps.length > 0) {
      this.fps = (this.timestamps.length * 1000) / (now - this.timestamps[0]);
      if (this.timestamps.length === this.queueSizeLimit) {
        this.timestamps.shift();
      }
    }
    this.timestamps.push(now);
  }
}
