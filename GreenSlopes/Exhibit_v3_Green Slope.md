##Green Slope

###Example using Exhibit v3

Make something similar to [http://labs.data.scotland.gov.uk/scraping/SG/index.html](http://labs.data.scotland.gov.uk/scraping/SG/index.html) using Exhibit v3

####Ingredients:

* Data in Exhibit JSON format:  [http://labs.data.scotland.gov.uk/scraping/SG/current_spreadsheets.json](http://labs.data.scotland.gov.uk/scraping/SG/current_spreadsheets.json)
* Exhibit Version 3 JS library: [http://api.simile-widgets.org/exhibit/3.1.0rc/exhibit-api.js](http://api.simile-widgets.org/exhibit/3.1.0rc/exhibit-api.js)
* A text editor (e.g. Notepad) or a specialised code editor (e.g. Sublime Text, jEdit, Textmate, etc)
* A modern web browser (Chrome, Internet Explorer >= v9, Firefox, etc)


#####Step 1: 
* Create a text file called 'myGreenSlopeExample.html'
* Add the following shell:
```html

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>My Green Slope Example</title>
	    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <!--Exhibit JS library-->
            <!--data-->
            <!--styles-->
        </head>
        <body>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
            <!--lenses-->
            <!--display options-->
            <!--facets-->
            <!--list view-->
            <!--Search-->            
            <!--cloud view-->
        </body>
    </html>
```

* check that this works by opening it up in your web browser.  If it looks OK then add the Exhibit JS library just below the placemarker in your shell template using the following approach:


```html

    <script src="http://api.simile-widgets.org/exhibit/3.1.0rc/exhibit-api.js"></script>
    
```

and reload the page.  Look at the message bar of the web page and ensure that the JS library is loading OK.

* Then add a link to the JSON data file: 

```html

    <link href="http://labs.data.scotland.gov.uk/scraping/SG/current_spreadsheets.json" type="application/json" rel="exhibit-data" />
    
```

and reload the page.  During the reload you should now see a small dialogue pane that describes the progress of the data loading phase.

* Look at the JSON data (open the JSON link in your browser and then, using right-click and view source, examine the raw JSON code) - it is made of a repeat of the following data structure:

```json

    {
    "referring": "http://scotland.gov.uk/ID3/290184", 
    "type": "Publication", 
    "metatitle": "SOCIAL CARE SERVICES, SCOTLAND, 2013", 
    "subject": "Health and Community Care", 
    "label": "0fb478bb-0152-432b-a0c9-d2136e73de24", 
    "summary": "", 
    "keywords": ["Scotland", "Scottish Executive", "Scottish Parliament"], 
    "link": "http://www.scotland.gov.uk/Resource/0043/00439211.xlsx", 
    "date": "2013-11-27T11:13:42+00:00", 
    "referring_url": "http://www.scotland.gov.uk/Publications/2013/11/8713/downloads", 
    "metadescription": ""
    },
    
```
so we start the layout by creating a list view.
```html

    <div id="list" data-ex-role="exhibit-viewPanel">
        <div data-ex-role="exhibit-view" data-ex-label="List"></div>
    </div>
    
```
Reload the page and examine the results.
* Next we will make the raw printout of the data look more presentable.  In Exhibit parlance we create a 'lens'.  There can be many forms of these, here is an example:

```html

    <div data-ex-role="exhibit-lens">
        <div>
        <span>Title:-</span><span data-ex-content=".metatitle"></span>
        </div>
        <div>
        <span>Description:-</span><span data-ex-content=".metadescription"></span>
        </div>
        <div>
        <span>Link:-</span>
        <a data-ex-href-content=".link" target="_blank">
        <span data-ex-content=".link"></span>
        </a> 
        </div>
        <hr/>
    </div>
```

the 'data-ex-role' and 'data-ex-content' are Exhibit-specific html attributes that are used by the Exhibit JS API to identify data fields etc. to be used for presentation or other processing.

* In the data the 'Keywords' is a list (in JSON this is coded by using square brackets to wrap list members).  Use the 'Keywords' list to make a word cloud using the following code:
```html

    <div id="cloud" data-ex-role="exhibit-facet" data-ex-expression=".keywords" data-ex-facet-class="Cloud" data-ex-label="Cloud" data-ex-show-missing="false">
```

Reload the page and confirm that the word cloud is at the bottom of the page.  Check that it works, i.e. select a cloud item and confirm that it selects a subset of the data.

* Add a search function with the following code:
```html

    <div id="search" data-ex-role="exhibit-facet" data-ex-facet-label="Search" data-ex-facet-class="TextSearch"></div>
```

and test that this works.

* Now time for some facets (categories of data record).  In this case we can easily use the 'subject' and 'type' variables with the following code.

```html

    <div id="subject" data-ex-role="facet" data-ex-expression=".subject" data-ex-show-missing="true" data-ex-height="150px"></div>
    <div id="type" data-ex-role="facet" data-ex-expression=".type" data-ex-show-missing="true" data-ex-height="150px"></div> 

```

* Now let's try and improve the layout using the following rather simplistic styling:  Give the 'Cloud' div the id "cloud", the 'List' div the id "list", and the 'Search' div the id "search", and add the following style code:
```html

        <style type="text/css">
        #cloud {
        position: relative;
        float: left;
        vertical-align: top;
        width: 300px;
        }

        #list {
        width: 700px;
        float: right;
        position: relative;
        height: 280px;
        }

        #search {
        width:250px;
        float:left;
	    }

        #subject {
        float: left;
        font-size: 15px;
        padding: 4px;
        position: relative;
        width: 250px;
        }
        
        #type {
        float: left;
        font-size: 15px;
        padding: 4px;
        position: relative;
        width: 250px;
        } 
        </style>
```

reload the web page and see the effect.  Note that styles identified by a hash variable are applied only to the html element with that specific id.  

* Go to the [W3Schools site](http://www.w3schools.com/) and learn about Cascading Style Sheets and make some improvements to the styling of this faceted browser.
* you might need to ensure that the browser supports [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).  Add he following code in after the styles in the head area:
```
<script>
$.support.cors = true;
</script>
```
