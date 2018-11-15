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

  links: Array<Link>;
  nodes: Array<Node>;

  //Метод по координатам мыши определяет индекс
  //узла на которой наведена мышь
  getElementIndexByCoord(x:number, y:number) {
    let index = -1;
    for(let i = 0; i < this.nodes.length; i++) {
      if(x >= this.nodes[i].pos[0] && 
        x <= this.nodes[i].pos[0] && 
        y >= this.nodes[i].pos[1] && 
        y<=this.nodes[i].pos[1]) {
          index = i;
      }
    }
    return index;
  }

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