function process_graph(_id, _data, _width, _height, _distance, _charge){

	var DEF_ID     = 'graph';
	var DEF_WIDTH  = 400;
	var DEF_HEIGHT = 400;
	var DEF_DISTANCE = 80;
	var DEV_CHARGE = -800;

	var id      = _id === undefined ? DEF_ID : _id;
	var width   = _width === undefined ? DEF_WIDTH : _width;
	var height  = _height === undefined ? DEF_HEIGHT : _height;
	var distance = _distance === undefined ? DEF_DISTANCE : _distance;
	var charge  = _charge === undefined ? DEV_CHARGE : _charge;
	var nodes   = {};
	var links_data = [];
	var linktypes = [];

	var vbox_x = 0;
	var vbox_y = 0;
	var vbox_default_width = vbox_width = width;
	var vbox_default_height = vbox_height = height;

	var linknum = 0;
	var linktypenum = 0;
	_data.forEach(function(link) {
		links_data[linknum] = {};
		links_data[linknum].source = nodes[link.source] || (nodes[link.source] = {name: link.source});
		links_data[linknum].target = nodes[link.target] || (nodes[link.target] = {name: link.target});
		links_data[linknum].type = link.type === undefined ? 'none' : link.type;
		if( !(link.target_type === undefined) ){
			nodes[link.target].type = link.target_type;
		}
		if( !(link.source_type === undefined) ){
			nodes[link.source].type = link.source_type;
		}
		if( !(link.type === undefined) ){
			if($.inArray(link.type, linktypes) == -1){
				linktypes[linktypenum] = link.type;
				linktypenum++;
			}
		}
		linknum++;
	});

	var force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links_data)
	    .size([width, height])
	    .linkDistance(distance)
	    .charge(charge)
	    .friction(0.8)
	    .on("tick", tick)
	    .start();

	var svg = d3.select(id).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("viewBox", "" + vbox_x + " " + vbox_y + " " + vbox_width + " " + vbox_height);

	// Per-type markers, as they don't inherit styles.
	svg.append("defs").selectAll("marker")
		.data(linktypes)
		.enter().append("marker")
			.attr("id", function(d) { return d; })
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 22)
			.attr("refY", -0.47)
			.attr("markerWidth", 8)
			.attr("markerHeight", 8)
			.attr("markerUnits", 0.1)
			.attr("orient", "auto")
			.attr("class", function(d){ return "allow_" + d; })
		.append("path")
			.attr("d", "M0,-3L10,0L0,5");

	var path = svg.append("g").selectAll("path")
		.data(force.links())
		.enter().append("path")
			.attr("fill","none")
			.attr("stroke","black")
			.attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
			.attr("class", function(d) {
				return "link " + " link_" + d.type;
			});


	var circle = svg.append("g").selectAll("circle")
	.data(force.nodes())
	.enter()
	.append("circle")
		.call(force.drag)
		.attr("r", 10)
		.attr("id", function(d) { return "nid_" + d.name;})
		.attr("class", function(d){
			var tmp = "node";
			if(!(d.type === undefined)){
				tmp += " node_" + d.type;
			} 
			return tmp; 
		});

	var text = svg.append("g").selectAll("text")
		.data(force.nodes())
		.enter()
		.append("text")
			.text(function(d) { return d.name; })
			.attr("x", 11)
			.attr("y", ".31em")
			.attr("class",function(d){
				var tmp = "node_label";
				if(!(d.type === undefined)){
					tmp += " node_label_" + d.type;
				} 
				return tmp; 
			});

	// Use elliptical arc path segments to doubly-encode directionality.
	function tick() {
		path.attr("d", linkArc);
		circle.attr("transform", transform);
		text.attr("transform", transform);
	}

	function linkArc(d) {
		var dx = d.target.x - d.source.x,
		dy = d.target.y - d.source.y,
		dr = Math.sqrt(dx * dx + dy * dy) * 1.8;
		return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	}

	function transform(d) {
		return "translate(" + d.x + "," + d.y + ")";
	}

	drag = d3.behavior.drag().on("drag", function(d) {
		vbox_x -= d3.event.dx;
		vbox_y -= d3.event.dy;
		return svg.attr("translate", "" + vbox_x + " " + vbox_y); //基点の調整。svgタグのtranslate属性を更新
	});
	svg.call(drag);
	
	zoom = d3.behavior.zoom().on("zoom", function(d) {
		var befere_vbox_width, before_vbox_height, d_x, d_y;
		befere_vbox_width = vbox_width;
		before_vbox_height = vbox_height;
		vbox_width = vbox_default_width * d3.event.scale;
		vbox_height = vbox_default_height * d3.event.scale;
		d_x = (befere_vbox_width - vbox_width) / 2;
		d_y = (before_vbox_height - vbox_height) / 2;
		vbox_x += d_x;
		vbox_y += d_y;
		return svg.attr("viewBox", "" + vbox_x + " " + vbox_y + " " + vbox_width + " " + vbox_height);  //svgタグのviewBox属性を更新
	});
	svg.call(zoom);

}

function show_svg_code(id_graph, id_code)
{
	// Get the d3js SVG element
	var tmp  = document.getElementById(id_graph);
	var svg = tmp.getElementsByTagName("svg")[0];

	// Extract the data as SVG text string
	var svg_xml = (new XMLSerializer).serializeToString(svg);

	// Set the content of the <pre> element with the XML
	$(id_code).text(svg_xml);

}

function delete_graph(id)
{
	d3.select(id).select("svg").remove();
}
