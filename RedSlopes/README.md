##Red Slopes

In the Green and Blue slopes the data that was being worked with in the examples came in a single bulk file.  If this was a large dataset then it would be like downloading the internet - the user would be waiting for ever for the data to download, the computer memory would be overwhelmed, and the programme you wrote would either not work at all or be so sluggish that the user would just give up in disgust and despair.

One approach to prevent this is for you to only pick small datasets - and there are many available.  Data providers who are sensitive to the diverse needs of their users tend to provide methods to subset and reduce the amount of the total dataset that an application designer can use to help make speedier and more flexible applications.

In this Red Slope we will look at how to work with two styles of subsetting method: the Application Programming Interface (API) and the SPARQL (RDF query language) endpoint.

First off, the API:  Take a look at the [NOMIS API]()

http://www.swslim.org.uk/nomis2.html
http://spencerhedger.com/?q=taxonomy/term/3




http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography.def.sdmx.xml  => Top level areas available
http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701.def.sdmx.xml  => Constituent geographies in Scotland
http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE61.def.sdmx.xml  => Postcode towns in Scotland
http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE63.def.sdmx.xml  => Postcode sectors in Scotland
http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1/geography/2092957701TYPE307.def.sdmx.xml  => Datazones in Scotland


http://www.nomisweb.co.uk/api/v01/dataset/def.sdmx.xml   => Available datasets
http://www.nomisweb.co.uk/api/v01/dataset/NM_612_1/def.sdmx.xml  => Passports held - from 2011 census






http://www.nomisweb.co.uk/api/v01/dataset/NM_1_1.data.csv?geography=2038432081&sex=5&item=1&measures=20100


http://www.nomisweb.co.uk/api/v01/dataset/nm_1_1/geography/2038432081/sex/7/item/1/measures/20203.data.json?time=2009-01,latest

