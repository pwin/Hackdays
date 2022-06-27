In this exercise we will look at the SPARQL query language and use it to explore the [Scottish Government Statistics](http://statistics.gov.scot) data which is modelled as an RDF data cube (more of that later).

General resources:

* https://www.w3.org/RDF/  general introduction to RDF (Resource Description Framework) - the data model used in http://statistics.gov.scot  The Scottish Government statistical data repo
* https://www.w3.org/TR/vocab-data-cube/ about the RDF Data Cube vocabulary
* https://www.w3.org/TR/rdf-sparql-query/  SPARQL (the RDF query language) version 1
* https://www.w3.org/TR/sparql11-overview/  SPARQL 1.1

DEMO

1:  Go to http://yasgui.triply.cc/

2:  Paste https://dbpedia.org/sparql into the endpoint box - it might be there already

3:  let's see if there are any triples there (Basic Graph Pattern - BGP).  In SPARQL variables are strings that start with the question mark.  Graph patterns are surrounded by braces.  So to see if we have any triples in a Basic Graph Pattern (subject-predicate-object or subject-predicate-literal) we use the keyword "ask" 

```
    ask 
    {?s ?p ?o}
```

4:  Triples can be contained within a Named Graph - in effect this makes them quads (graph-subject-predicate-object or graph-subject-predicate-literal).  We can use the ASK keyword together with the GRAPH keyword to see if there is at least one named graph.

```
ask {
graph ?g {?s ?p ?o}
}
```

5:  How do we know it isn't just returning True all the time?

```
ask {
graph ?g 
{?s <http://something.org/text> ?o}
}
```

6:  Lets look at some graphs.  SPARQL uses the "SELECT" keyword in the same way that SQL does.  We can also deduplicate using "DISTINCT".  Remember that there is case sensitivity for IRIs

```
select distinct ?g
{graph ?g
{?s ?p ?o }
}
limit 200
```

6:  How many graphs are there?  SPARQL uses many of the XPath functions, such as count().  However, unlike SQL, once we apply a function to a variable we need to also bind the result to a new variable.

```
select (count(distinct ?g) as ?numberOfGraphs)
{graph ?g
{?s ?p ?o }
}
```

6a:  What Classes of "thing" are there?

```
select distinct ?o
{graph ?g
{?s a ?o }
}
```

6b:  the 'a' in the above is a shorthand for rdf:type 

So we could have looked for the Classes of 'thing' in the following way

```
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select distinct ?s
{graph ?g
{?s rdf:type rdfs:Class }
}
```



7:  Having spotted what looks like an interesting graph earlier, (just from the URI) let's rummage around

```
SELECT * WHERE {
  graph <http://statistics.gov.scot/graph/p1-BMI-clinical>{
  ?sub ?pred ?obj .
}
}
LIMIT 10
```

7a:  noticing the 'cube' predicates, let's explore
http://purl.org/linked-data/cube#structure

7b:  let's look to see if there is a qb:DataSet

```
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX qb: <http://purl.org/linked-data/cube#>
select distinct ?s
{graph ?g
{?s rdf:type qb:DataSet }
}
```

8:  Just speculatively picking a 'structure' URI, we can describe it

```
describe <http://statistics.gov.scot/data/structure/p1-BMI-clinical>
```

9:  ...we can grub around more using 'describe'

```
describe <http://statistics.gov.scot/def/code-list/p1-BMI-clinical/weightCategory>
```

10:  let's explore this 'code list' to see what it is about

```
SELECT * WHERE {
  ?sub ?pred <http://statistics.gov.scot/def/concept/weight-category/clinical-overweight> .
}
LIMIT 10
```

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
SELECT ?obj ?objLabel WHERE {
  <http://statistics.gov.scot/def/concept-scheme/weight-category> ?pred ?obj ;.
   ?obj    rdfs:label | dc:title ?objLabel .
}
LIMIT 100
```

11: So, back to the query earlier

```
SELECT * WHERE {
  graph <http://statistics.gov.scot/graph/p1-BMI-clinical>{
  ?sub ?pred ?obj .
}
}
LIMIT 10
```

we can see several potentially interesting cube components for http://statistics.gov.scot/data/structure/p1-BMI-clinical



12:  Find some observations

```
PREFIX qb: <http://purl.org/linked-data/cube#>
SELECT * WHERE {
  graph <http://statistics.gov.scot/graph/p1-BMI-clinical>{
  ?s a <http://purl.org/linked-data/cube#Observation> ;.
}
}
LIMIT 10
```

13:  describe one

```
describe <http://statistics.gov.scot/data/p1-BMI-clinical/government-year/2007-2008/S08000015/gender/female/weight-category/clinical-underweight/percent-of-p1-children/ratio>
```

Then pull the description to create a more general query

```
<http://statistics.gov.scot/data/p1-BMI-clinical/government-year/2007-2008/S08000015/gender/female/weight-category/clinical-underweight/percent-of-p1-children/ratio> a <http://purl.org/linked-data/cube#Observation> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refArea> <http://statistics.gov.scot/id/statistical-geography/S08000015> ;
	<http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> <http://statistics.gov.scot/def/concept/measure-units/percent-of-p1-children> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> <http://reference.data.gov.uk/id/government-year/2007-2008> ;
	<http://purl.org/linked-data/cube#measureType> <http://statistics.gov.scot/def/measure-properties/ratio> ;
	<http://purl.org/linked-data/cube#dataSet> <http://statistics.gov.scot/data/p1-BMI-clinical> ;
	<http://statistics.gov.scot/def/dimension/gender> <http://statistics.gov.scot/def/concept/gender/female> ;
	<http://statistics.gov.scot/def/measure-properties/ratio> 6.3E-1 ;
	<http://statistics.gov.scot/def/dimension/weightCategory> <http://statistics.gov.scot/def/concept/weight-category/clinical-underweight> .
