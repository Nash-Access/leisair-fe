import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 51.505,
    lng: -0.09
};

interface MapComponentProps {
    mapApiKey: string;
}

const MapComponent = ({ mapApiKey }: MapComponentProps) => {
    return (
        <LoadScript googleMapsApiKey={mapApiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
            >
                {/* Additional map controls can be added here */}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
