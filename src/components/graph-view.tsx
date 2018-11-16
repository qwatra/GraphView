import * as React from "react";
import { GraphModel, Node, Link } from './graph-model'

interface Props {
  model: GraphModel;
  size: {width:number, height:number};
}

const charWidth = 10;

export class GraphView extends React.Component<Props, {}> {
  componentWillMount() { this.props.model.subscribe(this); }
  componentWillUnmount() { this.props.model.unsubscribe(this); }
  componentDidMount() { this.drawGraph(); }
  componentDidUpdate() { this.drawGraph(); }

  protected pervPos:Array<number> = null;

  //Отрисовка графа
  drawGraph() {
    let nodes:Array<Node> = this.props.model.getNodes();
    let links:Array<Link> = this.props.model.getLinks();
    let nodeSize = this.props.model.getNodeSize();

    const ctx = (this.refs.canvas as any).getContext('2d');
    ctx.font = "italic 14pt Arial"
    //очищаем холст
    ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
    
    //рисуем дуги
    for(let i = 0; links && i < links.length; i++) {
      ctx.beginPath();
      ctx.moveTo(nodes[links[i].from].pos[0]+nodeSize.width/2, nodes[links[i].from].pos[1]+nodeSize.height/2);
      ctx.lineTo(nodes[links[i].to].pos[0]+nodeSize.width/2, nodes[links[i].to].pos[1]+nodeSize.height/2);
      ctx.stroke();
    }
    
    //рисуем узлы
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2"
    for(let i = 0; nodes && i < nodes.length; i++) {
      
      if(nodes[i].selected) {
        console.log(1)
        ctx.beginPath();
        ctx.rect(nodes[i].pos[0], nodes[i].pos[1], nodeSize.width, nodeSize.height); //задает координаты прямиугольника
        ctx.stroke(); //рисует прямоугольник
        ctx.fillStyle = nodes[i].color;
        ctx.fill(); //заливает прямоугоьник
      } else {
        ctx.fillStyle = nodes[i].color;
        ctx.fillRect(nodes[i].pos[0], nodes[i].pos[1], nodeSize.width, nodeSize.height);
      }
      ctx.fillStyle = 'black';
      ctx.fillText(nodes[i].label, 
        nodes[i].pos[0]+nodeSize.width/2-charWidth*nodes[i].label.length/2, 
        nodes[i].pos[1]+nodeSize.height/2+charWidth/2);
    }
  }

  onMouseDownCanvas(event: React.MouseEvent<HTMLElement>) {
    this.pervPos = [event.nativeEvent.offsetX, event.nativeEvent.offsetY]
    if(this.props.model.setMarkNode(event.nativeEvent.offsetX, event.nativeEvent.offsetY)) {
      (this.refs.canvas as HTMLElement).onmousemove = 
        function(e:MouseEvent) {
          this.props.model.moveMarkNode(e.offsetX-this.pervPos[0], e.offsetY-this.pervPos[1]);
          this.pervPos = [e.offsetX, e.offsetY];
        }.bind(this);
    }
  }

  render() {
    return (
      <canvas ref="canvas" width={this.props.size.width} height={this.props.size.height} onMouseDown={this.onMouseDownCanvas.bind(this)} 
        onMouseUp={event=> (event.nativeEvent.target as HTMLElement).onmousemove = null}
        style={{border: "1px solid black"}}/>
    );
  }
}