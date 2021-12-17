let map, tileLayer;
map = L.map("migrantdeaths");

// Use "voyager" map (bluer water, sharper lines)
tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', 
  subdomains: 'abcd', 
  maxZoom: 20
}).addTo(map);

map.setView([45, 15], 4);

/*
// Other map possibilities
// Dark background from jawg.io
tileLayer = L.tileLayer('https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
  accessToken: 'rzvDM4buOUYWYEWhWG0sASl0M2b3TZGfMHq8P6Po36jfNyYxr49FJn06XBgL5jmX'
}).addTo(map);

// Default Leaflet map
tileLayer = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://carto.com/attribution'>CARTO</a>", 
  subdomains: "abcd", 
  maxZoom: 18}).addTo(map);
*/

// Define the features array.
let migrantfeatures
let markersarray = [];
$.getJSON("migrant deaths drowned extract.geojson", function(data){
  // Define the Leaflet layer.
  let migrantlayer;
  // Iterate over the .features property of the GeoJSON object to
  // create an array of objects (features), with every object’s
  // properties as noted.
  migrantfeatures = data.features.map(function(feature){
    // This return returns an object.
    return {
      Event: feature.properties.Event_id,
      Year: feature.properties.Year,
      dead: feature.properties.dead,
      missing: feature.properties.missing,
      dead_and_missing: feature.properties.dead_and_missing,
      location: feature.properties.location,
      description: feature.properties.description,
      source: feature.properties.source,
      source_url: feature.properties.source_url,
      // Create an L.latLng object out of the GeoJSON coordinates.
      // Remember that in GeoJSON, the coordinates are reversed
      // (longitude, then latitude).
      latLng: L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
    };
  });

 // Iterate over the object to create red circle markers with popups showing each event_ID
  let popup;
  migrantfeatures.forEach(function(x){
   if (x.source_url) {
    popup = "Event: " + x.Event + "<br>Year: " + x.Year + "<br>Dead: " + x.dead + "<br>Missing: " + x.missing + "<br>Dead AND missing: " + x.dead_and_missing + "<br>Location: " + x.location + "<br>Description: " + x.description + "<br>Source: " + x.source + "<br>URL: " + "<a href='" + x.source_url + "'>Link</a>";
    marker = L.circleMarker(x.latLng, {radius: 0.8, color: "red"}).bindPopup(popup);
    markersarray.push(marker);
    marker.addTo(map);
    }
   else {
    popup = "Event: " + x.Event + "<br>Year: " + x.Year + "<br>Dead: " + x.dead + "<br>Missing: " + x.missing + "<br>Dead AND missing: " + x.dead_and_missing + "<br>Location: " + x.location + "<br>Description: " + x.description + "<br>Source: " + x.source;
    marker = L.circleMarker(x.latLng, {radius: 0.8, color: "red"}).bindPopup(popup);
    markersarray.push(marker);
    marker.addTo(map);
    }
  });
});

// Define and assign a Markdown-it renderer, and open the introductory information to left of map
let md;
md = window.markdownit({html: true}).use(window.markdownitFootnote);
// Load the Markdown file for the main content next to the map, with jQuery.
$.ajax({
  url: "migrantdeaths.md",
  success: function(markdown){
    // Convert the Markdown to HTML.
    let html1;
    html1 = md.render(markdown);
    // Print the HTML to #content using jQuery.
    $("#content").html(html1);
  }
});

