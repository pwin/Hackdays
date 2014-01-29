##Red Slopes

In the Green and Blue slopes the data that was being worked with in the examples came in a single bulk file.  If this was a large dataset then it would be like downloading the internet - the user would be waiting for ever for the data to download, the computer memory would be overwhelmed, and the programme you wrote would either not work at all or be so sluggish that the user would just give up in disgust and despair.

One approach to prevent this is for you to only pick small datasets - and there are many available.  Data providers who are sensitive to the diverse needs of their users tend to provide methods to subset and reduce the amount of the total dataset that an application designer can use to help make speedier and more flexible applications.

In this Red Slope we will look at how to work with two styles of subsetting method: the Application Programming Interface (API) and the SPARQL (RDF query language) endpoint.

First off, the API:  Take a look at the [NOMIS API]http://www.nomisweb.co.uk/api/v01/help).  The API uses URLs that contain parameters(variables) which the API uses to select the data that you are wanting.  There tends to be a fixed order and format for these paramers and there generally isn't a way (other than reading the documentation) to find out what the API can deliver.  Moreover, there is no standard for APIs.  

Both the ability to discover about the data that the endpoint can deliver and the standardisation of the endpoint are ways in which SPARQL endpoints are improvements on the API.  However, to counterbalance this flexibility of the SPARQL approach, APIs tend to be easier for the novice to deal with.

####Examples of NOMIS API calls
[http://www.nomisweb.co.uk/api/v01/dataset/def.sdmx.xml](http://www.nomisweb.co.uk/api/v01/dataset/def.sdmx.xml)   => Available datasets

[http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography.def.sdmx.xml](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography.def.sdmx.xml)  => Top level areas available

[http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701.def.sdmx.xml](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701.def.sdmx.xml)  => Constituent geographies in Scotland

[http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE61.def.sdmx.xml](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE61.def.sdmx.xml)  => Postcode towns in Scotland

[http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE63.def.sdmx.xml](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE63.def.sdmx.xml)  => Postcode sectors in Scotland

[http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE307.def.sdmx.xml](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE307.def.sdmx.xml)  => Datazones in Scotland

[http://www.nomisweb.co.uk/api/v01/dataset/NM_612_1/def.sdmx.xml](http://www.nomisweb.co.uk/api/v01/dataset/NM_612_1/def.sdmx.xml)  => Passports held - from E&W 2011 census


The above return data in XML format.  One can also get data returned in CSV, JSON and other useful formats.  

[http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1.data.csv?geography=255852654&sex=5&item=1&measures=20100](http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1.data.csv?geography=255852654&sex=5&item=1&measures=20100)  => JSA claimants in Glasgow (geography=255852654)


http://www.swslim.org.uk/nomis2.html
http://spencerhedger.com/?q=taxonomy/term/3





http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1.data.csv?geography=2038432081&sex=5&item=1&measures=20100


http://www.nomisweb.co.uk/api/v01/dataset/nm_1_1/geography/2038432081/sex/7/item/1/measures/20203.data.json?time=2009-01,latest

