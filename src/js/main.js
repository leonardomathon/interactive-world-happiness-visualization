import hotkeys from 'hotkeys-js';
import * as clm from 'country-locale-map';

// Import custom js
import {
    createDatasetPanel,
    createBarChartPanel,
    createScatterPanel,
    createLineChartPanel,
    createGPUHintPanel,
    createErrorPanel,
} from './ui/panels.js';
import {
    initGlobe,
    updateGlobeTexture,
    toggleHover,
    hoveredCountry,
    clickedCountry,
    setClickedCountry,
    resetClickedCountry,
    searchedCountry,
} from './webgl/globe/globe.js';
import { isCountryDrawn } from './utils/geo.js';
import { toggleSoblePass, toggleFilmPass } from './fx/postprocessing.js';

// Import charts
import {
    initBarChart,
    removeBarChart,
    updateBarChartData,
} from './graphs/chart.js';
import {
    initScatter,
    countryFocusOff,
    countryFocusOn,
} from './graphs/scatter.js';
import { initLineChart, removeLineChart } from './graphs/linechart';

// Import data sets
import worldHappiness from '../../datasets/world-happiness.json';
import countriesOfTheWorld from '../../datasets/countries-of-the-world.json';

// <span> tag displaying selected year
let yearText = document.getElementById('yearText');

// <span> tag for opening dataset
let showDataset = document.getElementById('showDataset');

// <input> tag used for year selection
let yearSlider = document.getElementById('yearSlider');

// buttons for category selection
let buttons = document.getElementById('scatterButtons');

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

// Container holding search match
let searchMatches = document.getElementById('searchMatches');

// Block that displays the search matche
let searchMatch = document.getElementById('searchMatch');

// Button to select country from search
let searchMatchCountry = document.getElementById('searchMatchCountry');

// Fuzzy search country name and alpha3 value
let fuzzySearch;

// Country that the user selected
let hoveredCountryTag = document.getElementById('hoveredCountry');

// Variables for the countryInfomation
let countryPopulationTag = document.getElementById('countryPopulationTag');
let countryDensityTag = document.getElementById('countryDensityTag');
let countryAreaTag = document.getElementById('countryAreaTag');
let countyGDPTag = document.getElementById('countyGDPTag');

// Toggle buttons for all graphs
let barChartToggle = document.getElementById('barChartToggle');
let scatterPlotToggle = document.getElementById('scatterPlotToggle');
let lineChartToggle = document.getElementById('lineChartToggle');

// States for all toggle buttons
let barChartState = false;
let scatterPlotState = false;
let lineChartState = false;

// HTML code for the scatter panel
let scatterButtons = document.getElementById('scatterButtons');
scatterButtons.classList.remove('scatterButtonsInvisible');
scatterButtons.remove();

// Panels for each visualization
let barChartPanel = createBarChartPanel('Bar chart', '<div id="chart"></div>');
barChartPanel.classList.add('panelInvisible');

let scatterPanel = createScatterPanel(
    'Scatterplot',
    '<div id="scatter"></div>',
    new XMLSerializer().serializeToString(scatterButtons)
);
scatterPanel.classList.add('panelInvisible');

let lineChartPanel = createLineChartPanel(
    'Line chart',
    '<div id="lineChart"></div>'
);
lineChartPanel.classList.add('panelInvisible');

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

    if (hoveredCountry.data.id != 'No country selected') {
        updateBarChartData(
            worldHappiness,
            yearSliderValue,
            hoveredCountry.data.id
        );
    }
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
searchInput.addEventListener('keydown', function (e) {
    if (searchInput.value != '') {
        fuzzySearch = clm.getCountryByName(searchInput.value, true);
    } else {
        searchMatch.remove();
        fuzzySearch = undefined;
    }
    if (fuzzySearch != undefined) {
        searchMatches.appendChild(searchMatch);
        searchMatchCountry.innerHTML = fuzzySearch.name;
    } else {
        searchMatch.remove();
    }
});

// Even listerner that listens to search match click
searchMatch.addEventListener('click', function (e) {
    // Reset input, remove search result
    searchInput.value = '';
    searchMatch.remove();

    // Check if country has alpha 3
    if (fuzzySearch && isCountryDrawn(fuzzySearch.alpha3)) {
        console.log('test');
        console.log('Fuzzy: ', fuzzySearch.name);
        searchedCountry.data = {
            id: fuzzySearch.alpha3,
            name: fuzzySearch.name,
            index: null,
        };
        barChartPanel.setHeaderTitle(
            `Bar chart of ${hoveredCountry.data.name}`
        );
        lineChartPanel.setHeaderTitle(
            `Line chart of ${hoveredCountry.data.name}`
        );
    } else {
        createErrorPanel(
            'Country not found',
            'The country you searched for is not in our dataset and could thus not be found'
        );
    }
});

