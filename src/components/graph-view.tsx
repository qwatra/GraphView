import * as React from "react";
import { GraphModel, Node, Link } from './graph-model'

interface Props {
  model: GraphModel;
  size: {width:number, height:number};
}

const rectWidth = 25;
const rectHeight = 25;
const charWidth = 10;

export class GraphView extends React.Component<Props, {}> {
  protected nodes:Array<Node>;
  protected links:Array<Link>;
  protected nodeMove: {nodeIndex:number, delta: Array<number>};
  //Коэффициент сжатия
  //Для того чтобы "граф поместился полностью в
  //доступное контролу пространство"
  protected scalingFactor:{x:number,y:number};

  constructor(props: any) {
    super(props);
    this.nodes = props.model.getNodes();
    this.links = props.model.getLinks();
    let maxX = this.nodes.reduce((acc, val)=> val.pos[0]>acc?val.pos[0]:acc, -Infinity) + rectWidth*2;
    let maxY = this.nodes.reduce((acc, val)=> val.pos[1]>acc?val.pos[1]:acc, -Infinity) + rectHeight*2;
    this.scalingFactor = {x: props.size.width/maxX<1?props.size.width/maxX:1,
      y: props.size.height/maxY<1?props.size.height/maxY:1};
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
    ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
    ctx.font = "italic 14pt Arial"

    //рисуем дуги
    for(let i = 0; i < this.links.length; i++) {
      ctx.beginPath();
      ctx.moveTo(this.scalingFactor.x * this.nodes[this.links[i].from].pos[0]+rectWidth/2, 
        this.scalingFactor.y * this.nodes[this.links[i].from].pos[1]+rectHeight/2);
      ctx.lineTo(this.scalingFactor.x * this.nodes[this.links[i].to].pos[0]+rectWidth/2, 
        this.scalingFactor.y * this.nodes[this.links[i].to].pos[1]+rectHeight/2);
      ctx.stroke();
    }
    
    //рисуем узлы
    for(let i = 0; i < this.nodes.length; i++) {
      ctx.fillStyle = this.nodes[i].color;
      ctx.fillRect(this.scalingFactor.x * this.nodes[i].pos[0], 
        this.scalingFactor.y * this.nodes[i].pos[1], 
        rectWidth, rectHeight);
      ctx.fillStyle = 'black';
      ctx.fillText(
        this.nodes[i].label, 
        this.scalingFactor.x * this.nodes[i].pos[0]+rectWidth/2-charWidth*this.nodes[i].label.length/2, 
        this.scalingFactor.y * this.nodes[i].pos[1]+rectHeight/2+charWidth/2);
    }
  }

  //Метод по координатам мыши определяет индекс
  //узла на которой наведена мышь
  getElementIndexByCoord(x:number, y:number) {
    let index = -1;
    for(let i = 0; i < this.nodes.length; i++) {
      if(x >= this.nodes[i].pos[0]*this.scalingFactor.x && 
        x <= this.nodes[i].pos[0]*this.scalingFactor.x+rectWidth && 
        y >= this.nodes[i].pos[1]*this.scalingFactor.y && 
        y<=this.nodes[i].pos[1]*this.scalingFactor.y+rectHeight) {
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
        delta: [event.nativeEvent.offsetX-this.nodes[nodeIndex].pos[0]*this.scalingFactor.x, 
          event.nativeEvent.offsetY-this.nodes[nodeIndex].pos[1]*this.scalingFactor.y], 
        nodeIndex:nodeIndex};
      //навешиваем обработчик на движение мыши
      //при движении мыши обновляем координаты узла
      (this.refs.canvas as any).onmousemove = (function(e:any) {
        let x = e.offsetX;
        let y = e.offsetY;
        this.nodes[this.nodeMove.nodeIndex].pos[0] = x/this.scalingFactor.x-this.nodeMove.delta[0];
        this.nodes[this.nodeMove.nodeIndex].pos[1] = y/this.scalingFactor.y-this.nodeMove.delta[1];
        //перерисовываем граф
        this.drawGraph();
      }).bind(this);
    }
  }

  render() {
    return (
      <canvas ref="canvas" width={this.props.size.width} height={this.props.size.height} onMouseDown={this.updateCanvas.bind(this)} 
        onMouseUp={event=> (event.nativeEvent.target as any).onmousemove = null}
        style={{border: "1px solid black"}}/>
    );
  }
}