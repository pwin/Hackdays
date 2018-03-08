###Golspie:  The Scottish Government Environmental Impact dataset

The Scottish Government publishes half-hourly and daily utility consumption data using an [RDF triplestore](http://cofog01.data.scotland.gov.uk).  This data is accessible via a SPARQL endpoint.  One of the potential uses of this data is to promote behavioural  change.  In this exercise we will explore the querying of this dataset using SPARQL to provide a suitable set of data points which we will then plot using the D3 library.

Examine the following query and try it out in the [http://cofog01.data.scotland.gov.uk/sparql](http://cofog01.data.scotland.gov.uk/sparql) endpoint:

```
prefix xsd: <http://www.w3.org/2001/XMLSchema#>
prefix gol: <http://cofog01.data.scotland.gov.uk/def/golspie/>
prefix qb: <http://purl.org/linked-data/cube#>
prefix buildingCode: <http://cofog01.data.scotland.gov.uk/id/facility/>
prefix fn: <http://www.w3.org/2005/xpath-functions#>
prefix util: <http://cofog01.data.scotland.gov.uk/def/golspie/>
prefix skos: <http://www.w3.org/2004/02/skos/core#>
prefix afn: <http://jena.hpl.hp.com/ARQ/function#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
 
select ?buildingName ?dt (max(?o) as ?val ) 
where {

?slice gol:refBuilding ?b ;
gol:reportDateTime ?dt ;
qb:sliceStructure gol:sliceByDay;
qb:observation ?obs .

?b rdfs:label ?buildingName . 

?obs gol:utilityConsumption ?o ;
8gol:refUtility util:electricity .
 
filter (xsd:dateTime(?dt) >= '2018-01-10T00:00:00Z'^^xsd:dateTime &&
xsd:dateTime(?dt) < afn:now())
}
group by ?buildingName ?dt
order by ?dt
limit 20000 
```

To use this SPARQL query in a GET request to the endpoint it needs to be encoded (read the [introduction]())

So, how do we get the data returned from the SPARQL query into a form that can be used with a visualisation library such as D3?  We can use the built-in D3 XHR request
```javascript
    d3.json(url3, function(error, json) {}
```

Read through the following code and use it in a web page

```javascript
var data; // a global

var url3 = "http://cofog01.data.scotland.gov.uk/spared/endpoint.php?query=prefix%20xsd%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0Aprefix%20gol%3A%20%3Chttp%3A%2F%2Fcofog01.data.scotland.gov.uk%2Fdef%2Fgolspie%2F%3E%0Aprefix%20qb%3A%20%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23%3E%0Aprefix%20buildingCode%3A%20%3Chttp%3A%2F%2Fcofog01.data.scotland.gov.uk%2Fid%2Ffacility%2F%3E%0Aprefix%20fn%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2005%2Fxpath-functions%23%3E%0Aprefix%20util%3A%20%3Chttp%3A%2F%2Fcofog01.data.scotland.gov.uk%2Fdef%2Fgolspie%2F%3E%0Aprefix%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0APREFIX%20afn%3A%20%3Chttp%3A%2F%2Fjena.hpl.hp.com%2FARQ%2Ffunction%23%3E%0Aprefix%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0A%20%0Aselect%20%3FbuildingName%20%3Fdt%20(max(%3Fo)%20as%20%3Fval%20)%20%0A%20%0Awhere%20%7B%0A%20%0A%3Fslice%20gol%3ArefBuilding%20%3Fb%20%3B%0Agol%3AreportDateTime%20%3Fdt%20%3B%0Aqb%3AsliceStructure%20gol%3AsliceByDay%3B%0Aqb%3Aobservation%20%3Fobs%20.%0A%0A%3Fb%20rdfs%3Alabel%20%3FbuildingName%20.%20%0A%3Fobs%20gol%3AutilityConsumption%20%3Fo%20%3B%0Agol%3ArefUtility%20util%3Aelectricity%20.%0A%20%0Afilter%20(xsd%3AdateTime(%3Fdt)%20%3E%3D%20%272018-01-10T00%3A00%3A00Z%27%5E%5Exsd%3AdateTime%20%26%26%0Axsd%3AdateTime(%3Fdt)%20%3C%20afn%3Anow())%0A%7D%0Agroup%20by%20%3FbuildingName%20%3Fdt%0Aorder%20by%20%3Fdt%0A%20%0Alimit%2020000%20";

d3.json(url3, function(error, json) {
  if (error) return console.warn(error);
  data = json;
  var u = uniq(data.results, "buildingName");
  var out = []
  for (i in u) {
      var r = getInfo(data.results, u[i]);

      var rsum = 0.0;
      var counter = 0;
      _.each(r[u[i]], function(x){rsum += parseFloat(x.utilVal); counter += 1})
var avg = rsum/counter;


out.push({'title':u[i], 'subtitle':'', 'ranges':[18000], 'measures':[parseInt(avg)], 'markers':[parseInt(avg)]}); 
  }
  alert(JSON.stringify(out));
plot(out);
});


function getInfo(data, bldg){
var retVal = []
for (var i = 0; i < data.bindings.length; i++) {
    if(data.bindings[i].buildingName.value == bldg){
        retVal.push({'date':data.bindings[i].dt.value, 'utilVal':data.bindings[i].val.value});
    }
}
var rv = {}
rv[bldg]= retVal
return rv
};


function uniq(data, param) {
    var arr=[''];
    var j = 0;
for (var i = 0; i < data.bindings.length; i++) {
  if($.inArray(data.bindings[i][param].value,arr)<0){
      arr[j]=data.bindings[i][param].value;
      j++;
  }
}
return arr;
}


//////////////////////////////////


var margin = {top: 5, right: 40, bottom: 20, left: 120},
    width = 960 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

var chart = d3.bullet()
    .width(width)
    .height(height);

function plot(data) {
  var svg = d3.select("body").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "bullet")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  var title = svg.append("g")
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + height / 2 + ")");

  title.append("text")
      .attr("class", "title")
      .text(function(d) { return d.title; });

  title.append("text")
      .attr("class", "subtitle")
      .attr("dy", "1em")
      .text(function(d) { return d.subtitle; });

};

```
 using the following skeleton HTML page

 ```html
    <!DOCTYPE html>
    <html>
    <head>
    <title>GOLSPIE Example</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <style type="text/css">

    body {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      margin: auto;
      padding-top: 40px;
      position: relative;
      width: 960px;
    }
    .bullet { font: 10px sans-serif; }
    .bullet .marker { stroke: #000; stroke-width: 2px; }
    .bullet .tick line { stroke: #666; stroke-width: .5px; }
    .bullet .range.s0 { fill: #eee; }
    .bullet .range.s1 { fill: #ddd; }
    .bullet .range.s2 { fill: #ccc; }
    .bullet .measure.s0 { fill: LightSteelBlue; }
    .bullet .measure.s1 { fill: SteelBlue; }
    .bullet .measure.s1 { fill: Teal; }
    .bullet .title { font-size: 14px; font-weight: bold; }
    .bullet .subtitle { fill: #999; }
    </style>

    <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/json3/3.3.0/json3.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script type="text/javascript" src="http://bl.ocks.org/mbostock/raw/4061961/3b1a3d3505d4a4d87555e12d9f223834bb6c7c09/bullet.js"></script>

    <script>
    //// insert your script here

    </script>
    </head>
    <body>
    </body>
    </html>
 ```

 This is clearly 'work in progress', so you can certainly improve it.   Check out the documentation for the [D3 Bullet Chart](http://bl.ocks.org/mbostock/4061961) for more information.  

 ####Next Steps
 Take the use case of stimulating behaviour change to reduce utility use.  How can you present this data effectively?  Use D3 or any other javascript library.
