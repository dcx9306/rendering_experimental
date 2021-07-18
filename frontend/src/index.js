import "./main.scss";
import React from "react";
import ReactDOM from "react-dom";
import Renderer from "renderer";
import storeContext from "store/context";
import RendererInfoComponent from "components/RendererInfo";
import Store from "store";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }
  componentDidMount() {
    this.renderer = new Renderer(document.body, this.store);
  }
  render() {
    return (
      <storeContext.Provider value={this.store}>
        <RendererInfoComponent />
      </storeContext.Provider>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
