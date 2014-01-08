/*==================================================
 *  Exhibit.ExhibitGoogleFeedsImporter
 * Ensemble Project (LJMU) importer for Google Feeds, for
 * creating Exhibit items from RSS, using keyword searches.
 *==================================================
 */
 
// Google Feeds needs initialising
if('google' in window) {
	google.load("feeds", "1");
} else {
	SimileAjax.Debug.warn('Cannot find the Google Feeds API library!');
}
 
Exhibit.ExhibitGoogleFeedsImporter = {};
Exhibit.importers["application/rss+xml"] = Exhibit.ExhibitGoogleFeedsImporter;

Exhibit.ExhibitGoogleFeedsImporter._googleHasLoaded = false;
Exhibit.ExhibitGoogleFeedsImporter.load = function(link,database,cont) {
	/*var url = typeof link == "string" ? link : link.href;
	url = Exhibit.Persistence.resolveURL(url);*/

	var url = link;
	// <link>
	if(typeof link != "string") {
		url = Exhibit.Persistence.resolveURL(link.href);  // href
	}

	// Pull config from HTML
	var convertConf = Exhibit.ExhibitGoogleFeedsImporter.config(url);
	if(!convertConf) { return; }

	var fError = function(result) {
		Exhibit.UI.hideBusyIndicator();
		Exhibit.UI.showHelp(Exhibit.l10n.failedToLoadDataFileMessage(url));
		if(cont) { cont(); }
	};
	
	var fDone = function(result) {
		try {
			var o = null;
			try {
				//var dt1 = (new Date()).getTime();
				o = Exhibit.ExhibitGoogleFeedsImporter.convertRSSJsonToExhibitJson(result,convertConf);
				//var dt2 = (new Date()).getTime();
				//console.log(dt1,dt2,dt2-dt1,o);
			} catch (e) {
				Exhibit.UI.showJsonFileValidation(Exhibit.l10n.badJsonMessage(url, e), url);
			}            
			if(o != null) {
				database.loadData(o, Exhibit.Persistence.getBaseURL(url));
			}
		} catch (e) {
			SimileAjax.Debug.exception(e, "Error loading Exhibit JSON data from " + url);
		} finally {
			Exhibit.UI.hideBusyIndicator();
			if(cont) { cont(); }
		}
    };

	// Show indicator (deactivated by either fDone() or fError())
	Exhibit.UI.showBusyIndicator();
	//SimileAjax.XmlHttp.get(url, fError, fDone);
	var f = function() {
		//var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
		Exhibit.ExhibitGoogleFeedsImporter._googleHasLoaded = true;
		var feed = new google.feeds.Feed(url);
		if(convertConf.historical) { feed.includeHistoricalEntries(); }
		feed.setNumEntries(convertConf.size);
		feed.load(function(result) {
			((result.error)?fError:fDone)(result);
		});
	};
	
	// If this is the first time the importer has run, register our func as
	// callback to Google's OnLoad event, otherwise assume Google API has
	// loaded and run code direct.
	if(!Exhibit.ExhibitGoogleFeedsImporter._googleHasLoaded) {
		// 1st time?  Run when Google is ready.
		google.setOnLoadCallback(f);
	} else {
		// 2nd time plus?  Google must be ready now!
		f();
	}
};

Exhibit.ExhibitGoogleFeedsImporter.config = function(forTarget) {
	// Load config if necessary
	Exhibit.ExhibitGoogleFeedsImporter._loadConfig();
	if(!Exhibit.ExhibitGoogleFeedsImporter._configs) { 
		SimileAjax.Debug.warn('No config found!');
		return;
	}

	// Fetch config, if none listed use default ('*')
	var convConfig = Exhibit.ExhibitGoogleFeedsImporter._configs[forTarget];
	if(!convConfig) {
		convConfig = Exhibit.ExhibitGoogleFeedsImporter._configs['*'];
	}
	// Still no config?  Complain!
	if(!convConfig) {
		SimileAjax.Debug.warn('No feed config found for '+forTarget);
	}
	return convConfig;
}

