// import React from 'react';
// import { GoogleMap, LoadScript } from '@react-google-maps/api';

// const containerStyle = {
//     width: '100%',
//     height: '100%'
// };

// const center = {
//     lat: 51.505,
//     lng: -0.09
// };

// interface MapComponentProps {
//     mapApiKey: string;
// }

// const MapComponent = ({ mapApiKey }: MapComponentProps) => {
//     return (
//         <LoadScript googleMapsApiKey={mapApiKey}>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={center}
//                 zoom={12}
//             >
//                 {/* Additional map controls can be added here */}
//             </GoogleMap>
//         </LoadScript>
//     );
// };

// export default MapComponent;

const svgIcon = L.divIcon({
    html: `
    <svg height="24px" width="40px" role="img" viewBox="0 0 384 512">
    <path d="M192 0C85.97 0 0 85.97 0 192c0 77.41 26.97 99.03 172.3 309.7c9.531 13.77 29.91 13.77 39.44 0C357 291 384 269.4 384 192C384 85.97 298 0 192 0zM192 271.1c-44.13 0-80-35.88-80-80S147.9 111.1 192 111.1s80 35.88 80 80S236.1 271.1 192 271.1z"></path>
</svg>
`,
    className: "svg-icon",
    iconSize: [24, 40],
    iconAnchor: [24, 20]
  });

// components/LeafletMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '~/utils/api';
import Router from 'next/router';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 51.505,
    lng: -0.09
};

const MapComponent = () => {
    const locationsFromDb = api.cameraLocations.getAll.useQuery()
    return (
        <MapContainer style={containerStyle} center={center} zoom={12} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {locationsFromDb.data?.map((location) => (
                <Marker key={location._id.toString()} icon={svgIcon} position={[location.latitude, location.longitude]}>
                    <Popup>
                        Name: {location.name}
                        <button onClick={() => void Router.push(`/locations/${location._id.toString()}`)}>
                            View
                        </button>
                    </Popup>
                </Marker>
            ))}

            <Marker icon={svgIcon} position={center}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            {/* Additional map controls can be added here */}
        </MapContainer>
    );
};

export default MapComponent;