```

Replace the entity URIs for the objects above with variables, and stick a select verb around it to create a query

```
select * {
  graph <http://statistics.gov.scot/graph/p1-BMI-clinical>{
?obs a <http://purl.org/linked-data/cube#Observation> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea ;
	<http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?uom ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod ;
	<http://purl.org/linked-data/cube#measureType> ?measureType ;
	<http://purl.org/linked-data/cube#dataSet> ?dataSet ;
	<http://statistics.gov.scot/def/dimension/gender> ?gender ;
	<http://statistics.gov.scot/def/measure-properties/ratio> ?ratio ;
	<http://statistics.gov.scot/def/dimension/weightCategory> ?weightCategory .
  }
  }
limit 10
```

Now we need some labels

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select * {
  graph <http://statistics.gov.scot/graph/p1-BMI-clinical>{
?obs a <http://purl.org/linked-data/cube#Observation> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea ;
	<http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?uom ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod ;
	<http://purl.org/linked-data/cube#measureType> ?measureType ;
	<http://purl.org/linked-data/cube#dataSet> ?dataSet ;
	<http://statistics.gov.scot/def/dimension/gender> ?gender ;
	<http://statistics.gov.scot/def/measure-properties/ratio> ?ratio ;
	<http://statistics.gov.scot/def/dimension/weightCategory> ?weightCategory .
    ?refArea rdfs:label ?refAreaLabel.
    ?refPeriod rdfs:label ?refPeriodLabel .
    ?gender rdfs:label ?genderLabel.
}
}
limit 10
```

