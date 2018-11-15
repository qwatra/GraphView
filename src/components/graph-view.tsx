import * as React from "react";
import { GraphModel, Node, Link } from './graph-model'

interface Props {
  model: GraphModel;
  size: {width:number, height:number};
}

const rectWidth = 40;
const rectHeight = 40;
const charWidth = 10;

export class GraphView extends React.Component<Props, {}> {
  componentWillMount() { this.props.model.subscribe(this); }
  componentWillUnmount() { this.props.model.unsubscribe(this); }
  componentDidMount() { this.drawGraph(); }
  componentDidUpdate() { this.drawGraph(); }

  //Отрисовка графа
  drawGraph() {
    let nodes:Array<Node> = this.props.model.getNodes();
    let links:Array<Link> = this.props.model.getLinks();

    const ctx = (this.refs.canvas as any).getContext('2d');
    ctx.font = "italic 14pt Arial"
    //очищаем холст
    ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
    
    //рисуем дуги
    for(let i = 0; links && i < links.length; i++) {
      ctx.beginPath();
      ctx.moveTo(nodes[links[i].from].pos[0]+rectWidth/2, nodes[links[i].from].pos[1]+rectHeight/2);
      ctx.lineTo(nodes[links[i].to].pos[0]+rectWidth/2, nodes[links[i].to].pos[1]+rectHeight/2);
      ctx.stroke();
    }
    
    //рисуем узлы
    for(let i = 0; nodes && i < nodes.length; i++) {
      ctx.fillStyle = nodes[i].color;
      ctx.fillRect(nodes[i].pos[0], nodes[i].pos[1], rectWidth, rectHeight);
      ctx.fillStyle = 'black';
      ctx.fillText(nodes[i].label, 
        nodes[i].pos[0]+rectWidth/2-charWidth*nodes[i].label.length/2, 
        nodes[i].pos[1]+rectHeight/2+charWidth/2);
    }
  }

  onMouseDownCanvas(event: React.MouseEvent<HTMLElement>) {
    //markNode - пытатся найти элемент по координа там и выделить в случае успеха возвращает true
    /*if(this.props.model.markNode(event.nativeEvent.offsetX, event.nativeEvent.offsetY)) {
      (this.refs.canvas as HTMLElement).onmousemove = (function(e:MouseEvent) {
        this.model.setCoordMarkNode(e.offsetX, e.offsetY);
      }).bind(this);
    }*/
  }

  render() {
    return (
      <canvas ref="canvas" width={this.props.size.width} height={this.props.size.height} onMouseDown={this.onMouseDownCanvas.bind(this)} 
        onMouseUp={event=> (event.nativeEvent.target as HTMLElement).onmousemove = null}
        style={{border: "1px solid black"}}/>
    );
  }
}