import BaseModel from "./base-model";

export interface Node {
  label: string;
  pos: Array<number>;
  color: string; // к примеру #c0c0c0
  selected: boolean;
}

export interface Link {
  from: number; // индекс первого узла
  to: number; // индекс второго узла
} 

//const rectWidth = 40;
//const rectHeight = 40;

  
export class GraphModel extends BaseModel {

  protected links: Array<Link>;
  protected nodes: Array<Node>;
  protected nodeSize: {width:number, height:number} = {width: 40, height: 40};

  //Метод по координатам мыши находит узел на который она наведена
  //если узлов несколько, то возвращается последний, т.к. он будет отрисовыватся последним
  protected getNodeByCoord(x:number, y:number) {
    let node = null;
    for(let i = 0; i < this.nodes.length; i++) {
      if(x >= this.nodes[i].pos[0] && x <= this.nodes[i].pos[0]+this.nodeSize.width && 
        y >= this.nodes[i].pos[1] && y<=this.nodes[i].pos[1]+this.nodeSize.height) {
          node = this.nodes[i];
      }
    }
    return node;
  }

  //markNode - пытатся найти элемент по координатам и выделить в случае успеха возвращает true
  setMarkNode(x:number, y:number): boolean {
    var node = this.getNodeByCoord(x, y);
    if(node) {
      node.selected = true;
      this.updateViews();
      return true;
    }
    return false;
  }

  moveMarkNode(deltaX:number, deltaY:number) {
    for(var i = 0; i<this.nodes.length; i++) {
      if(this.nodes[i].selected) {
        this.nodes[i].pos = [this.nodes[i].pos[0]+deltaX, this.nodes[i].pos[1]+deltaY];
      }
    }
    this.updateViews();
  }

  // должен вернуть массив всех связей узлов
  getLinks(): Array<Link> {
    return this.links;
  };

  // должен возвращать массив всех узлов
  getNodes(): Array<Node> {
    return this.nodes;
  };

  //Возвращает размер узлов
  getNodeSize() {
    return this.nodeSize;
  }

  setNodeSize(size:{width:number, height:number}) {
    this.nodeSize = size;
    this.updateViews();
  }

  // при вызове контрол GraphView должен начать отображать переданные узлы и связи
  setNodesAndLinks(nodes: Array<Node>, links: Array<Link>) {
    this.nodes = nodes;
    this.links = links;
    this.updateViews();
  };
}