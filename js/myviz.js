var MYGRAPH_DEF_ID = '#graph';
var MYGRAPH_DEF_WIDTH = 300;
var MYGRAPH_DEF_HEIGHT = 300;

var __mygraphInherits = function(childCtor, parentCtor) {
  // 子クラスの prototype のプロトタイプとして 親クラスの
  // prototype を指定することで継承が実現される
  Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};

var MyGraph = function MyGraph(id, width, height){
	this.id = id === undefined ? MYGRAPH_DEF_ID : id;
	this.width = width === undefined ? MYGRAPH_DEF_WIDTH : width;
	this.height = height === undefined ? MYGRAPH_DEF_HEIGHT : height;
	return this;
}

MyGraph.prototype.attr = function(key, value){
	if(key=="id"){
		this.id = value === undefined ? MYGRAPH_DEF_ID : value;
	}
	if(key=="width"){
		this.width = value === undefined ? MYGRAPH_DEF_WIDTH : value;
	}
	if(key=="height"){
		this.height = value === undefined ? MYGRAPH_DEF_HEIGHT : value;
	}
	return this;
}

MyGraph.prototype.config = function(config){
	for(var key in config){
		this.attr(key, config[key]);
	}
	return this;
}

MyGraph.prototype.draw = function(){
	this.svg = d3.select(this.id).append("svg")
    	.attr("width", this.width)
    	.attr("height", this.height);	
}

var ProcessGraph = function ProcessGraph(id, width, height) {
  MyGraph.call(this, id, width, height);
  return this;
};

function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

inherits(ProcessGraph, MyGraph);

//var MyGraph = new MyGraph();
//var ProcessGraph = new ProcessGraph();




