import hotkeys from 'hotkeys-js';
import { jsPanel } from 'jspanel4';

// Import custom js
import { initGlobe, updateGlobe } from './globe.js';
import { composer, toggleSoblePass, toggleFilmPass } from './postprocessing.js';

// Import data sets
import worldHappiness from '../../datasets/world-happiness.json';

// Import world file for topojson
import world from '../../datasets/geoworld.json';

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

// <input> tag used to search countries
let searchInput = document.getElementById('searchCountry');

// Country that is searched
let searchedCountry;

// Config object that holds value of preprocessing effects
let preprocessingEffects = {
    outlineMode: false,
    filmMode: true,
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
    updateGlobe(yearWorldHappiness);
});

// Event listener that listent to the outline mode enable checkbox
outlineCheckbox.addEventListener('change', function (e) {
    preprocessingEffects.outlineMode = !preprocessingEffects.outlineMode;
    toggleSoblePass(preprocessingEffects);
});

// Event listener that listent to the film mode enable checkbox
filmCheckbox.addEventListener('change', function (e) {
    preprocessingEffects.filmMode = !preprocessingEffects.filmMode;
    toggleFilmPass(preprocessingEffects);
});

// Event listener (from hotkeys-js) that listens to the combination ctrl+o or com+o
hotkeys('ctrl+o', function (event, handler) {
    event.preventDefault();
    outlineCheckbox.checked = !outlineCheckbox.checked;
    preprocessingEffects.outlineMode = !preprocessingEffects.outlineMode;
    toggleSoblePass(preprocessingEffects);
});

// Event listener (from hotkeys-js) that listens to the combination ctrl+k or com+k
hotkeys('ctrl+k', function (event, handler) {
    event.preventDefault();
    filmCheckbox.checked = !filmCheckbox.checked;
    preprocessingEffects.filmMode = !preprocessingEffects.filmMode;
    toggleFilmPass(preprocessingEffects);
});

hotkeys('ctrl+f', function (event, handler) {
    event.preventDefault();
    searchInput.focus();
});

// Event listener that listens to searching
searchInput.addEventListener('keydown', function (e) {});

// Even listener that listens to click to open current dataset
showDataset.addEventListener('click', function (e) {
    jsPanel.create({
        theme: {
            bgPanel: '#000',
            bgContent: '#0f0f0f',
            colorHeader: '#fff',
            colorContent: `#fff`,
        },
        panelSize: {
            width: () => window.innerWidth * 0.3,
            height: '50vh',
        },
        headerTitle:
            'World Happiness report ' + yearSliderValue + ' - JSON Dataset',
        dragit: {
            cursor: 'default',
        },
        maximizedMargin: [25, 25, 25, 25],
        closeOnEscape: true,
        data: JSON.stringify(yearWorldHappiness, null, '\t'),
        callback: function () {
            this.content.innerHTML = `<pre><code>${this.options.data}</code></pre>`;
        },
    });
});

initGlobe(yearWorldHappiness);
