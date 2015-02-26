###Google Visualisation Toolkit

Google provide several really excellent [data visualisation libraries](https://developers.google.com/chart/interactive/docs/gadgetgallery) and in this exercise we will explore using the [annotation chart](https://developers.google.com/chart/interactive/docs/gallery/annotationchart) together with some data from the [NOMIS API](http://www.nomisweb.co.uk).

First the data:  [http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/GEOGRAPHY/2092957698TYPE464.def.sdmx.json](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/GEOGRAPHY/2092957698TYPE464.def.sdmx.json) provides the codes for the towns and cities in the NOMIS datasets.  From this we can pick out that Glasgow City is ```1946157420```.  This code can be used to construct a URL for the NOMIS API to retrieve the JSA Claimant count for Glasgow for males, females and total for the period January 1992 to the latest figures, and return the data in JSON.

```
http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/1946157420/item/1/measures/20203.data.JSON?sex=5,6,7&time=1992-01,latest
```

Examine the data returned by this API call.

Now, construct a basic HTML page with the Google API, jQuery and JSON3 libraries.  The ```<div/>``` elements are the placemarker for the chart.

```html
    <html>
    <head> 
    <title>Timeline Example</title>

    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"></script>
    <script type="text/javascript"> 
    //Put your script here
    </script>

    </head>
    <body> 

    <div>
    <div id="chart_div" style="width: 520px; height: 300px;"></div>
    </div>
     


    </body>
    </html>
```

To import the appropriate Google visualisation tool the first like of our script should be 
```javascript
      google.load('visualization', '1.1', {'packages':['annotationchart']});
```


Retrieving data from the NOMIS API is a simple "GET" request.  Using the jQuery library this is as follows:

```javascript
      $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: "http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/1946157420/item/1/measures/20203.data.JSON?sex=5,6,7&time=1992-01,latest",
            dataType: "json",
            success : function(d){populateData(d)},
            error: function(xhr, ajaxOptions, thrownError) {
                alert("Status: " + xhr.status + "     Error: " + thrownError);
            }
         });
    });
```

Note that on a successful call the result is passed to a function ```populateData(d)```

Next comes the visualisation.  This is done by the ```populateData()``` function.  This function iterates through the JSON pulling out the values for the date, numbers of males, numbers of females, and total.  These data are inserted into a table as required by the Google visualisation tool (read their documentation)

```javascript
     function populateData(jsonlist) {

      var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Males');
        data.addColumn('number', 'Females');
        data.addColumn('number', 'Total');

      // Loop through each code in the codelist and build up buttons for the user to click
      var i;

      for(i = 0; i < jsonlist.obs.length/3; i++)
      {
         var yr = jsonlist.obs[i].time.value.substring(0,4);
         var month = jsonlist.obs[i].time.value.substring(5);


      data.addRow([new Date(yr, month ,1), jsonlist.obs[i].obs_value.value, jsonlist.obs[i+(jsonlist.obs.length/3)].obs_value.value,  jsonlist.obs[i+((jsonlist.obs.length/3)*2)].obs_value.value]);
    }

      var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));
      chart.draw(data, {width: 700, height: 300, displayAnnotations:true, dateFormat:"MMM yyyy" ,displayZoomButtons:false});
     }
     
```

Finally you can insert some title and other information above the chart, e.g.

```html
    <div id="chart_title">JSA for Glasgow City [1946157420]</div>
    <div>codes for towns and cities from <a href="http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/GEOGRAPHY/2092957698TYPE464.def.sdmx.json">http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/GEOGRAPHY/2092957698TYPE464.def.sdmx.json</a></div>
```

When you load the page the ```$(document).ready``` event is recognised and this triggers the XHR "GET" call to the NOMIS API.


####Next Steps

Take a look at other [Google visualisations](https://developers.google.com/chart/interactive/docs/gallery).  Find other datasets within NOMIS.  You caould create a dropdown list from the [http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/GEOGRAPHY/2092957698TYPE464.def.sdmx.json](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/GEOGRAPHY/2092957698TYPE464.def.sdmx.json) data and capture the ```onchange``` event to trigger the creation of another dataset and the re-drawing of the chart.  See the W3Schools page on the [onchange](http://www.w3schools.com/jsref/event_onchange.asp) event for more information.
