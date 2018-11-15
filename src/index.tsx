import * as React from "react";
import * as ReactDOM from "react-dom";

import { GraphModel, Link, Node } from "./components/graph-model";
import { GraphView } from "./components/graph-view";
const maxNodeSize = { width: 80, height: 50 };

const nodePalette = [
  '#3e442b',
  '#2d7dd2',
  '#97cc04',
  '#eeb902',
  '#f45d01',
  '#f28456',
  '#a55570',
  '#a98080',
  '#f2e9df',
  '#24040f'
];

const model = new GraphModel();

function generate() {
  const nodesNum = Math.round(10 + Math.random() * 30);
  const linksNum = Math.round(5 + Math.random() * 20);
  
  const nodes: Array<Node> = Array(nodesNum).fill(0).map((v, i) => {
    return {
      label: 'n' + i,
      pos: [
        Math.round(Math.random() * (512 - maxNodeSize.width)),
        Math.round(Math.random() * (256 - maxNodeSize.height))
      ],
      color: nodePalette[i % nodePalette.length]
    };
  });
  
  const links: Array<Link> = Array(linksNum).fill(0).map((v, i) => {
    return {
      from: Math.round( Math.random() * (nodesNum - 1) ),
      to: Math.round( Math.random() * (nodesNum - 1) )
    };
  });
  
  console.log(nodes, links)
  model.setNodesAndLinks(nodes, links);
}

const models = [ model ];
// 1. нужно добавить возможность выделять несколько узлов
//    ctrl + click по невыделенному узлу выделяет его
//    ctrl + click по выделенному узлу снимает выделение
//    click по невыделеному узлу делает выделенным только его, с остальных узлов выделение снимается
//    выделение нескольких узлов через прямоугольное выделение (click по пустой области, перетащили курсор, всё что попало в прямоугольник - выделяем)
// 2. вся логика должна находиься в GraphModel (выделение, поиск узла, смена координат узла, ...)
// 3. выделенные узлы должны как-то графически отличаться от невыделенных
// 4. избавиться от всех any, заменить их на соответствующие типы
// 5. при перетаскивании когда курсор уходит за пределы области канвы узлы должны липнуть к границам канвы
// 6. код этого файла должен работать следующим образом:
//   на странице должно отображаться ровно столько GraphView сколько моделей задано в массиве models
//   если одной модели соответсвтует несколько GraphView, то все изменения должны отражаться на всех связанных
//   при нажатии на кнопку generate все связанные с model GraphView должны обновиться и показать сгенерированные данные
// 7. задание так же должно работать если открыть index.html локально
ReactDOM.render(
    <div>
      <div>
        <button onClick={generate}>
          generate
        </button>
      </div>
        {models.map((model, i) => {
          return (
            <GraphView key={i} size={{width: 512, height: 256}} model={model}/>
          );
        })}
    </div >,
    document.getElementById("root")
);