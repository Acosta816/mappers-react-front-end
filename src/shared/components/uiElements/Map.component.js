import React, { useRef, useEffect } from 'react';

import './Map.styles.css';

const Map = props => {

    const mapRef = useRef();

    const { center, zoom } = props;

    useEffect(() => {
        const myMap = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });

        const myMarker = new window.google.maps.Marker({ position: center, map: myMap }); //creating a visual google maps "location Marker" that will be rendered onto the myMap
    }, [center, zoom]
    );



    return (
        <div ref={mapRef} className={`map ${props.className}`} style={props.style}>

        </div>
    )
}

export default Map;