/** Load configs (once!) */
Exhibit.ExhibitGoogleFeedsImporter._loadConfig = function() {
	if(Exhibit.ExhibitGoogleFeedsImporter._configs) { return; }
		else { Exhibit.ExhibitGoogleFeedsImporter._configs = {}; }
	
	// Process <div ex:role="rssImporterConfig">
	var f = function(index) { var a=$(this).attr('ex:role'); return a?a.toLowerCase()=='rssimporterconfig':false; }
	$('*').filter(f).each(function(index){
		// Basic config object
		var convConfig = {
			label :			'link',
			type :			'item',
			size :			4 ,
			historical :	false ,
			searchConfigs:	[] ,
			dateConfigs:	[]
		};

		// RSS target
		var _for = $(this).attr('ex:for');
		
		// Attempt to fetch attrs from HTML node
		var l = $(this).attr('ex:exhibitLabel');
		var t = $(this).attr('ex:exhibitType');
		var s = $(this).attr('ex:rssSize');
		var h = $(this).attr('ex:historical');
		if(l) { convConfig.label = l; }
		if(t) { convConfig.type = t; }
		if(s) { convConfig.size = (s) ? parseInt(s) : 4; }
		if(h) { convConfig.historical = (h) ? (h.toLowerCase().charAt(0)=='t') : false; }
		
		// Look for search keywork configs: process <ul>, populate searchConfigs[]
		$('ul',this).each(function(index){
			var create = $(this).attr('ex:create');
			var search = $(this).attr('ex:search');
			if(!create || !search) {
				SimileAjax.Debug.warning('Googlefeeds Importer config; UL element without ex:create or ex:search');
				return;
			}
			// Create config object
			var o = {
				'create': create ,  // Exhibit property to create
				'search': search.split(';') ,  // Array of feed entry fields to search
				'canonical' : [] ,
				'keywords' : [] , // Array of array of keywords (internal array are similies) AS REGEXPs!!!
				'keywordsClean' : []  // Array of array of keywords (internal array are similies) as strings
			};
			// Process <li>
			$('li',this).each(function(index){
					var title = $(this).attr("ex:title");
					var regexpPrefix = $(this).attr("ex:regexpPrefix");
					var arr = $(this).text().split(';');
					if(arr.length) { 
						var arr1 = [];
						for(var i=0;i<arr.length;i++) {
							if(arr[i].length) { arr1.push(arr[i]); }
						}						
						o.keywordsClean.push(arr1)
						o.canonical.push(title?title:arr1[0]);
						var arr2 = []
						for(var i=0;i<arr1.length;i++) { 
							if(regexpPrefix && arr1[i].substr(0,1)==regexpPrefix) {
								// Regular expression string
								arr2[i] = new RegExp(arr1[i].substr(1));
							} else {
								// Normal string
								var v = arr1[i].toLowerCase()
									.replace(/([\[\]\(\)\{\}\^\$\.\?\*\+\|\\])/g,"\\$1")
									.replace(' ','\\s+');
								arr2[i] = new RegExp('\\b'+v+'\\b'); 
							}
						}
						o.keywords.push(arr2);
					}
				}
			);
			convConfig.searchConfigs.push(o);
		});
		// Look for date translation configs: process <*> populating dateConfigs[]
		$('*',this).each(function(index) {
			var create = $(this).attr('ex:createDate');
			var using = $(this).attr('ex:using');
			if(!create || !using) { return; }
			var o = {
				'create': create,
				'using': using
			};
			convConfig.dateConfigs.push(o);
		});
		// Remove ex:rssImporterConfig element from DOM
		$(this).remove();
		
		// Store
		Exhibit.ExhibitGoogleFeedsImporter._configs[(_for)?_for:'*'] = convConfig;
	});
	//console.log(Exhibit.ExhibitGoogleFeedsImporter._configs);
}

