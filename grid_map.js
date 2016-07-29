'use strict';

$(function() {
	queue()
		.defer(d3.csv, "grids_values_export_no0.csv")
      //  .defer(d3.json,"zipcode_business.geojson")
	//	.defer(d3.json, "grids.geojson")
    .await(dataDidLoad);
})
var groupToWords = {
"1":"Low Income, Low Intensity",
"2":"Low Income, Medium Intensity",
"3":"Low Income, High Intensity",
"4":"Medium Income, Low Intensity",
"5":"Medium Income, Medium Intensity",
"6":"Medium Income, High Intensity",
"7":"High Income, Low Intensity",
"8":"High Income, Medium Intensity",
"9":"High Income, High Intensity"
}

var colors = {
"1":"#fff7bc",
"2":"#fee391",
"3":"#fec44f",
"4":"#fee0d2",
"5":"#fc9272",
"6":"#de2d26",
"7":"#deebf7",
"8":"#9ecae1",
"9":"#3182bd",
}
var center = cityCentroids["Chicago"]
var populationChart = dc.barChart("#population")
var incomeChart = dc.barChart("#income")
var busDivChart = dc.barChart("#business_diversity")
var devIntChart = dc.rowChart("#development_intensity")
var ligAveChart = dc.barChart("#light_average")
var placesChart = dc.barChart("#places")

var __map = null
var  __canvas = null
var __gridData = null

var originalZoom = 9
var maxZoom = 14
var minZoom  = 8
var currentZoom = null

var currentCenter = center
var colorByLight = true
var radius = 1

var alpha = 1
var alphaScale = d3.scale.linear().domain([minZoom,maxZoom]).range([0.6,.03])
function dataDidLoad(error,grid) {
    charts(grid)
    d3.select("#loader").remove()
//initCanvas(grid)
   
}
function project(d) {
    return __map.project(getLL(d));
}
function getLL(d) {
      return new mapboxgl.LngLat(+d.lng, +d.lat)
}

function zoom() {    
    var canvas = __canvas
    
    canvas.save();
    canvas.clearRect(0, 0,1200,1200);
        
    //    canvas.translate(d3.event.translate[0], d3.event.translate[1]);
    //    canvas.scale(d3.event.scale, d3.event.scale);
    //    currentZoom = originalZoom*d3.event.scale
    // //   draw();
    //    
    //
    //    var fillColor = "#000"
    //    var lightScale = d3.scale.linear().domain([0,200,400]).range(["#3182bd","#fee391","#fc9272"])
    //    var i = -1, n = __gridData.length, d;
    //    
    //    while (++i < n) {
    //        __canvas.beginPath();
    //      d = __gridData[i];
    //      
    //      var light = d.averlight
          radius = radius*d3.event.scale
    //       fillColor = lightScale(light)
    //      __canvas.moveTo(project(d).x,project(d).y);
    //      __canvas.rect(project(d).x,project(d).y,radius,radius)
    //      __canvas.fillStyle = fillColor
    //         __canvas.globalAlpha=1.0/d3.event.scale
    //
    //      __canvas.fill();
    //    }
    //    
  initCanvas(__gridData)  
}

function initCanvas(data){
    __gridData = data
    //draws map tile if map is null
    if(__map == null){
        mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ';
        __map = new mapboxgl.Map({
            container: "map", // container id
            style: 'mapbox://styles/jjjiia123/cipn0g53q0004bmnd1rzl152g', //stylesheet location
            center: currentCenter, // starting position
            zoom: originalZoom,// starting zoom
            maxZoom:maxZoom,
            minZoom:minZoom
        });
        __map.scrollZoom.disable()
        __map.addControl(new mapboxgl.Navigation({position:"top-left"}));
       // __map.addControl(new mapboxgl.Geocoder());
        
    }
    
    var map = __map
    
    var container = map.getCanvasContainer()
    var canvas = d3.select(container).append("canvas").attr("class","datalayer")
        .attr("width",1200)
        .attr("height",  1200)
        .node().getContext("2d");
     __canvas = canvas
    
    function getD3() {
          var bbox = document.body.getBoundingClientRect();
          var center = map.getCenter();
          var zoom = map.getZoom();
          // 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
          var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);

          var d3projection = d3.geo.mercator()
            .center([center.lng, center.lat])
            .translate([bbox.width/2, bbox.height/2])
            .scale(scale);
            
          return d3projection;
    }
    
    var d3Projection = getD3()
    
    function render(){
        var fillColor = "red"
        var lightScale = d3.scale.linear().domain([0,200,400]).range(["#3182bd","#fee391","#fc9272"])
        var i = -1, n = data.length, d;    
        canvas.clearRect(0,0,1200,1200)
        
        // if zoom 9 = radius 1
       // var zoomRadiusScale = d3.scale.linear().domain([8,13]).range([1,30])
        var zoomRadiusScale ={
            8:1,
            9:1,
            10:4,
            11:10,
            12:17,
            13:35,
            14:68
        }
      //  var scale = (512) * 0.5 / Math.PI * Math.pow(2, map.getZoom());
      var radius = zoomRadiusScale[map.getZoom()]
    
    console.log(map.getZoom())
    
        var zoomAlphaScale = d3.scale.linear().domain([8,14]).range([.8,.2])
        alpha = zoomAlphaScale(map.getZoom())
        while (++i < n) {
           canvas.beginPath();
             d = data[i];
             var coordinates = {lat:d.lat,lng:d.lng}
             var light = d.averlight
              fillColor = lightScale(light)
             canvas.moveTo(project(d).x,project(d).y);
             canvas.rect(project(d).x,project(d).y,radius,radius)
         //    canvas.rect(d3Projection([coordinates.lng,coordinates.lat])[0],d3Projection([coordinates.lng,coordinates.lat])[1],radius,radius)
             //console.log(coordinates)
             //console.log(d3Projection([coordinates.lng,coordinates.lat]))
             canvas.fillStyle = fillColor
             canvas.globalAlpha=alpha
             canvas.fill();
       }         
    }
    render()
    
    map.on("viewreset",function(){
        console.log("viewreset")
        render()
    })
    map.on("move", function() {
           render()
        console.log("move")
        
         })
}

