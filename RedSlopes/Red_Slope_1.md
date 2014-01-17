###Introduction to D3

[D3](http://d3js.org/), short for Data-Driven Documents, is a javascript library directed at creating tables and visualisations.  It is used significantly in [http://www.opendatascotland.org](http://www.opendatascotland.org) and is described in the ['schools'](http://schools.opendatascotland.org/dthree) section of the site.

The Red Slope introduction to D3 is to follow the 'school' example in the link above.  The only change is that as the www.opendatascotland.org is [CORS-enabled](http://enable-cors.org/) (something that you can discover from the headers - in IE>=9 you can use F12 to see this information, Firefox and Chrome have add-ons to see returned header information) and so you can complete the exercise without a web server or a proxy provided you have a modern browser, but you have to give the full path name to the data sources.  So, the variable 'mapjson' and the data file  'schools.csv' should be entered as follows:
```javascript
    var mapjson = "http://schools.opendatascotland.org/tutorial/S12000040_topo.json";
```

```javascript
    queue()
        .defer(d3.json, mapjson)
        .defer(d3.csv, "http://schools.opendatascotland.org/tutorial/schools.csv")
        .await(ready);
```

Once you've make some progress with this study try using SPARQL (the linked data query language) to create the schools csv data.  This is detailed in the [next example](http://schools.opendatascotland.org/sparql) on the opendatascotland site. 


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

Next to import some data.  