But this doesn't return anything. Spoiler-alert:  The labels are somewhere else - different graph/s

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?g ?g1 ?g2 ?g3 ?g4 ?refArea ?refAreaLabel ?refPeriodLabel ?genderLabel ?weightCategoryLabel ?ratio  WHERE {
  graph <http://statistics.gov.scot/graph/p1-BMI-clinical>{
?obs a <http://purl.org/linked-data/cube#Observation> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea ;
	<http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?uom ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod ;
	<http://purl.org/linked-data/cube#measureType> ?measureType ;
	<http://purl.org/linked-data/cube#dataSet> ?dataSet ;
	<http://statistics.gov.scot/def/dimension/gender> ?gender ;
	<http://statistics.gov.scot/def/measure-properties/ratio> ?ratio ;
	<http://statistics.gov.scot/def/dimension/weightCategory> ?weightCategory .

}
  graph ?g {
    ?refArea rdfs:label ?refAreaLabel.
      }
  graph ?g1 {
    ?refPeriod rdfs:label ?refPeriodLabel .
      }
  graph ?g2 {
    ?refPeriod rdfs:label ?refPeriodLabel .
      }
  graph ?g3 {
	?gender rdfs:label ?genderLabel.
      }
  graph ?g4 {
	?weightCategory  rdfs:label ?weightCategoryLabel .
      }
}
LIMIT 10
```

We can in this case remove the specification for individual named graphs and use the "Union Graph" - (think sets)
Also, instead of everything we just return the labels

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?refAreaLabel ?refPeriodLabel ?genderLabel ?weightCategoryLabel ?ratio {
?obs a <http://purl.org/linked-data/cube#Observation> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea ;
	<http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?uom ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod ;
	<http://purl.org/linked-data/cube#measureType> ?measureType ;
	<http://purl.org/linked-data/cube#dataSet> ?dataSet ;
	<http://statistics.gov.scot/def/dimension/gender> ?gender ;
	<http://statistics.gov.scot/def/measure-properties/ratio> ?ratio ;
	<http://statistics.gov.scot/def/dimension/weightCategory> ?weightCategory .
    ?refArea rdfs:label ?refAreaLabel.
    ?refPeriod rdfs:label ?refPeriodLabel .
    ?gender rdfs:label ?genderLabel.
	?weightCategory  rdfs:label ?weightCategoryLabel .
}
#limit 10
```
From this we can use the yasgui embedded pivot table or charts to create some views on the results.  We can use FILTER() conditions to focus the query better

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?refAreaLabel ?refPeriodLabel ?genderLabel ?weightCategoryLabel ?ratio {
?obs a <http://purl.org/linked-data/cube#Observation> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea ;
	<http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?uom ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod ;
	<http://purl.org/linked-data/cube#measureType> ?measureType ;
	<http://purl.org/linked-data/cube#dataSet> ?dataSet ;
	<http://statistics.gov.scot/def/dimension/gender> ?gender ;
	<http://statistics.gov.scot/def/measure-properties/ratio> ?ratio ;
	<http://statistics.gov.scot/def/dimension/weightCategory> ?weightCategory .
    ?refArea rdfs:label ?refAreaLabel.
    ?refPeriod rdfs:label ?refPeriodLabel .
    ?gender rdfs:label ?genderLabel.
	?weightCategory  rdfs:label ?weightCategoryLabel .
  FILTER(lcase(?refAreaLabel) = "scotland" && contains(?weightCategoryLabel,"Clinical - Healthy")  &&  ?genderLabel = "Male")
}
```


Once we have a suitable query we need to think about how to use this in an application.  We can use tools like Postman to help.

Using Postman to test, the "&&" cause problems, so use several FILTER() statements

```
Accept=application/SPARQL-Results+xml
```


```
query=PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?refAreaLabel ?refPeriodLabel ?genderLabel ?weightCategoryLabel ?ratio {
?obs a <http://purl.org/linked-data/cube#Observation> ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea ;
	<http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?uom ;
	<http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod ;
	<http://purl.org/linked-data/cube#measureType> ?measureType ;
	<http://purl.org/linked-data/cube#dataSet> ?dataSet ;
	<http://statistics.gov.scot/def/dimension/gender> ?gender ;
	<http://statistics.gov.scot/def/measure-properties/ratio> ?ratio ;
	<http://statistics.gov.scot/def/dimension/weightCategory> ?weightCategory .
    ?refArea rdfs:label ?refAreaLabel.
    ?refPeriod rdfs:label ?refPeriodLabel .
    ?gender rdfs:label ?genderLabel.
	?weightCategory  rdfs:label ?weightCategoryLabel .
   FILTER(lcase(?refAreaLabel) = "scotland")
   FILTER(contains(?weightCategoryLabel,"Clinical - Healthy"))
   FILTER(?genderLabel = "Male")
  }
  order by ?refPeriodLabel
```
