import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-timedimension";
import '../../node_modules/leaflet-timedimension/dist/leaflet.timedimension.control.min.css';
import data from '../data/test.json';

const MapComponent = () => {
    useEffect(() => {
        const map = L.map('map', {
            zoom: 14,
            fullscreenControl: true,
            timeDimensionControl: true,
            timeDimensionControlOptions: {
                timeSliderDragUpdate: true,
                loopButton: true,
                autoPlay: true,
                playerOptions: {
                    transitionTime: 1000,
                    loop: true
                }
            },
            timeDimension: true,
            center: [36.73835, -4.4214296]
        });

        const osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        });
        osmLayer.addTo(map);

        const addGeoJSONLayer = (map, data) => {
            const icon = L.icon({
                iconUrl: '/logo192.png',
                iconSize: [50, 50],
                iconAnchor: [11, 11]
            });

            const geoJSONLayer = L.geoJSON(data, {
                pointToLayer: function (feature, latLng) {
                    if (feature.properties.hasOwnProperty('last')) {
                        return new L.Marker(latLng, {
                            icon: icon
                        });
                    }
                    return L.circleMarker(latLng);
                }
            });

            const geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
                updateTimeDimension: true,
                duration: 'PT2M',
                updateTimeDimensionMode: 'replace',
                addlastPoint: true
            });

            geoJSONLayer.addTo(map);
            geoJSONTDLayer.addTo(map);
        };

        addGeoJSONLayer(map, data);

    }, []);

    return (
        // leaflet looks for a div container with id="map" as the "map container"
        <div style={{ height: "100vh" }} id="map" >
            <div>
                {/* Your map rendering component */}
                {data ? (
                    <p>GeoJSON data loaded successfully! </p>

                    /* Render your map using the loaded geojsonData */
                ) : (
                    <p>Loading GeoJSON data...</p>
                )}
            </div>
        </div>

    );
};

export default MapComponent;
