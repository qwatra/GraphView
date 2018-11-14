import * as React from "react";
import * as ReactDOM from "react-dom";

import { GraphModel, Node, Link } from "./components/graph-model";
import { GraphView } from "./components/graph-view";

const graph = new GraphModel();
graph.setNodesAndLinks(
  [{label:'a', color: 'red', pos: [0, 0]}, {label:'b', color: 'green', pos: [1000, 100]}, {label:'c', color:'blue', pos:[250,250]}],
  [{from: 0, to: 1},{from: 1, to: 2}]
)

ReactDOM.render(
    <GraphView model={graph} size={{width:500, height:500}}/>,
    document.getElementById("root")
);