import * as React from "react";
import { GraphModel, Node, Link } from './graph-model'

interface Props {
  model: GraphModel;
}

const rectWidth = 25;
const rectHeight = 25;
const charWidth = 10;

export class GraphView extends React.Component<Props, {}> {
  protected nodes:Array<Node>;
  protected links:Array<Link>;
  protected nodeMove: {nodeIndex:number, delta: Array<number>};

  constructor(props: any) {
    super(props);
    this.nodes = props.model.getNodes();
    this.links = props.model.getLinks();
    let maxX = this.nodes.reduce((acc, val)=> val.pos[0]>acc?val.pos[0]:acc, -Infinity) + rectWidth*2;
    let maxY = this.nodes.reduce((acc, val)=> val.pos[1]>acc?val.pos[1]:acc, -Infinity) + rectHeight*2;
  }

  componentWillMount() { this.props.model.subscribe(this); }
  componentWillUnmount() { this.props.model.unsubscribe(this); }
  componentDidMount() { this.drawGraph(); }
  componentWillUpdate() {
    this.nodes = this.props.model.getNodes();
    this.links = this.props.model.getLinks();
  }

  //Отрисовка графа
  drawGraph() {
    const ctx = (this.refs.canvas as any).getContext('2d');
    //очищаем холст
    ctx.clearRect(0, 0, 500, 500);
    ctx.font = "italic 14pt Arial"

    //рисуем дуги
    for(let i = 0; i < this.links.length; i++) {
      ctx.beginPath();
      ctx.moveTo(this.nodes[this.links[i].from].pos[0]+rectWidth/2, 
        this.nodes[this.links[i].from].pos[1]+rectHeight/2);
      ctx.lineTo(this.nodes[this.links[i].to].pos[0]+rectWidth/2, 
        this.nodes[this.links[i].to].pos[1]+rectHeight/2);
      ctx.stroke();
    }
    
    //рисуем узлы
    for(let i = 0; i < this.nodes.length; i++) {
      ctx.fillStyle = this.nodes[i].color;
      ctx.fillRect(this.nodes[i].pos[0], 
        this.nodes[i].pos[1], 
        rectWidth, rectHeight);
      ctx.fillStyle = 'black';
      ctx.fillText(
        this.nodes[i].label, 
        this.nodes[i].pos[0]+rectWidth/2-charWidth*this.nodes[i].label.length/2, 
        this.nodes[i].pos[1]+rectHeight/2+charWidth/2);
    }
  }

  //Метод по координатам мыши определяет индекс
  //узла на которой наведена мышь
  getElementIndexByCoord(x:number, y:number) {
    let index = -1;
    for(let i = 0; i < this.nodes.length; i++) {
      if(x >= this.nodes[i].pos[0] && 
        x <= this.nodes[i].pos[0]+rectWidth && 
        y >= this.nodes[i].pos[1] && 
        y<=this.nodes[i].pos[1]+rectHeight) {
          index = i;
      }
    }
    return index;
  }

  updateCanvas(event:any) {
    //получаем идекс элемента над котором наведена мышь
    let nodeIndex = this.getElementIndexByCoord(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    if(~nodeIndex) {
      //сохраняем полученный индекс и расстоение между курсором и верхним левом углом узла
      this.nodeMove = {
        delta: [event.nativeEvent.offsetX-this.nodes[nodeIndex].pos[0], 
          event.nativeEvent.offsetY-this.nodes[nodeIndex].pos[1]], 
        nodeIndex:nodeIndex};
      //навешиваем обработчик на движение мыши
      //при движении мыши обновляем координаты узла
      (this.refs.canvas as any).onmousemove = (function(e:any) {
        let x = e.offsetX;
        let y = e.offsetY;
        this.nodes[this.nodeMove.nodeIndex].pos[0] = x-this.nodeMove.delta[0];
        this.nodes[this.nodeMove.nodeIndex].pos[1] = y-this.nodeMove.delta[1];
        //перерисовываем граф
        this.drawGraph();
      }).bind(this);
    }
  }

  render() {
    return (
      <canvas ref="canvas" width={500} height={500} onMouseDown={this.updateCanvas.bind(this)} 
        onMouseUp={event=> (event.nativeEvent.target as any).onmousemove = null}
        style={{border: "1px solid black"}}/>
    );
  }
}