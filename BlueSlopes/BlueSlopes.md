##Blue Slopes

In this Blue Slope run we will extend what we learned with the Exhibit version 2 work on the Green Slope and see how we can work with RSS feeds to give faceted browsing based on text matches and to give timelines.

For background on RSS data feeds check out the [Wikipedia article](http://en.wikipedia.org/wiki/RSS).  These are XML feeds.  There is a [Google API service](https://www.google.com/jsapi) that converts these XML feeds to JSON, and then to get we need to do a little modification of this JSON structure to make it work correctly with Exhibit.  The googlefeeds-importer.js (from the [Ensemble Project](http://www.ensemble.ac.uk/)) does this modification.

Many organisations produce RSS data feeds, so pick one and look at it in your web browser.  Your browser will probably create a simple visualisation of the data, so view the source code in the usual way (right-click etc) to take a peek at the underlying XML.








