/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/components/base-model.ts":
/*!**************************************!*\
  !*** ./src/components/base-model.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() { this.views = []; }
    subscribe(view) {
        this.views.push(view);
        view.forceUpdate();
    }
    unsubscribe(view) {
        this.views = this.views.filter((item) => item !== view);
    }
    updateViews() {
        this.views.forEach((view) => view.forceUpdate());
    }
}
exports.default = default_1;


/***/ }),

/***/ "./src/components/graph-model.ts":
/*!***************************************!*\
  !*** ./src/components/graph-model.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = __webpack_require__(/*! ./base-model */ "./src/components/base-model.ts");
class GraphModel extends base_model_1.default {
    constructor() {
        super(...arguments);
        this.nodeSize = { width: 40, height: 40 };
        this.moveFlag = false;
        this.selectArea = false;
        this.canvasSize = { width: 512, height: 256 };
    }
    //Метод по координатам мыши находит узел на который она наведена
    //если узлов несколько, то возвращается последний, т.к. он будет отрисовыватся последним
    getNodeIndexByCoord(x, y) {
        let node = -1;
        for (let i = 0; i < this.nodes.length; i++) {
            if (x >= this.nodes[i].pos[0] && x <= this.nodes[i].pos[0] + this.nodeSize.width &&
                y >= this.nodes[i].pos[1] && y <= this.nodes[i].pos[1] + this.nodeSize.height) {
                node = i;
            }
        }
        return node;
    }
    //проверяет на сколько можно сдвинуть узлы, чтобы не было выхода за границы
    testDelta(deltaX, deltaY) {
        var newdx = deltaX, newdy = deltaY;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].selected) {
                //правая граница
                if (this.copyPosForDaD[i][0] + deltaX + this.nodeSize.width > this.canvasSize.width) {
                    newdx = this.canvasSize.width - (this.copyPosForDaD[i][0] + this.nodeSize.width);
                    deltaX = newdx;
                }
                //левая граница
                if (this.copyPosForDaD[i][0] + deltaX < 0) {
                    newdx = -this.copyPosForDaD[i][0];
                    deltaX = newdx;
                }
                //верхняя граица
                if (this.copyPosForDaD[i][1] + deltaY < 0) {
                    newdy = -this.copyPosForDaD[i][1];
                    deltaY = newdy;
                }
                //нижняя граница
                if (this.copyPosForDaD[i][1] + deltaY + this.nodeSize.height > this.canvasSize.height) {
                    newdy = this.canvasSize.height - (this.copyPosForDaD[i][1] + this.nodeSize.width);
                    deltaY = newdy;
                }
            }
        }
        return { deltaX: newdx, deltaY: newdy };
    }
    moveMarkNode(newCursorPosX, newCursorPosY) {
        let delta = this.testDelta(newCursorPosX - this.cursorStartPos[0], newCursorPosY - this.cursorStartPos[1]);
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].selected) {
                this.nodes[i].pos = [this.copyPosForDaD[i][0] + delta.deltaX,
                    this.copyPosForDaD[i][1] + delta.deltaY];
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
    selectNodesByArea(endPosX, endPosY) {
        //получаем координаты верхней левой точки
        let cs = [
            this.cursorStartPos[0] < endPosX ? this.cursorStartPos[0] : endPosX,
            this.cursorStartPos[1] < endPosY ? this.cursorStartPos[1] : endPosY
        ];
        //получаем координаты нижней правой точки
        let ce = [
            this.cursorStartPos[0] > endPosX ? this.cursorStartPos[0] : endPosX,
            this.cursorStartPos[1] > endPosY ? this.cursorStartPos[1] : endPosY
        ];
        let w = this.nodeSize.width;
        let h = this.nodeSize.height;
        for (let i = 0; i < this.nodes.length; i++) {
            let p = this.nodes[i].pos;
            this.nodes[i].selected =
                p[0] > cs[0] && p[0] < ce[0] && p[1] > cs[1] && p[1] < ce[1] ||
                    p[0] + w > cs[0] && p[0] + w < ce[0] && p[1] > cs[1] && p[1] < ce[1] ||
                    p[0] > cs[0] && p[0] < ce[0] && p[1] + h > cs[1] && p[1] + h < ce[1] ||
                    p[0] + w > cs[0] && p[0] + w < ce[0] && p[1] + h > cs[1] && p[1] + h < ce[1];
        }
        this.updateViews();
    }
    //возвращает координаты выделеной облости
    //x,y,width,height
    getSelectionArea() {
        if (this.areaSize) {
            return this.cursorStartPos.concat(this.areaSize);
        }
        return null;
    }
    // должен вернуть массив всех связей узлов
    getLinks() {
        return this.links;
    }
    ;
    // должен возвращать массив всех узлов
    getNodes() {
        return this.nodes;
    }
    ;
    //Возвращает размер узлов
    getNodeSize() {
        return this.nodeSize;
    }
    //устанавливает размер узлов
    setNodeSize(size) {
        this.nodeSize = size;
        this.updateViews();
    }
    // при вызове контрол GraphView должен начать отображать переданные узлы и связи
    setNodesAndLinks(nodes, links) {
        this.nodes = nodes;
        this.links = links;
        this.updateViews();
    }
    ;
    onMouseDown(x, y, ctrlFlag) {
        this.cursorStartPos = [x, y];
        let indexNode = this.getNodeIndexByCoord(x, y);
        if (~indexNode) { // клик по узлу
            if (!this.nodes[indexNode].selected) { //узел не выделен
                if (ctrlFlag) { //выделяем узел
                    this.nodes[indexNode].selected = true;
                }
                else { // выделяем узел и снимаем выделение с других узлов
                    for (let i = 0; i < this.nodes.length; i++) {
                        this.nodes[i].selected = indexNode == i;
                    }
                }
            }
            else if (ctrlFlag) {
                this.nodes[indexNode].selected = false;
            }
        }
        else { //клик по пустой области
            this.selectArea = true;
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].selected = false;
            }
        }
    }
    onMouseUp(x, y, ctrlFlag) {
        let indexNode = this.getNodeIndexByCoord(x, y);
        //если выделено несколько элеметов и произошел клик на один из выделеных
        //то снимаем выделение с других
        if (~indexNode && !this.moveFlag && this.nodes[indexNode].selected && !ctrlFlag) { // MousePress
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].selected = indexNode == i;
            }
        }
        this.cursorStartPos = null;
        this.moveFlag = false;
        this.selectArea = false;
        this.areaSize = null;
        this.copyPosForDaD = null;
        this.updateViews();
    }
    onMouseMove(x, y) {
        if (!this.moveFlag) {
            this.copyPosForDaD = this.nodes.map(function (n) {
                return n.pos.slice();
            });
        }
        this.moveFlag = true;
        if (this.selectArea) {
            this.areaSize = [x - this.cursorStartPos[0], y - this.cursorStartPos[1]];
            this.selectNodesByArea(x, y);
        }
        else {
            this.moveMarkNode(x, y);
        }
    }
}
exports.GraphModel = GraphModel;