Exhibit.ExhibitGoogleFeedsImporter.convertRSSJsonToExhibitJson = function(rssJson,convConfig) {
	var debug = $('#_exhibitRSSDebug_');
	
	// Now process rss json
	var json = { items: [] };
	var entries = rssJson.feed.entries;
	var debugStr = 'Keyword search debug info: '+(new Date().toString())+'\n';
	for(var i=0;i<entries.length;i++) { // For each RSS entry
		var entry = entries[i];
		var item = {}
		// Copy RSS fields to Exhibit item
		for(var k in entry) { item[k] = entry[k]; }
		// Create label/type in Exhibit item
		item['label'] = entry[convConfig.label];
		item['type'] = convConfig.type;
		item['_rssImporterMatched'] = [];
		// Keywords
		if(debug.length) { debugStr+='\nSearching feed entry '+i+'\n'; }
		for(var c=0;c<convConfig.searchConfigs.length;c++) {  // For each search config...
			var config = convConfig.searchConfigs[c];
			if(debug.length) { debugStr+=' Creating Exhibit item property \"'+config.create+'\"\n'; }
			for(var s=0;s<config.search.length;s++) { // ...search fields in rss entry...
				if(config.search[s] in entry) { // ...assuming field exists...
					var textToSearch = entry[config.search[s]].toLowerCase();
					if(debug.length) { debugStr+='  Searching feed field \"'+config.search[s]+'\" => \"'+textToSearch+'\"\n'; }
					for(var k=0;k<config.keywords.length;k++) { // ...looking for keywords,... 
						var similes = config.keywords[k];
						var canonical = config.canonical[k];
						for(var sm=0;sm<similes.length;sm++) { // ...each keyword had similes
							if(textToSearch.match(similes[sm])) {
								if(!item[config.create]) { item[config.create]=[]; }
								if(item[config.create].indexOf(canonical)<0) {
									item[config.create].push(canonical);  // Use first simile
									if(debug.length) { debugStr+='   Found: keyword \"'+canonical+'\" (\"'+config.keywordsClean[k][sm]+'\") in feed entry '+i+'\n'; }
									item._rssImporterMatched.push(config.keywordsClean[k][sm]);
									sm = similes.length;  // Don't search for more similes
								} else {
									if(debug.length) { debugStr+='   Ignored: keyword \"'+canonical+'\" (\"'+config.keywordsClean[k][sm]+'\") in feed entry '+i+' (already found)\n'; }
								}
							}
						}
					}
				} else {
					if(debug.length) { debugStr+='** WARNING ** No field \"'+config.search[s]+'\" found in feed entry '+i+'\n'; }
				}
			}
		}
		
		for(var d in convConfig.dateConfigs) {
			//alert(convConfig.dateConfigs[d].using);
			var dt = convConfig.dateConfigs[d];
			var rawDate = entry[dt.using];
			if(rawDate) {
				try {
					//PW: alteration of Date creation. 2014-01-06
					var dateObj = new Date(Date.parse(rawDate));
					var f = function(v) { return (v<10?'0':'')+v; }
					var iso8601 = dateObj
						.getUTCFullYear()+'-'
						+f(dateObj.getUTCMonth()+1)+'-'
						+f(dateObj.getUTCDate())+'T'
						+f(dateObj.getUTCHours())+':'
						+f(dateObj.getUTCMinutes())+':'
						+f(dateObj.getUTCSeconds())+'Z';
						//alert(dt.create);
					item[dt.create] = iso8601;
					if(debug.length) { debugStr+='Converted date in feed entry '+i+' (\"'+dt.using+'\" as \"'+dt.create+'\")\n'; }
				}catch(e) { if(debug.length) { debugStr+= e + '** WARNING ** Failed to convert date in feed entry '+i+' ('+dt.using+')\n'; } }
			}
		}
		
		// Add
		json.items.push(item);
	}
	
	// Add 'properties' for each ex:createDate
	if(convConfig.dateConfigs && convConfig.dateConfigs.length) {
		json['properties'] = {};
		for(d in convConfig.dateConfigs) {
			json.properties[convConfig.dateConfigs[d].create] = { 'valueType' : 'date' };
		}
	}
	
	if(debug.length) { debug.append(debugStr); }
	//console.log(json);
	return json;
}