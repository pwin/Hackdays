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


