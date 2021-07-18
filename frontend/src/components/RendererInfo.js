import storeContext from "store/context";
import React from "react";
import { observer } from "mobx-react";

@observer
export default class RendererInfoComponent extends React.Component {
  static contextType = storeContext;
  constructor(props) {
    super(props);
  }
  render() {
    const { rendererInfo } = this.context;
    const rows = {
      fps: rendererInfo.fps,
      drawCall: rendererInfo.render.call || 0,
    };
    return (
      <table>
        {Object.entries(rows).forEach((key, val) => (
          <tr key={key}>
            <td>{`${key}  :`}</td>
            <td>{` ${val}`}</td>
          </tr>
        ))}
      </table>
    );
  }
}