// Even listener that listens to click to open current dataset
showDataset.addEventListener('click', function (e) {
    createDatasetPanel(yearSliderValue, yearWorldHappiness);
});

// Remove the loading screen once the whole page is loaded
document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById('loader').remove();
    searchMatch.remove();
});

// Event listener that listens to hoveredCountry change and updates UI
hoveredCountry.registerListener(function (val) {
    if (hoveredCountry.data.name != '') {
        hoveredCountryTag.innerHTML = `${hoveredCountry.data.id} - ${hoveredCountry.data.name}`;
        if (countriesOfTheWorld[hoveredCountry.data.id]) {
            countryPopulationTag.innerHTML =
                countriesOfTheWorld[hoveredCountry.data.id]['Population'];
            countryDensityTag.innerHTML =
                countriesOfTheWorld[hoveredCountry.data.id][
                    'Pop. Density (per sq. mi.)'
                ];
            countryAreaTag.innerHTML =
                countriesOfTheWorld[hoveredCountry.data.id]['Area (sq. mi.)'];
            countyGDPTag.innerHTML =
                countriesOfTheWorld[hoveredCountry.data.id][
                    'GDP ($ per capita)'
                ];
        }
    } else {
        hoveredCountryTag.innerHTML = `${hoveredCountry.data.id}`;
        countryPopulationTag.innerHTML = 'No data';
        countryDensityTag.innerHTML = 'No data';
        countryAreaTag.innerHTML = 'No data';
        countyGDPTag.innerHTML = 'No data';
    }
});

// Event listener that listens to clickedCountry change and updates charts
clickedCountry.registerListener(function (val) {
    if (clickedCountry.data) {
        // Put focus on selected country in scatter plot
        countryFocusOn(clickedCountry.data.name);

        // Init bar chart
        initBarChart(worldHappiness, clickedCountry.data.id, yearSliderValue);
        barChartPanel.setHeaderTitle(
            `Bar chart of ${hoveredCountry.data.name}`
        );

        // Init line chart
        initLineChart(worldHappiness, clickedCountry.data.id);
        lineChartPanel.setHeaderTitle(
            `Line chart of ${hoveredCountry.data.name}`
        );
    } else {
        // Remove focus from selected country in scatter plot
        countryFocusOff();

        // Remove bar chart
        removeBarChart();
        barChartPanel.setHeaderTitle('Bar chart');

        // Remove line chart
        removeLineChart();
    }
});

// Event listener that listens to searchCountry change and updates hoveredCountry
searchedCountry.registerListener(function (val) {
    // Reset the clicked country so that charts are emptied
    if (clickedCountry.data) {
        clickedCountry.data = null;
    }
    setClickedCountry(searchedCountry.data);
    // Update hovered country
    hoveredCountry.data = {
        id: searchedCountry.data.id,
        name: searchedCountry.data.name,
    };
});

// Event listerer that listens to bar chart toggle button click
barChartToggle.addEventListener('click', function (e) {
    // switch state
    barChartState = !barChartState;
    if (barChartState) {
        // Make the toggle white
        barChartToggle.classList.add('active');
        barChartPanel.classList.remove('panelInvisible');
    } else {
        // Remove white toggle
        barChartToggle.classList.remove('active');
        barChartPanel.classList.add('panelInvisible');
    }
});

// Event listerer that listens to scatterplot toggle button click
scatterPlotToggle.addEventListener('click', function (e) {
    // switch state
    scatterPlotState = !scatterPlotState;
    if (scatterPlotState) {
        // Make the toggle white
        scatterPlotToggle.classList.add('active');
        scatterPanel.classList.remove('panelInvisible');
    } else {
        // Remove white toggle
        scatterPlotToggle.classList.remove('active');
        scatterPanel.classList.add('panelInvisible');
    }
});

// Event listerer that listens to line graph toggle button click
lineChartToggle.addEventListener('click', function (e) {
    // switch state
    lineChartState = !lineChartState;
    if (lineChartState) {
        // Make the toggle white
        lineChartToggle.classList.add('active');
        lineChartPanel.classList.remove('panelInvisible');
    } else {
        // Remove white toggle
        lineChartToggle.classList.remove('active');
        lineChartPanel.classList.add('panelInvisible');
    }
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

initScatter(worldHappiness, yearSliderValue);
