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


####Examples of SPARQL

Go to [http://www.semantechs.co.uk/FlintSparqlEditor/sparql-editor.html](http://www.semantechs.co.uk/FlintSparqlEditor/sparql-editor.html) where you will find a SPARQL editor with some canned queries from common SPARQL endpoints.

SPARQL is somewhat similar to the database query language SQL.  You can find out more about SPARQL using the UK DCLG dataset at [http://blog.swirrl.com/articles/sparql-example-find-data-for-postcode/](http://blog.swirrl.com/articles/sparql-example-find-data-for-postcode/)

SPARQL can also be used to combine data from multiple SPARQL endpoints (providedthat they are configured for federated query).  Here's a SPARQL illustration of merging data from two sources
Enter the following into the search pane into a SPARQL endpoint (one that is set up to allow SPARQL 1.1 federated searches - try the SEPA or the World Bank endpoint).  It selects landlocked countries from DBPedia and the looks in the World Bank dataset for some of their data with the same DBPedia country identifiers. 

```
    #find the landlocked countries 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX dct: <http://purl.org/dc/terms/> 
    PREFIX type: <http://dbpedia.org/class/yago/> 
    PREFIX prop: <http://dbpedia.org/property/> 
    SELECT ?country ?country_name ?capital ?population ?p ?x ?q ?w 
    WHERE { 
    service <http://dbpedia.org/sparql/sparql> 
     { ?country a type:LandlockedCountries ; 
           rdfs:label ?country_name ; 
           prop:populationEstimate ?population ; 
           prop:capital ?capital . 
       FILTER ( lang(?country_name) = 'en' )
     }
     SERVICE <http://worldbank.270a.info/sparql>
     {optional {?p ?x ?country.
             ?p ?q ?w . }}
     }
     limit 10
 ```

The Flint Editor is a pretty way to explore a SPARQL endpoint, but in an application one needs to submit the query to the endpoint as an XHR "GET" request.  To do this we need to first ensure that the query is encoded to replace spaces and other characters by their hex equivalents.  you can do this using a site such as [http://www.url-encode-decode.com/](http://www.url-encode-decode.com/).  Using the above query as an example, the encoded version looks like this:

```
    %23find+the+landlocked+countries+%0A++++PREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+%0A++++PREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E+%0A++++PREFIX+type%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fclass%2Fyago%2F%3E+%0A++++PREFIX+prop%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E+%0A++++SELECT+%3Fcountry+%3Fcountry_name+%3Fcapital+%3Fpopulation+%3Fp+%3Fx+%3Fq+%3Fw+%0A++++WHERE+%7B+%0A++++service+%3Chttp%3A%2F%2Fdbpedia.org%2Fsparql%2Fsparql%3E+%0A+++++%7B+%3Fcountry+a+type%3ALandlockedCountries+%3B+%0A+++++++++++rdfs%3Alabel+%3Fcountry_name+%3B+%0A+++++++++++prop%3ApopulationEstimate+%3Fpopulation+%3B+%0A+++++++++++prop%3Acapital+%3Fcapital+.+%0A+++++++FILTER+%28+lang%28%3Fcountry_name%29+%3D+%27en%27+%29%0A+++++%7D%0A+++++SERVICE+%3Chttp%3A%2F%2Fworldbank.270a.info%2Fsparql%3E%0A+++++%7Boptional+%7B%3Fp+%3Fx+%3Fcountry.%0A+++++++++++++%3Fp+%3Fq+%3Fw+.+%7D%7D%0A+++++%7D%0A+++++limit+10
```

and this can be linked to the World Bank endpoint to create a complete URL suitable for GET requests as follows:

```
    http://worldbank.270a.info/sparql?query=%23find+the+landlocked+countries+%0A++++PREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+%0A++++PREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E+%0A++++PREFIX+type%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fclass%2Fyago%2F%3E+%0A++++PREFIX+prop%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E+%0A++++SELECT+%3Fcountry+%3Fcountry_name+%3Fcapital+%3Fpopulation+%3Fp+%3Fx+%3Fq+%3Fw+%0A++++WHERE+%7B+%0A++++service+%3Chttp%3A%2F%2Fdbpedia.org%2Fsparql%2Fsparql%3E+%0A+++++%7B+%3Fcountry+a+type%3ALandlockedCountries+%3B+%0A+++++++++++rdfs%3Alabel+%3Fcountry_name+%3B+%0A+++++++++++prop%3ApopulationEstimate+%3Fpopulation+%3B+%0A+++++++++++prop%3Acapital+%3Fcapital+.+%0A+++++++FILTER+%28+lang%28%3Fcountry_name%29+%3D+%27en%27+%29%0A+++++%7D%0A+++++SERVICE+%3Chttp%3A%2F%2Fworldbank.270a.info%2Fsparql%3E%0A+++++%7Boptional+%7B%3Fp+%3Fx+%3Fcountry.%0A+++++++++++++%3Fp+%3Fq+%3Fw+.+%7D%7D%0A+++++%7D%0A+++++limit+10
```

Check this out in a browser - it returns nice JSON that you will now be familiar with.

