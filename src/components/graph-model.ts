import BaseModel from "./base-model";
import { node } from "prop-types";

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
  
export class GraphModel extends BaseModel {

  protected links: Array<Link>;
  protected nodes: Array<Node>;
  protected nodeSize: {width:number, height:number} = {width: 40, height: 40};
  protected cursorStartPos: Array<number>;
  protected areaSize: Array<number>;
  protected moveFlag:boolean = false;
  protected selectArea = false;
  protected copyPosForDaD: Array<Array<number>>;
  protected canvasSize: {width:number, height:number} = {width: 512, height: 256};

  //Метод по координатам мыши находит узел на который она наведена
  //если узлов несколько, то возвращается последний, т.к. он будет отрисовыватся последним
  protected getNodeIndexByCoord(x:number, y:number): number {
    let node = -1;
    for(let i = 0; i < this.nodes.length; i++) {
      if(x >= this.nodes[i].pos[0] && x <= this.nodes[i].pos[0]+this.nodeSize.width && 
        y >= this.nodes[i].pos[1] && y<=this.nodes[i].pos[1]+this.nodeSize.height) {
          node = i;
      }
    }
    return node;
  }

  //проверяет на сколько можно сдвинуть узлы, чтобы не было выхода за границы
  protected testDelta(deltaX:number, deltaY:number) {
    var newdx = deltaX, newdy = deltaY;
    for(var i = 0; i<this.nodes.length; i++) {
      if(this.nodes[i].selected) {
        //правая граница
        if(this.copyPosForDaD[i][0]+deltaX+this.nodeSize.width>this.canvasSize.width) {
          newdx = this.canvasSize.width-(this.copyPosForDaD[i][0]+this.nodeSize.width);
          deltaX = newdx;
        }
        //левая граница
        if(this.copyPosForDaD[i][0]+deltaX<0) {
          newdx = -this.copyPosForDaD[i][0];
          deltaX = newdx;
        }
        //верхняя граица
        if(this.copyPosForDaD[i][1]+deltaY<0) {
          newdy = -this.copyPosForDaD[i][1];
          deltaY = newdy;
        }
        //нижняя граница
        if(this.copyPosForDaD[i][1]+deltaY+this.nodeSize.height>this.canvasSize.height) {
          newdy = this.canvasSize.height-(this.copyPosForDaD[i][1]+this.nodeSize.width);
          deltaY = newdy;
        }
      }
    }
    return {deltaX:newdx, deltaY:newdy}
  }

  moveMarkNode(newCursorPosX:number, newCursorPosY:number) {
    let delta = this.testDelta(newCursorPosX-this.cursorStartPos[0], newCursorPosY-this.cursorStartPos[1])
    for(var i = 0; i<this.nodes.length; i++) {
      if(this.nodes[i].selected) {
        this.nodes[i].pos = [this.copyPosForDaD[i][0]+delta.deltaX, 
          this.copyPosForDaD[i][1]+delta.deltaY];
      }
    }
    /*for(var i = 0; i<this.nodes.length; i++) {
      if(this.nodes[i].selected) {
        this.nodes[i].pos = [this.copyPosForDaD[i][0]+newCursorPosX-this.cursorStartPos[0], 
          this.copyPosForDaD[i][1]+newCursorPosY-this.cursorStartPos[1]];
      }
    }*/
    this.updateViews();
  }

  selectNodesByArea(endPosX:number, endPosY:number) {
    //получаем координаты верхней левой точки
    let cs = [
      this.cursorStartPos[0]<endPosX? this.cursorStartPos[0]:endPosX,
      this.cursorStartPos[1]<endPosY? this.cursorStartPos[1]:endPosY
    ]
    //получаем координаты нижней правой точки
    let ce = [
      this.cursorStartPos[0]>endPosX? this.cursorStartPos[0]:endPosX,
      this.cursorStartPos[1]>endPosY? this.cursorStartPos[1]:endPosY
    ];

    let w = this.nodeSize.width;
    let h = this.nodeSize.height;
    for(let i=0; i<this.nodes.length; i++) {
      let p = this.nodes[i].pos;
      this.nodes[i].selected =
        p[0]>cs[0]&&p[0]<ce[0] && p[1]>cs[1]&&p[1]<ce[1] ||
        p[0]+w>cs[0]&&p[0]+w<ce[0] && p[1]>cs[1]&&p[1]<ce[1] ||
        p[0]>cs[0]&&p[0]<ce[0] && p[1]+h>cs[1]&&p[1]+h<ce[1] ||
        p[0]+w>cs[0]&&p[0]+w<ce[0] && p[1]+h>cs[1]&&p[1]+h<ce[1];
    }
    this.updateViews();
  }

  //возвращает координаты выделеной облости
  //x,y,width,height
  getSelectionArea():Array<number> {
    if(this.areaSize) {
      return this.cursorStartPos.concat(this.areaSize)
    } 
    return null;
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

  //устанавливает размер узлов
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

  onMouseDown(x:number, y:number, ctrlFlag:boolean) {
    this.cursorStartPos = [x, y];
    let indexNode = this.getNodeIndexByCoord(x, y);
    if(~indexNode) { // клик по узлу
      if(!this.nodes[indexNode].selected) {//узел не выделен
        if(ctrlFlag) { //выделяем узел
          this.nodes[indexNode].selected = true;
        } else { // выделяем узел и снимаем выделение с других узлов
          for(let i=0; i<this.nodes.length; i++) {
            this.nodes[i].selected = indexNode==i;
          }
        }
      } else if(ctrlFlag) {
        this.nodes[indexNode].selected = false;
      }
    } else { //клик по пустой области
      this.selectArea = true;
      for(let i=0; i<this.nodes.length; i++) {
        this.nodes[i].selected = false;
      }
    }
  }

  onMouseUp(x:number, y:number, ctrlFlag:boolean) {
    let indexNode = this.getNodeIndexByCoord(x, y);
    //если выделено несколько элеметов и произошел клик на один из выделеных
    //то снимаем выделение с других
    if(~indexNode && !this.moveFlag && this.nodes[indexNode].selected && !ctrlFlag) { // MousePress
      for(let i=0; i<this.nodes.length; i++) {
        this.nodes[i].selected = indexNode==i;
      }
    }
    this.cursorStartPos = null;
    this.moveFlag = false;
    this.selectArea = false;
    this.areaSize = null;
    this.copyPosForDaD = null;
    this.updateViews();
  }
  
  onMouseMove(x:number, y:number) {
    if(!this.moveFlag) {
      this.copyPosForDaD = this.nodes.map(function(n) {
        return n.pos.slice();
      })
    }
    this.moveFlag = true;
    if(this.selectArea) {
      this.areaSize = [x-this.cursorStartPos[0], y-this.cursorStartPos[1]];
      this.selectNodesByArea(x,y);
    } else {
      this.moveMarkNode(x, y);
    }
  }
}