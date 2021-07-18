import { makeObservable, observable } from "mobx";
import RendererInfo from "store/renderer_info";

export default class Store {
  @observable rendererInfo = new RendererInfo();
  constructor() {
    makeObservable(this);
  }
}
