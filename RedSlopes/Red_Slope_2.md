###Maps

In the above example the polygons representing the boundaries of local authority areas are simple join-the-dots polygons.  In this next Red Slope real map data will be introduced and will be used as the substrate on which to represent data that includes geographic reference co-ordinates of latitude and longitude.  There are several sources of map tiles including Ordnance Survey, Open Street Map, Google and Bing (Microsoft) and also numerous ArcGIS servers.

One javascript library that makes working with map tiles reasonably straightforeward is [Leaflet](http://leafletjs.com/).  Another is [OpenLayers](http://openlayers.org/) - see also the [OpenLayers v3](http://ol3js.org/) site.

Start off with Leaflet.  Create the following HTML file, save it and look at it in your browser.

```html
    <html>
    <head>
    <title>Leaflet Example</title>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.js?2"></script>
    <script type='text/javascript'>

    function init()
    {
        var map = new L.Map ("map1");

        var attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

        var layerOSM = new L.TileLayer
            ("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                { attribution: attrib } );
                
        map.addLayer(layerOSM);

        map.setView(new L.LatLng(55.84,-4.32), 12);
    }
    </script>
    </head>
    <body onload="init()">
    <h1>Leaflet Test</h1>
    <div id="map1" style="width:1000px; height:700px"> </div>
    </body>
    </html>
```

Note that the view is initially set to a latitude and longitude and a zoom level (in this case it's 12)

```javascript
    map.setView(new L.LatLng(55.84,-4.32), 12);
```
So one easy experiment to start with is to change these values and refresh your browser to see how the view changes. Use [this site](http://www.informationfreeway.org/) to find latitude and longitude data (bottom left).

Next to import some data.   [http://labs.data.scotland.gov.uk/gcc/index.php](http://labs.data.scotland.gov.uk/gcc/index.php) has some data on road accidents collected as the STATS19 dataset and taken from the [Glasgow Future Cities data repository](http://data.glasgow.gov.uk) from which you can find more information.  The data includes Long and Lat data.  These csv files are hosted on a CORS-enabled web server and so are accessible using native XMLHttpRequest or XDomainRequest calls.  See the [testCORS.html](https://github.com/pwin/Hackdays/blob/master/RedSlopes/testCORS.html) file for illustrations.


The following code requests the acc-glw-2012.csv file and, if successful, calls a function ```show()``` and otherwise returns an alert containing the error message/s.

```javascript
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: "http://labs.data.scotland.gov.uk/gcc/acc-glw-2012.csv",
            dataType: "text",
            success : function(data) {show(data);},
            error: function(xhr, ajaxOptions, thrownError) {
                alert("Status: " + xhr.status + "     Error: " + thrownError);
            }
         });
    });
```


The function ```show()``` parses the file, isolating the fields for Latitude and Longitude, and adding these to the map.

```javascript
    function show(csv){
        var dataset = csvJSON(csv);
        initMap(55.84,-4.28, 13)
        $.each(dataset, function(key, value) {
        var m  = new L.marker([value['Latitude'],value['Longitude']])
        m.addTo(map);

    });
    }
```

The helper function ```csvJSON()``` does what it says on the can.  It splits lines using the return + newline pattern (Windows).  You might think of recoding to cover Unix or other line terminator patterns. If you don't know about this just do some Googling.

```javascript
    //var csv is the CSV file with headers
    //https://gist.github.com/iwek/7154578
    function csvJSON(csv){ 
    var lines=csv.split("\r\n");

    var result = [];
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");

    for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
    }
    result.push(obj);
    }
    return result
    }
```

Now to bring all these together we need to change the initialisation function from ```init()``` as in the first block of code to the ```initMap()``` function that is called by ```show()``` [read the code...]

```javascript
    function initMap(latd, longd, zoom)
    {
        map = new L.Map ("map1");

        var attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

        var layerOSM = new L.TileLayer
            ("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                { attribution: attrib } );
                
        map.addLayer(layerOSM);

        map.setView(new L.LatLng(latd, longd), zoom);

    }
```

and in order to make this work completely we need to bring the ```map``` variable into global scope.  To do this you declare the variable outside of a function - ideally at the start of the script block.

```javascript
    var map;
```

####Next Steps A
There are other providers of map tiles, e.g. Ordnance Survey.  Take a look at the [OS 'OpenSpace' examples](http://www.ordnancesurvey.co.uk/business-and-government/products/os-openspace/api/code-playground.html) and re-work the road accidents example to use this.  As the dataset includes both Lat & Long and Easting/Northing coordinates try creating maps using each apporach to location.  Note that you will have to register with Ordnance Survey to get an API key, and also you need to ensure that the projection is appropriate. [ the  UK OS projection is EPSG:27700, the OpenStreetMap default projection is WGS84 (EPSG 4326) but OpenStreetMap and Google Maps also use the Mercator projection - EPSG:3857]

####Next Steps B
Find other data sets with Longitude/Latitude or OS UK National Grid coordinates and make some more maps.  Some data sources include the SPARQL endpoints of [DBPedia](http://dbpedia.org/sparql) or [SEPA](http://data.sepa.org.uk).  Try some SPARQL queries that link SEPA and DBPedia data

