import BaseModel from "./base-model";

export interface Node {
  label: string;
  pos: Array<number>;
  color: string; // к примеру #c0c0c0
}

export interface Link {
  from: number; // индекс первого узла
  to: number; // индекс второго узла
} 
  
export class GraphModel extends BaseModel {

  protected links: Array<Link>;
  protected nodes: Array<Node>;

  // должен вернуть массив всех связей узлов
  getLinks(): Array<Link> {
    return this.links;
  };

  // должен возвращать массив всех узлов
  getNodes(): Array<Node> {
    return this.nodes;
  };

  // при вызове контрол GraphView должен начать отображать переданные узлы и связи
  setNodesAndLinks(nodes: Array<Node>, links: Array<Link>) {
    this.nodes = nodes;
    this.links = links;
    this.updateViews()
  };
}