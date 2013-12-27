##Blue Slope

###Example

Use Exhibit to create a faceted navigation of an RSS feed

###Preamble
RSS = 'Really Simple Syndication': an XML format for providing some information about resources such as news articles and also a link to the resource.  RSS is different from a web page in that it provides no information about how the elements of the feed should be visualised, it is a source of data.  In this hack we will use the Exhibit faceted browsing framework to create a visualisation for the RSS data content.

So, what does an RSS feed look like?

The Scottish Government 'Latest News' RSS feed of 27 Dec 2013 is at the URL [http://scottishgovernment.presscentre.com/rss/default.aspx?feedid={8d8b9894-a7c9-4afd-91f2-bcc7e2ea81f6}](http://scottishgovernment.presscentre.com/rss/default.aspx?feedid={8d8b9894-a7c9-4afd-91f2-bcc7e2ea81f6})

Look at it with your web browser (hint: you will need to look at the source code because your browser will probably recognise it as an RSS feed and provide a visualisation).  
The data starts by identifying itself as XML:

```xml
    <?xml version="1.0" encoding="utf-8"?>
```

and then, using nested tags, it provides some information about the RSS file:

```xml
    <rss version="2.0" xmlns:glidetechnologies="http://www.glidetechnologies.com/ipcrssfeed">
        <channel>
            <title>Scottish Government Feed</title>
            <link>http://scottishgovernment.presscentre.com</link>
            <description>All news topics - all areas Live</description>
            <language>en-GB</language>
            <webMaster/>
            <lastBuildDate>Fri, 27 Dec 2013 21:55:11 GMT</lastBuildDate>
            <image>
                <title>powered by NASDAQ OMX | Media Manager</title>
                <url/>
                <link/>
                <width>144</width>
                <height>49</height>
                <description>All news topics - all areas Live</description>
            </image>
        <!--
        ...
        repeated <item/> data here
        ...
        -->
    </channel>
    </rss>
```

so the real data about each item is in the following pattern:

```xml
    <item>
        <title>Wintry weather update</title>
        <link>http://scottishgovernment.presscentre.com/News/Wintry-weather-update-7e9.aspx</link>
        <description>&lt;p&gt;Scottish Government Resilience committee monitors impact of storm.&lt;/p&gt;</description>
        <guid>http://scottishgovernment.presscentre.com/News/Wintry-weather-update-7e9.aspx</guid>
        <pubDate>Fri, 27 Dec 2013 12:49:00 GMT</pubDate>
        <glidetechnologies:author>Catherine Brown</glidetechnologies:author>
        <glidetechnologies:client>ScottishGovernment</glidetechnologies:client>
        <glidetechnologies:processDate>Fri, 27 Dec 2013 12:49:00 GMT</glidetechnologies:processDate>
        <glidetechnologies:releaseId>2025</glidetechnologies:releaseId>
    </item>

```