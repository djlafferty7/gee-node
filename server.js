const ee = require('@google/earthengine');
const express = require('express');
const privateKey = require('./.private-key.json');
const port = process.env.PORT || 3000;

// Define endpoint at /mapid.
const app = express().get('/mapid', (_, response) => {

    //Terrain Dataset
    // const srtm = ee.Image('CGIAR/SRTM90_V4');
    // const slope = ee.Terrain.slope(srtm);
    // slope.getMap({ min: 0, max: 60 }, ({ mapid }) => response.send(mapid));

    //Weather Dataset
    // var dataset = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY")
    //     .filter(ee.Filter.date('2020-07-01', '2020-07-02'));        
    // var visualization = {
    //     bands: ['temperature_2m'],
    //     min: 250.0,
    //     max: 320.0,
    //     palette: [
    //         "#000080", "#0000D9", "#4000FF", "#8000FF", "#0080FF", "#00FFFF",
    //         "#00FF80", "#80FF00", "#DAFF00", "#FFFF00", "#FFF500", "#FFDA00",
    //         "#FFB000", "#FFA400", "#FF4F00", "#FF2500", "#FF0A00", "#FF00FF",
    //     ]
    // };
    // dataset.getMap(visualization, ({ mapid }) => response.send(mapid));

    //Crops Dataset
    var dataset = ee.Image('USGS/GFSAD1000_V1');
    var cropMask = dataset.select('landcover');
    var cropMaskVis = {
        min: 0.0,
        max: 5.0,
        palette: ['black', 'orange', 'brown', '02a50f', 'green', 'yellow'],
    };
    cropMask.getMap(cropMaskVis, ({ mapid }) => response.send(mapid));
});

console.log('Authenticating Earth Engine API using private key...');
ee.data.authenticateViaPrivateKey(
    privateKey,
    () => {
        console.log('Authentication successful.');
        ee.initialize(
            null, null,
            () => {
                console.log('Earth Engine client library initialized.');
                app.listen(port);
                console.log(`Listening on port ${port}`);
            },
            (err) => {
                console.log(err);
            });
    },
    (err) => {
        console.log(err);
    });