/***/ }),

/***/ "./src/components/graph-view.tsx":
/*!***************************************!*\
  !*** ./src/components/graph-view.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const charWidth = 10;
class GraphView extends React.Component {
    componentWillMount() { this.props.model.subscribe(this); }
    componentWillUnmount() { this.props.model.unsubscribe(this); }
    componentDidMount() { this.drawGraph(); }
    componentDidUpdate() { this.drawGraph(); }
    //Отрисовка графа
    drawGraph() {
        let nodes = this.props.model.getNodes();
        let links = this.props.model.getLinks();
        let nodeSize = this.props.model.getNodeSize();
        const ctx = this.refs.canvas.getContext('2d');
        ctx.font = "italic 14pt Arial";
        //очищаем холст
        ctx.clearRect(0, 0, this.props.size.width, this.props.size.height);
        //рисуем дуги
        for (let i = 0; links && i < links.length; i++) {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.moveTo(nodes[links[i].from].pos[0] + nodeSize.width / 2, nodes[links[i].from].pos[1] + nodeSize.height / 2);
            ctx.lineTo(nodes[links[i].to].pos[0] + nodeSize.width / 2, nodes[links[i].to].pos[1] + nodeSize.height / 2);
            ctx.stroke();
        }
        //рисуем узлы
        ctx.lineWidth = "2";
        for (let i = 0; nodes && i < nodes.length; i++) {
            if (nodes[i].selected) {
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.rect(nodes[i].pos[0], nodes[i].pos[1], nodeSize.width, nodeSize.height);
                ctx.stroke(); //рисует прямоугольник
                ctx.fillStyle = nodes[i].color;
                ctx.fill(); //заливает прямоугоьник
            }
            else {
                ctx.fillStyle = nodes[i].color;
                ctx.fillRect(nodes[i].pos[0], nodes[i].pos[1], nodeSize.width, nodeSize.height);
            }
            ctx.fillStyle = 'black';
            ctx.fillText(nodes[i].label, nodes[i].pos[0] + nodeSize.width / 2 - charWidth * nodes[i].label.length / 2, nodes[i].pos[1] + nodeSize.height / 2 + charWidth / 2);
        }
        //рисуем область выделения если она есть 
        let sa = this.props.model.getSelectionArea();
        if (sa) {
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.rect(...sa);
            ctx.stroke();
        }
    }
    onMouseDownCanvas(event) {
        this.props.model.onMouseDown(event.nativeEvent.offsetX, event.nativeEvent.offsetY, event.ctrlKey);
        this.refs.canvas.onmousemove =
            function (e) {
                this.props.model.onMouseMove(e.offsetX, e.offsetY);
            }.bind(this);
    }
    onMouseUpCanvas(event) {
        this.props.model.onMouseUp(event.nativeEvent.offsetX, event.nativeEvent.offsetY, event.ctrlKey);
        event.nativeEvent.target.onmousemove = null;
    }
    render() {
        return (React.createElement("canvas", { ref: "canvas", width: this.props.size.width, height: this.props.size.height, onMouseDown: this.onMouseDownCanvas.bind(this), onMouseUp: this.onMouseUpCanvas.bind(this), style: { border: "1px solid black" } }));
    }
}
exports.GraphView = GraphView;


/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const ReactDOM = __webpack_require__(/*! react-dom */ "react-dom");
const graph_model_1 = __webpack_require__(/*! ./components/graph-model */ "./src/components/graph-model.ts");
const graph_view_1 = __webpack_require__(/*! ./components/graph-view */ "./src/components/graph-view.tsx");
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
const model = new graph_model_1.GraphModel();
function generate() {
    const nodesNum = Math.round(10 + Math.random() * 30);
    const linksNum = Math.round(5 + Math.random() * 20);
    const nodes = Array(nodesNum).fill(0).map((v, i) => {
        return {
            label: 'n' + i,
            pos: [
                Math.round(Math.random() * (512 - maxNodeSize.width)),
                Math.round(Math.random() * (256 - maxNodeSize.height))
            ],
            color: nodePalette[i % nodePalette.length],
            selected: false
        };
    });
    const links = Array(linksNum).fill(0).map((v, i) => {
        return {
            from: Math.round(Math.random() * (nodesNum - 1)),
            to: Math.round(Math.random() * (nodesNum - 1))
        };
    });
    model.setNodesAndLinks(nodes, links);
}
const models = [model, model];
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
ReactDOM.render(React.createElement("div", null,
    React.createElement("div", null,
        React.createElement("button", { onClick: generate }, "generate")),
    models.map((model, i) => {
        return (React.createElement(graph_view_1.GraphView, { key: i, size: { width: 512, height: 256 }, model: model }));
    })), document.getElementById("root"));


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map