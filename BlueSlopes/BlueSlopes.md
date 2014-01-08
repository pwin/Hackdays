##Blue Slopes

In this Blue Slope run we will extend what we learned with the Exhibit version 2 work on the Green Slope and see how we can work with RSS feeds to give faceted browsing based on text matches and to give timelines.

For background on RSS data feeds check out the [Wikipedia article](http://en.wikipedia.org/wiki/RSS).  These are XML feeds.  There is a [Google API service](https://www.google.com/jsapi) that converts these XML feeds to JSON, and then to get we need to do a little modification of this JSON structure to make it work correctly with Exhibit.  The googlefeeds-importer.js (from the [Ensemble Project](http://www.ensemble.ac.uk/)) does this modification.

Many organisations produce RSS data feeds, so pick one and look at it in your web browser.  Your browser will probably create a simple visualisation of the data, so view the source code in the usual way (right-click etc) to take a peek at the underlying XML.

##Down to business!

In your favourite text editor create the following skelton file and save it ...BlueSlopeExample1.html.

```html
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>My Blue Slope Example 1</title>
            <!--Exhibit JS and other libraries-->
            <script type="text/javascript" src="http://api.simile-widgets.org/exhibit/2.2.0/exhibit-api.js"></script>
            <script type="text/javascript" src="http://api.simile-widgets.org/exhibit/2.2.0/extensions/time/time-extension.js" ></script>
            <script type="text/javascript" src="https://www.google.com/jsapi"></script>
            <script type="text/javascript" src="googlefeeds-importer.js"></script>
            <!--data-->
            <!--styles-->
             <link rel='stylesheet' href='http://www.simile-widgets.org/styles/common.css' type='text/css' />            
        </head>
        <body>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
            
            <!--lenses-->
            
            <!--display options-->
            
            <!--facets-->
            
            <!--list view-->
            
            <!--Search-->            
            
            <!--cloud view-->
            
            <!--Debug textarea-->
        </body>
    </html>
```
Download and save the `googlefeeds-importer.js` and `__history__.html` files in the same folder.

Open up your `BlueSlopeExample1.html` file in a web browser and confirm that  it loads without any errors.

Back to the editor now, and add two RSS feeds as Exhibit data sources just below the placemarker

```html
     <link 
     href="http://scottishgovernment.presscentre.com/rss/default.aspx?feedid={8d8b9894-a7c9-4afd-91f2-bcc7e2ea81f6}" 
     type="application/rss+xml" rel="exhibit/data" /> 
     <link 
     href="http://www.trafficscotland.org/rss/feeds/currentincidents.aspx" 
     type="application/rss+xml" rel="exhibit/data" /> 
```
Save the file and again confirm that it loads without errors.

Add a list view:

```html
    <div ex:role="viewPanel">
        <div ex:role='view'></div>
    </div>
```
and reload the page.  How does it look?

Later you can add a 'lens' to make this list more organised and stylish, but before you do that add a couple of facets.  These facets will be used to sort out feeds based on the text content of each feed.  We will use a method that allows you to create a facet category and then provide a list of words or parts of words that will be used to select out matching feeds.

Add the following code snippet just below the 'facets' place marker:
```html
    <div style="position:Absolute; top:0px; bottom:0px; right:0px; width:200px; overflow:Auto;">
    <!-- Exhibit facets, using item properties created by the RSS importer -->
    <div ex:role="facet" ex:expression=".topic" ex:facetLabel="Topic" ex:showMissing="false" ex:height="6.5em"></div>
    <div ex:role="facet" ex:expression=".weather" ex:facetLabel="Weather" ex:showMissing="false" ex:height="6.5em"></div>
    </div>
    <div ex:role="rssImporterConfig" ex:for="http://scottishgovernment.presscentre.com/rss/default.aspx?feedid={8d8b9894-a7c9-4afd-91f2-bcc7e2ea81f6}"
    ex:exhibitLabel="link" ex:exhibitType="rssScotGov" ex:rssSize="150" ex:historical="false" style="display:None">
    <div ex:role="rssImporterConfig"  ex:for="http://www.trafficscotland.org/rss/feeds/currentincidents.aspx"
    ex:exhibitLabel="link" ex:exhibitType="rssTransScot"  ex:rssSize="150" ex:historical="false" style="display:None">
        <ul ex:create="topic" ex:search="content">
        <li>Politics;government;parliament;msp</li>
        <li>Innovation;computer;tech;science;digital;future;knowledge economy;innovative;transformative</li>         
        </ul>
         <ul ex:create="weather" ex:search="content;title">
         <li>Storms;storm;weather</li>
         <li>Floods;flood;river</li>
         <li>RoadWorks;work;</li>
         </ul>
        </div>
    </div>
```

Note how the rssImporterConfig variables are provided and hot the text-based facets (topic and weather) are created.

Later on try modifying this to create additional facets.  Also explore how effectively you can create non-overlapping facets by judicious choice of words or word fragments.

Try adding the following textarea code to the bottom of your file, just before the closing 'body' tag:

```html
    <textarea id="_exhibitRSSDebug_" cols="80" rows="20" wrap="off"></textarea>
```

This allows you to see the debugging information provided by the googlefeeds-importer.js code.
When you have finished inspecting this you can temporarily inactivate this chunk of code by placing it within html comment marks as follows:

```html
    <!--
    <textarea id="_exhibitRSSDebug_" cols="80" rows="20" wrap="off"></textarea>
    -->
```

###Timelines

Next we are going to add a timeline view.

Under the List View place holder add the following:

```html
    <div style="position:Absolute; top:200px; bottom:0px; right:0px; width:200px; overflow:Auto;">
    <div ex:role="view" 
      ex:viewClass="Timeline" 
      ex:start=".date"
      ex:marker=".title"
      ex:bottomBandPixelsPerUnit="35"
      ex:topBandPixelsPerUnit="55"
      ex:timelineHeight="380"
      ex:topBandUnit="day"
      ex:colorKey=".topic" >
    </div>
    </div>
```
This creates the timeline for each of the RSS feed items.  You might need to adjust the styling (within the opening div tag).  Note that this uses the 'topic' facet that you created earlier to colour-code the RSS links.


###Next Steps
The styling is very rough - try to improve it.  Use the W3Schools as a source of information about CSS styles.
Think about creating a few different Exhibits, each one pulling in a different set of RSS feeds.  Try adjusting the granularity of the timeline.  Look at the ['Gallery'](http://www.ensemble.ac.uk/wp/archives/portfolio_category/project-gallery) of the Ensemble website and any other instances of Exhibit that you can find on the web and examine the source code to find other cool things to try out.  Above all, have fun learning.

####Useful Links

[Exhibit 2 Documentation for Authors](http://simile.mit.edu/wiki/Exhibit/For_Authors)

[Easy Exhibit Visusalization for Journalists](http://people.csail.mit.edu/karger/Exhibit/CAR/)

[BP Oil Spill](http://people.csail.mit.edu/karger/Exhibit/CAR/bp.html)

[Commodities Tracker Exhibit](http://wjwieland.dvrdns.org/cb_tracker/ad_tracker.html)

[Breakins](http://wjwieland.dvrdns.org/cb_tracker/breakins.html)

[University of Delaware Authors Catalog](http://www.udel.edu/udauthors/)