// Create an array of each markdown file, and run a function to cycle through them to associate them and load them 
// with their relevant tab. Then, upon click of the nav link, pan the map to the coordinates of that event and show a popup (or migrant routes).
let naveventsArray = ["event44", "event400", "event1014", "event124", "migratoryroutes"];
naveventsArray.forEach(function(tab){
// Create a variable tab that has the name as a string.
$.ajax({ 
  url: tab + ".md",
  success: function(markdown){
    let markdowncontent;
    markdowncontent = md.render(markdown);
    $("#" + tab).html(markdowncontent);
    
    // Create a layergroup that will contain all the polylines to use for the migrant routes.
    migroutesgroup = L.layerGroup();
    // Create the polylines with relevant coordinates for each route.
    let westmed = L.polyline([[33.079460, -5.025796], [40.274287, -3.633758]], {color: '#0A1416', opacity: .75, snakingSpeed: 350}).addTo(migroutesgroup);
    let centralmed = L.polyline([[34.957995, 9.121944], [39.707187, 11.760423]], {color: '#0A1416', opacity: .75, snakingSpeed: 350}).addTo(migroutesgroup);
    let centralmed2 = L.polyline([[30.826781, 20.555354], [38.134557, 16.245838]], {color: '#0A1416', opacity: .75, snakingSpeed: 350}).addTo(migroutesgroup);
    let eastmed = L.polyline([[39.639538, 31.021322], [41.376809, 24.677058]], {color: '#0A1416', opacity: .75, snakingSpeed: 350}).addTo(migroutesgroup);
    let westbalkan = L.polyline([[39.653813, 23.636964], [46.601808, 16.420044]], {color: '#0A1416', opacity: .75, snakingSpeed: 350}).addTo(migroutesgroup);
    let easternbords = L.polyline([[49.365831, 30.711807], [48.761168, 21.477130]], {color: '#0A1416', opacity: .75, snakingSpeed: 350}).addTo(migroutesgroup);
    let easternbords2 = L.polyline([[53.525207, 28.425125], [53.289437, 21.565079]], {color: '#0A1416', opacity: .75, snakingSpeed: 350}).addTo(migroutesgroup);
    // polylineDecorators for arrowheads. Add them to a separate layer, so as to allow them to NOT snake in but appear simultaneously.
    migroutesArrowheads = L.layerGroup();
    let polydecwestmed = L.polylineDecorator(westmed, {patterns: [{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: '#0A1416', fillOpacity: 1, endOffset: 20}})}]}).addTo(migroutesArrowheads);
    let polydeccentralmed = L.polylineDecorator(centralmed, {patterns: [{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: '#0A1416', fillOpacity: 1}})}]}).addTo(migroutesArrowheads);
    let polydeccentralmed2 = L.polylineDecorator(centralmed2, {patterns: [{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: '#0A1416', fillOpacity: 1}})}]}).addTo(migroutesArrowheads);
    let polydeceastmed = L.polylineDecorator(eastmed, {patterns: [{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: '#0A1416', fillOpacity: 1}})}]}).addTo(migroutesArrowheads);
    let polydecwestbalkan = L.polylineDecorator(westbalkan, {patterns: [{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: '#0A1416', fillOpacity: 1}})}]}).addTo(migroutesArrowheads);
    let polyeasternbords = L.polylineDecorator(easternbords, {patterns: [{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: '#0A1416', fillOpacity: 1}})}]}).addTo(migroutesArrowheads);
    let polyeasternbords2 = L.polylineDecorator(easternbords2, {patterns: [{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: '#0A1416', fillOpacity: 1}})}]}).addTo(migroutesArrowheads);
    
    // On click of nav pill/tab, pan to latitude and longitude of given event.
    // First get the clicked tab id (create a function that grabs the number from the id using a regular expression), then 
    // match that number to the event in the "migrantfeatures" array of objects defined earlier in this program and panTo that
    // event coordinates. Finally, open a popup of information for that event.
    $("#nav-tabs a[href='#" + tab + "']").click(function(){
      if (tab === 'migratoryroutes') {
        map.closePopup();
        map.flyTo([45, 15], 4);
        migroutesArrowheads.addTo(map);
        migroutesgroup.addTo(map).snakeIn();
      }
      else {
      map.removeLayer(migroutesgroup);
      map.removeLayer(migroutesArrowheads);
      number = tab.split(/([0-9]+)/);
      number = number[1];
      number-=1;
      let tabevent = markersarray[number];
      map.flyTo(tabevent._latlng, 6);
      tabevent.openPopup();
      }
    });
  }
});
});