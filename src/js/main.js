import * as THREE from 'three';
import * as topojson from 'topojson-client';

// Import custom js
import { canvas, camera, renderer, controls } from './scene.js';

// Import stylesheet(s)
import '../css/style.css';

// Import data sets
import worldHappiness from '../../datasets/world-happiness.json';

// Import world file for topojson
import world from '../../datasets/world.json';

// <span> tag displaying selected year
let yearText = document.getElementById('yearText');

// <input> tag used for year selection
let yearSlider = document.getElementById('yearSlider');

// Variable that holds the current selected year (default is 2018)
let yearSliderValue = 2018;

// Object that holds the world happiness data from the selected year as yearWorldHappiness.data
let yearWorldHappiness = {
    dataInteral: worldHappiness[yearSliderValue],
    dataListener: function (val) {},
    set data(val) {
        this.dataInteral = val;
        this.dataListener(val);
    },
    get data() {
        return this.dataInteral;
    },
    registerListener: function (listener) {
        this.dataListener = listener;
    },
};

// Event listener that listens to the range slider
yearSlider.addEventListener('input', function (e) {
    // Get slider value, update data and <span>
    yearSliderValue = yearSlider.value;
    yearWorldHappiness.data = worldHappiness[yearSliderValue];
    yearText.innerHTML = yearSliderValue;
});

// Event listener that listens to the year data
yearWorldHappiness.registerListener(function (val) {
    console.log(
        '%c Data has changed: year = ' + yearSliderValue,
        'color:green; font-weight: 900;'
    );
});
