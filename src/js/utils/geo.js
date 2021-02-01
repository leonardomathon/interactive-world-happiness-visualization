import { pointInPolygon } from './polygon.js';

// Import world file for topojson
import world from '../../../datasets/geoworld.json';

// Input are 3 sides of a face. Returns the country hovered over
export function findCountry(a, b, c, worldSize) {
    let latRads, lngRads;
    // Compute the center of the face (average)
    const centerPoint = {
        x: (a.x + b.x + c.x) / 3,
        y: (a.y + b.y + c.y) / 3,
        z: (a.z + b.z + c.z) / 3,
    };

    // Fancy function that convers center to lat and lng
    latRads = Math.acos(centerPoint.y / worldSize);
    lngRads = Math.atan2(centerPoint.z, centerPoint.x);

    // lng needs to be rotated 180 degrees
    const coords = {
        lat: (Math.PI / 2 - latRads) * (180 / Math.PI),
        lng: (Math.PI - lngRads) * (180 / Math.PI) - 180,
    };

    // Loop over all countries in geoworld.json
    for (let i = 0; i < world.features.length; i++) {
        // Check if center point is in polygon(s) of feature
        if (world.features[i].geometry.type == 'Polygon') {
            if (
                pointInPolygon(world.features[i].geometry.coordinates[0], [
                    coords.lng,
                    coords.lat,
                ])
            ) {
                return {
                    id: world.features[i].id,
                    name: world.features[i].properties.name,
                    index: i,
                };
            }
        } else {
            for (
                let j = 0;
                j < world.features[i].geometry.coordinates.length;
                j++
            ) {
                if (
                    pointInPolygon(
                        world.features[i].geometry.coordinates[j][0],
                        [coords.lng, coords.lat]
                    )
                ) {
                    return {
                        id: world.features[i].id,
                        name: world.features[i].properties.name,
                        index: i,
                    };
                }
            }
        }
    }

    return null;
}

// Checks if country is drawn on the globe
export function isCountryDrawn(alpha3) {
    for (let i = 0; i < world.features.length; i++) {
        if (world.features[i].id == alpha3) {
            return true;
        }
    }
    return false;
}