function charts(data){
    data.forEach(function(d){
        d.lng = +d.lng
        d.lat = +d.lat
        d.id = +d.id
        d.population = +d.population
        d.averlight = +d.averlight
        d.places = +d.places
        d.b_diversity = +d.b_diversity
        d.dev_intensity = +d.dev_intensity//groups
        d.income = +d.income
    })
    var chartWidth = 400
    
    var ndx = crossfilter(data)
    var all = ndx.groupAll()
               
    var busDivDimension = ndx.dimension(function(d){
       // console.log(parseFloat(parseInt(d.b_diversity*100))/100)
        return parseFloat(parseInt(d.b_diversity*100))/100})
    var busDivGroup = busDivDimension.group()
    
    var populationDimension = ndx.dimension(function(d){return parseInt(d.population)})
    var pGroup = populationDimension.group()

    var incomeDimension = ndx.dimension(function(d){
       // console.log(parseInt(parseFloat(d.income)/1000)*1000)
        return parseInt(parseFloat(d.income)/1000)*1000})
    var iGroup = incomeDimension.group()
    
    var ligAveDimension = ndx.dimension(function(d){return parseInt(d.averlight)})
    var laGroup = ligAveDimension.group()
    
    var devIntDimension = ndx.dimension(function(d){return d.dev_intensity})
    var devIntGroup = devIntDimension.group()
    
    var placesDimension = ndx.dimension(function(d){return d.places})
    var placesGroup = placesDimension.group()

        var chartHeight = 80
    busDivChart.width(chartWidth).height(chartHeight)
        .group(busDivGroup).dimension(busDivDimension)        
        .ordinalColors(["#aaaaaa"])
        .margins({top: 0, left: 50, right: 10, bottom: 20})
        .x(d3.scale.linear().domain([0, 5]))
    
        busDivChart.yAxis().ticks(2)
        busDivChart.xAxis().ticks(4)
    
    placesChart.width(chartWidth).height(chartHeight)
        .group(placesGroup).dimension(placesDimension)        
        .elasticY(true)
        .ordinalColors(["#aaaaaa"])
          .gap(0)
        .margins({top: 0, left: 50, right: 10, bottom: 20})
        
        .x(d3.scale.linear().domain([0, 20]))
         placesChart.yAxis().ticks(2)

        var chartColors = {"1":"#fff7bc","2":"#fee391","3":"#fec44f","4":"#fee0d2","5":"#fc9272","6":"#de2d26","7":"#deebf7","8":"#9ecae1","9":"#3182bd"}
    devIntChart.width(chartWidth).height(chartHeight)
        .group(devIntGroup).dimension(devIntDimension)
        .ordinalColors(["#888","#888","#888"])      
        .margins({top: 0, left: 50, right: 10, bottom: 20})
		.labelOffsetX(-35)
        .xAxis().ticks(4)

    ligAveChart.width(chartWidth).height(chartHeight)
        .group(laGroup).dimension(ligAveDimension).centerBar(true)
        .elasticY(true)
        .colors(d3.scale.linear().domain([0,200,400]).range(["#3182bd","#fee391","#fc9272"]))
        .colorAccessor(function(d){return d.key })
        .margins({top: 0, left: 50, right: 10, bottom: 20})
        .x(d3.scale.linear().domain([0, 500]))
        .yAxis().ticks(3)

    populationChart.width(chartWidth).height(chartHeight).group(pGroup).dimension(populationDimension)
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .elasticY(true)
        .elasticX(true)
        .ordinalColors(["#ffffff"])
        .x(d3.scale.linear().domain([0, 30]))
        .margins({top: 0, left: 50, right: 10, bottom: 20})
        .yAxis().ticks(2)
    populationChart.xAxis().ticks(4)
    
    incomeChart.width(chartWidth).height(chartHeight).group(iGroup).dimension(incomeDimension)
        .round(dc.round.floor)    
        .ordinalColors(["#ffffff"])
        .alwaysUseRounding(true)
        .elasticY(true)
        .elasticX(true)
        .margins({top: 0, left: 50, right: 10, bottom: 20})
        .on('renderlet', function(d) {
                var newData = incomeDimension.top(Infinity)
                //reDrawMap(newData)
           // d3.select("#map .datalayer").remove()
            console.log("render canvas")
            var canvas = __canvas
           
            initCanvas(newData)
        })
        .x(d3.scale.linear().domain([1,250000]))
        .yAxis().ticks(function(d){
            return 3
        })
        incomeChart.yAxis().ticks(3)
        incomeChart.xAxis().ticks(4)
        
    dc.dataCount(".dc-data-count")
        .dimension(ndx)
        .group(all)
        // (optional) html, for setting different html for some records and all records.
        // .html replaces everything in the anchor with the html given using the following function.
        // %filter-count and %total-count are replaced with the values obtained.
        .html({
            some:"%filter-count areas out of %total-count fit the selection criteria | <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset All</a>",
            all:"Total %total-count areas."
        })
       // initCanvas(data)
        dc.renderAll();
    	d3.select("#loader").transition().duration(600).style("opacity",0).remove();
}

