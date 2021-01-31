import hotkeys from 'hotkeys-js';

// Import custom js
import { createDatasetPanel, createGPUHintPanel } from './ui/panels.js';
import {
    initGlobe,
    updateGlobeTexture,
    toggleHover,
    hoveredCountry,
    setClickedCountry,
    resetClickedCountry,
    searchedCountry,
} from './webgl/globe/globe.js';
import { toggleSoblePass, toggleFilmPass } from './fx/postprocessing.js';

// Import data sets
import worldHappiness from '../../datasets/world-happiness.json';

// <span> tag displaying selected year
let yearText = document.getElementById('yearText');

// <span> tag for opening dataset
let showDataset = document.getElementById('showDataset');

// <input> tag used for year selection
let yearSlider = document.getElementById('yearSlider');

// Variable that holds the current selected year (default is 2018)
let yearSliderValue = 2018;

// Variable that holds all the labels from the yearSlider
let yearSliderLabels = document.getElementsByClassName('range-label-list')[0]
    .children;

// <input> tag used to toggle outline mode
let outlineCheckbox = document.getElementById('clusteringToggle');

// <input> tag used to toggle outline mode
let filmCheckbox = document.getElementById('filmToggle');

// <input> tag used to toggle outline mode
let countryHoverCheckbox = document.getElementById('countryHoverToggle');

// <input> tag used to search countries
let searchInput = document.getElementById('searchCountry');

// Country that the user selected
let hoveredCountryTag = document.getElementById('hoveredCountry');

// Config object that holds value of preprocessing effects
let preprocessingOptions = {
    outlineMode: false,
    filmMode: true,
};

let renderingOptions = {
    countryHover: false,
};

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

// Make checkboxes unfocusable
outlineCheckbox.onfocus = function () {
    this.blur();
};

filmCheckbox.onfocus = function () {
    this.blur();
};

countryHoverCheckbox.onfocus = function () {
    this.blur();
};

initGlobe(yearWorldHappiness);

// Event listeners that listen to click events on the labels
for (let i = 0; i < yearSliderLabels.length; i++) {
    // If a range slider label is clicked, update yearSlider value
    yearSliderLabels[i].addEventListener('click', function (e) {
        // Update the slider
        yearSlider.value = 2015 + i;
        // Notify the event listener
        yearSlider.dispatchEvent(new Event('change'));
        // Update UI
        yearText.innerHTML = yearSliderValue;
    });
}

// Event listener that listens to the range slider
yearSlider.addEventListener('change', function (e) {
    // Get slider value, update data and UI
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
    updateGlobeTexture(yearWorldHappiness);
});

// Event listener that listent to the outline mode enable checkbox
outlineCheckbox.addEventListener('change', function (e) {
    preprocessingOptions.outlineMode = !preprocessingOptions.outlineMode;
    toggleSoblePass(preprocessingOptions);
});

// Event listener that listent to the film mode enable checkbox
filmCheckbox.addEventListener('change', function (e) {
    preprocessingOptions.filmMode = !preprocessingOptions.filmMode;
    toggleFilmPass(preprocessingOptions);
});

countryHoverCheckbox.addEventListener('change', function (e) {
    if (!renderingOptions.countryHover) {
        createGPUHintPanel();
    }
    renderingOptions.countryHover = !renderingOptions.countryHover;
    toggleHover();
});

// Event listener that listens to searching
searchInput.addEventListener('keydown', function (e) {});

// Even listener that listens to click to open current dataset
showDataset.addEventListener('click', function (e) {
    createDatasetPanel(yearSliderValue, yearWorldHappiness);
});

// Remove the loading screen once the whole page is loaded
document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById('loader').remove();
});

// Event listener that listens to hoveredCountry change and updates UI
hoveredCountry.registerListener(function (val) {
    console.log('Value of hovered country has changed!');
    if (hoveredCountry.data.name != '') {
        hoveredCountryTag.innerHTML = `${hoveredCountry.data.id} - ${hoveredCountry.data.name}`;
    } else {
        hoveredCountryTag.innerHTML = `${hoveredCountry.data.id}`;
    }
});

searchedCountry.registerListener(function (val) {
    setClickedCountry(searchedCountry.data);
    // Update hovered country
    hoveredCountry.data = {
        id: searchedCountry.data.id,
        name: searchedCountry.data.name,
    };
});

// Event listeners (from hotkeys-js) that listen to keyboard combinations
hotkeys('ctrl+o', function (event, handler) {
    event.preventDefault();
    outlineCheckbox.checked = !outlineCheckbox.checked;
    preprocessingOptions.outlineMode = !preprocessingOptions.outlineMode;
    toggleSoblePass(preprocessingOptions);
});

hotkeys('ctrl+k', function (event, handler) {
    event.preventDefault();
    filmCheckbox.checked = !filmCheckbox.checked;
    preprocessingOptions.filmMode = !preprocessingOptions.filmMode;
    toggleFilmPass(preprocessingOptions);
});

hotkeys('ctrl+f', function (event, handler) {
    event.preventDefault();
    searchInput.focus();
});

hotkeys('ctrl+h', function (event, handler) {
    event.preventDefault();
    if (!renderingOptions.countryHover) {
        createGPUHintPanel();
    }
    countryHoverCheckbox.checked = !countryHoverCheckbox.checked;
    renderingOptions.countryHover = !renderingOptions.countryHover;
    toggleHover();
});

hotkeys('esc', function (event, handler) {
    event.preventDefault();
    resetClickedCountry();
});

hotkeys('enter', function (event, handler) {
    searchedCountry.data = {
        id: 'BRA',
        name: 'Netherlands',
        index: null,
    };
});
