import React, {useEffect, useState} from 'react';
import {Circle, MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export function Map() {
    const [cars, setCars] = useState([]);
    const [radius, setRadius] = useState(null);
    const [distance, setDistance] = useState(null);
    //  Create the Icon
    const LeafIcon = L.Icon.extend({
        options: {}
    });

    const blueIcon = new LeafIcon({
            iconUrl:
                "https://www.google.com/maps/vt/icon/name=assets/icons/spotlight/spotlight_pin_v4_outline-2-medium.png,assets/icons/spotlight/spotlight_pin_v4-2-medium.png,assets/icons/spotlight/spotlight_pin_v4_dot-2-medium.png&highlight=0000ff,0000ff,b31412?scale=1"
        }),
        greenIcon = new LeafIcon({
            iconUrl:
                "https://www.google.com/maps/vt/icon/name=assets/icons/spotlight/spotlight_pin_v4_outline-2-medium.png,assets/icons/spotlight/spotlight_pin_v4-2-medium.png,assets/icons/spotlight/spotlight_pin_v4_dot-2-medium.png&highlight=c5221f,00ff00,b31412?scale=1"
        }),
        redIcon = new LeafIcon({
            iconUrl:
                "https://www.google.com/maps/vt/icon/name=assets/icons/spotlight/spotlight_pin_v4_outline-2-medium.png,assets/icons/spotlight/spotlight_pin_v4-2-medium.png,assets/icons/spotlight/spotlight_pin_v4_dot-2-medium.png&highlight=c5221f,ff0000,b31412?scale=1"
        });
    useEffect(() => {
        async function dataFetch() {
            const result = await fetch('http://localhost:8080/api/cars');
            let data = await result.json();
            const response = [];
            data.forEach(i => {
                return response.push({
                    id: i.id,
                    lat: i.lat,
                    lng: i.lng,
                    dist: i.dist,
                    station: i.station,
                    registrationNumber: i.registrationNumber,
                    color: i.station === 1 ? 'green' : 'blue'
                })
            })
            setCars(response);
        }

        setTimeout(() => {
            dataFetch();
        }, 1000);
    }, [cars]);
    useEffect(() => {
        setRadius(100);
    }, [radius]);
    useEffect(() => {
        setDistance(1);
    }, [distance]);
    // useEffect(() => {
    //     async function radiusFetch() {
    //         const result = await fetch('http://localhost:8080/api/system-coonfigurations/by-code/RADIUS');
    //         let data = await result.json();
    //         setRadius(data);
    //     }
    //
    //     radiusFetch();
    // }, [radius]);
    // useEffect(() => {
    //     async function distanceFetch() {
    //         const result = await fetch('http://localhost:8080/api/system-coonfigurations/by-code/DISTANCE');
    //         let data = await result.json();
    //         setDistance(data);
    //     }
    //
    //     distanceFetch();
    // }, [distance]);
    L.Marker.prototype.options.icon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    // UAIC Iasi coordinates
    const position = [47.1745, 27.5725]
    if (radius == null || distance == null) {
        return (<h3>Check backend configuration</h3>)
    }
    if (!cars || !cars.length) {
        return (<h3>Loading...</h3>)
    }
    return (
        <>
            <section className='map-component'>
                <div className='map'>
                    <MapContainer center={cars && cars.length ? [cars[0].lat, cars[0].lng] : position} zoom={15}
                                  scrollWheelZoom={true}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {radius && distance && cars ? cars.map((car, i) => (
                            <>
                                <Marker key={i} position={[car.lat + 0.0008, car.lng - 0.0003]}
                                        icon={car.dist < distance ? redIcon : car.color === 'green' ? greenIcon : blueIcon}>
                                    <Popup key={i + 1000}>
                                        <div className='leaflet-control-attribution'>Registration
                                            number: {car.registrationNumber}</div>
                                        <div className='leaflet-control-attribution'>Distance to front
                                            obstacle: {car.dist}</div>
                                        <div className='leaflet-control-attribution'>Color must be {car.dist < distance ? 'red' : 'original'}</div>
                                    </Popup>
                                    <Circle key={i + 100} center={{lat: car.lat, lng: car.lng}} radius={radius} fillColor='green'/>
                                </Marker>
                            </>
                        )) : (<p>Loading...</p>)}
                    </MapContainer>
                </div>
            </section>
        </>
    )
}
