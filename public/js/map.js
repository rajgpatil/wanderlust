

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // style: 'mapbox://styles/mapbox/dark-v11',
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// console.log(listing.geometry.coordinates);

const marker1 = new mapboxgl.Marker({color: 'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`))
        .addTo(map);

// Icon
// const el = document.createElement('div');
//  const width = 40;
//  const height = 40;
//  el.className = 'marker';
//  el.style.backgroundImage = `url(https://seeklogo.com/images/A/airbnb-logo-62A2938175-seeklogo.com.png)`;
//  el.style.width = `${width}px`;
//  el.style.height = `${height}px`;
//  el.style.backgroundSize = '100%'
//  new mapboxgl.Marker(el)
//         .setLngLat(listing.geometry.coordinates)
//         .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`))
//         .addTo(map);