import * as d3 from 'd3';
import countriesOfTheWorld from '../../datasets/countries-of-the-world.json';

// Import the necessary globe functions
import {
    hoveredCountry,
    clickedCountry,
    setClickedCountry,
    resetClickedCountry,
} from './webgl/globe/globe.js';

// Variable that contains the svg frame
var graph;
// Variable the contains the selected country
var focusedCountry;

export function initScatter(completeData, year) {
    // Initialze the data for the scatter plot, selecting the appropriate year
    var data = completeData[year];
    // Variable containing the default category of the scatterplot
    var category = 'Economy (GDP per Capita)';
    // Variable containing the number of countries of the displayed year
    var numberOfCountries;

    // Retrieve the yearslider from the main file
    let yearSlider = document.getElementById('yearSlider');

    // Determine the number of countries in the scatter plot based on the selected year
    function numberCountries(selectedYear) {
        return selectedYear === '2015'
            ? 158
            : selectedYear === '2016'
                ? 157
                : selectedYear === '2017'
                    ? 155
                    : selectedYear === '2018'
                        ? 156
                        : selectedYear === '2019'
                            ? 155
                            : selectedYear === '2020'
                                ? 153
                                : 0;
    }

    // Set the default number of countries
    numberOfCountries =
        year === 2015
            ? 158
            : year === 2016
                ? 157
                : year === 2017
                    ? 155
                    : year === 2018
                        ? 156
                        : year === 2019
                            ? 155
                            : year === 2020
                                ? 153
                                : 0;

    // Animations while changing the year or category displayed in the scatter plot
    const animation_duration = 1000;
    const animation_delay = 0;
    const animation_easing = d3.easePoly;

    // Width of the scatter plot
    const graphWidth = window.innerWidth - 250;
    // Height of the scatter plot
    const graphHeight = window.innerHeight - 300;

    // Margins on all sides of the scatter plot
    const margin = 100;

    // Formatting of the happiness rank displayed in the tooltip while hovering over a country in the scatterplot
    function formatOrdinal(num) {
        const int = parseInt(num),
            digits = [int % 10, int % 100],
            ordinals = ['st', 'nd', 'rd', 'th'],
            oPattern = [1, 2, 3, 4],
            tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];

        return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
            ? int + ordinals[digits[0] - 1]
            : int + ordinals[3];
    }

    // Initialize the svg frame
    const svg = d3
        .select('#scatter')
        .append('svg')
        .attr(
            'viewBox',
            `0 0 ${graphWidth + margin * 2} ${graphHeight + margin * 2}`
        );

    // Append the scatter plot to the svg frame
    graph = svg
        .append('g')
        .attr('position', 'relative')
        .attr('class', 'main__svg')
        .attr('transform', `translate(${margin}, ${margin})`);

    // Set the default domain of the x-axis
    const x = d3.scaleLinear().domain([0, 1.8]).range([0, graphWidth]);

    // Initialize the x-axis
    const xAxis = d3.axisBottom(x).ticks(20);

    // Append the x-axis to the scatter plot, translate the x-axis to the origin
    const xAxisGroup = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)
        .attr('class', 'x-axis');

    // Set the domain and range of the y-axis
    const y = d3.scaleLinear().domain([1, 0]).range([0, graphHeight]);

    // Initialize the y-axis
    const yAxis = d3.axisLeft(y).ticks(20).tickFormat(d3.format('.0%'));

    // Append the y-axis to the scatter plot
    const yAxisGroup = graph.append('g').call(yAxis);

    // Add title to the x-axis of the scatter plot
    var xLabel = graph
        .append('g')
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('y', graphHeight + 50)
        .attr('x', graphWidth / 2)
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .text('GDP Per Capita ($)');

    // Add title to the y-axis of the scatter plot
    var yLabel = graph
        .append('g')
        .append('text')
        .attr('class', 'yAxisGroup')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(graphHeight / 2))
        .attr('y', -50)
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .text('Happiness Index (%)');

    // Initialize the tooltip and its propertries displayed while hovering over a country in the scatter plot
    const tooltip = d3
        .select('body')
        .append('div')
        .style('visibility', 'hidden')
        .attr('class', 'tooltip')
        .style('background-color', 'rgba(0,0,0,0.3)')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white')
        .style('z-index', '999999999')
        .style('position', 'absolute')
        .style('display', 'block');

    // Update the visualizations and hightlight the country appropriate circle on the selected country
    const setClickedCountryScatter = function (d, i) {
        focusedCountry = i[1]['Country'];
        let countryClicked = {
            id: i[0],
            name: i[1]['Country'],
            index: null,
        };
        if (clickedCountry.data) {
            countryFocusOff();
            resetClickedCountry();
        }
        // Update hovered country
        hoveredCountry.data = {
            id: i[0],
            name: i[1]['Country'],
        };
        setClickedCountry(countryClicked);
        countryFocusOn(i[1]['Country']);
    };

    // Initialize the tooltip when the user touches a country in the scatter plot
    const showTooltip = function (d, i) {
        let happinessRankTooltip = i[1]['Happiness Rank'];

        tooltip.transition().duration(200);
        tooltip
            .style('visibility', 'visible')
            .html(
                `
            <strong>Country:</strong> ${i[1]['Country']} (${i[1]['Region']
                })<br/>
            <strong>Happiness Ranking:</strong> ${formatOrdinal(
                    happinessRankTooltip
                )}<br/>
            <strong>${category}:</strong> ${i[1][category]
                    .toString()
                    .substring(0, 4)}
                `
            )
            .style('top', d.y - 100 + 'px')
            .style('left', d.x - 160 + 'px');
    };

    // Initialize the tooltip when the user hovers over a country in the scatter plot
    const moveTooltip = function (d, i) {
        showTooltip(d, i);
        tooltip.style('top', d.y - 100 + 'px').style('left', d.x - 160 + 'px');
    };

    // Deinitialize the tooltip when the user does not hover over a country in the scatter plot
    const hideTooltip = function (d, i) {
        tooltip.transition().duration(200).style('visibility', 'hidden');
    };

    // Associate the data with the available circles
    const circles = graph.selectAll('circle').data(Object.entries(data));

    /* 
     *  Append the circles corresponding to the countries with predefined interactions and properties to the scatter plot.
     *  Determine the color of a circle based on the region in which a country is located.
     *  Determine the radius of a circle based on the population size of a country.
     */
    circles
        .enter()
        .append('circle')
        .attr(
            'class',
            (d) =>
                `country-${d[1]['Country']} continent-${d[1]['Region']
                    .split(' ')
                    .join('-')} country-circle`
        )
        .attr('fill', (d) => {
            if (d[1]['Region'] === 'Central and Eastern Europe') {
                return '#7cbd1e';
            } else if (d[1]['Region'] === 'Western Europe') {
                return '#ff1f5a';
            } else if (d[1]['Region'] === 'Southern Asia') {
                return '#303481';
            } else if (d[1]['Region'] === 'Southeastern Asia') {
                return '#ff5b44';
            } else if (d[1]['Region'] === 'Eastern Asia') {
                return '#2fc5cc';
            } else if (d[1]['Region'] === 'Middle East and Northern Africa') {
                return '#F7DC6F';
            } else if (d[1]['Region'] === 'Sub-Saharan Africa') {
                return '#BB8FCE';
            } else if (d[1]['Region'] === 'Latin America and Caribbean') {
                return '#E74C3C';
            } else if (d[1]['Region'] === 'North America') {
                return '#3498DB';
            } else if (d[1]['Region'] === 'Australia and New Zealand') {
                return '#138D75';
            } else {
                return 'red';
            }
        })
        .attr('opacity', '.7')
        .attr('stroke', '#CDCDCD')
        .attr('stroke-width', '2px')
        .attr('cx', (d) => {
            return x(d[1]['Economy (GDP per Capita)']);
        })
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseleave', hideTooltip)
        .on('click', setClickedCountryScatter)
        .transition()
        .delay((d, i) => i * animation_delay)
        .duration(animation_duration)
        .ease(animation_easing)
        .attr('r', (d) => {
            if (countriesOfTheWorld[d[0]] === undefined) {
                return 10;
            } else {
                if (countriesOfTheWorld[d[0]].population > 800000000) {
                    return countriesOfTheWorld[d[0]]['Population'] / 25000000;
                } else if (countriesOfTheWorld[d[0]]['Population'] > 50000000) {
                    return countriesOfTheWorld[d[0]]['Population'] / 10000000;
                } else if (countriesOfTheWorld[d[0]]['Population'] > 1000000) {
                    return countriesOfTheWorld[d[0]]['Population'] / 1500000;
                } else {
                    return countriesOfTheWorld[d[0]]['Population'] / 100000;
                }
            }
        })
        .attr('cy', (d) => {
            let happinessRankCircle = d[1]['Happiness Rank'];
            return y(
                (numberOfCountries + 1 - happinessRankCircle) /
                numberOfCountries
            );
        });

    // The regions displayed in the legenda
    const continents = {
        CEE: { Region: 'Central and Eastern Europe' },
        WE: { Region: 'Western Europe' },
        SA: { Region: 'Southern Asia' },
        SEA: { Region: 'Southeastern Asia' },
        EA: { Region: 'Eastern Asia' },
        MENA: { Region: 'Middle East and Northern Africa' },
        SSA: { Region: 'Sub-Saharan Africa' },
        LAC: { Region: 'Latin America and Caribbean' },
        NA: { Region: 'North America' },
        ANZ: { Region: 'Australia and New Zealand' },
        ALR: { Region: 'Select all regions' }
    };

    // Initialize the legenda of the scatter plot
    const legend = graph
        .selectAll('.legend')
        .data(Object.values(continents))
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('position', 'absolute')
        .attr('transform', `translate(${graphWidth - margin * 2}, ${0})`);

    // Add colored squares to the legenda, based on the region in which a country is located
    // and corresponding to the color of the circles in the scatter plot
    legend
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return 20 * i;
        })
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', function (d) {
            if (d['Region'] === 'Central and Eastern Europe') {
                return '#7cbd1e';
            } else if (d['Region'] === 'Western Europe') {
                return '#ff1f5a';
            } else if (d['Region'] === 'Southern Asia') {
                return '#303481';
            } else if (d['Region'] === 'Southeastern Asia') {
                return '#ff5b44';
            } else if (d['Region'] === 'Eastern Asia') {
                return '#2fc5cc';
            } else if (d['Region'] === 'Middle East and Northern Africa') {
                return '#F7DC6F';
            } else if (d['Region'] === 'Sub-Saharan Africa') {
                return '#BB8FCE';
            } else if (d['Region'] === 'Latin America and Caribbean') {
                return '#E74C3C';
            } else if (d['Region'] === 'North America') {
                return '#3498DB';
            } else if (d['Region'] === 'Australia and New Zealand') {
                return '#138D75';
            } else {
                return '#ffffff';
            }
        })
        .on('click', regionFocusOn);

    // Add the different regions to the legenda
    legend
        .append('text')
        .attr('x', 25)
        .attr('text-anchor', 'start')
        .attr('class', (d) => `legend-${d.Region.split(' ').join('-')}`)
        .attr('y', function (d, i) {
            return 20 * i;
        })
        .attr('dy', '1.15em')
        .text(function (d) {
            return d.Region;
        })
        .attr('font-size', '12px')
        .style('fill', '#FFFFFF')
        .on('click', regionFocusOn);

    // Add a title to the legenda
    legend
        .append('text')
        .attr('x', 25)
        .attr('y', -25)
        .text('Continent')
        .style('text-align', 'left')
        .attr('font-size', '12px')
        .style('fill', '#FFFFFF');

    // Update the scatter plot based on the selected year
    function updateYear(year, label) {

        // Render circles
        const countryCircles = graph.selectAll('.country-circle');
        countryCircles.remove();

        data = completeData[year];

        // Associate the new data with the available circles and update the circles accordingly
        const circles = graph
            .selectAll('circle')
            .data(Object.entries(data))
            .enter()
            .append('circle')
            .attr(
                'class',
                (d) =>
                    `country-${d[1]['Country']} continent-${d[1]['Region']
                        .split(' ')
                        .join('-')} country-circle`
            )
            .attr('fill', (d) => {
                if (d[1]['Region'] === 'Central and Eastern Europe') {
                    return '#7cbd1e';
                } else if (d[1]['Region'] === 'Western Europe') {
                    return '#ff1f5a';
                } else if (d[1]['Region'] === 'Southern Asia') {
                    return '#303481';
                } else if (d[1]['Region'] === 'Southeastern Asia') {
                    return '#ff5b44';
                } else if (d[1]['Region'] === 'Eastern Asia') {
                    return '#2fc5cc';
                } else if (
                    d[1]['Region'] === 'Middle East and Northern Africa'
                ) {
                    return '#F7DC6F';
                } else if (d[1]['Region'] === 'Sub-Saharan Africa') {
                    return '#BB8FCE';
                } else if (d[1]['Region'] === 'Latin America and Caribbean') {
                    return '#E74C3C';
                } else if (d[1]['Region'] === 'North America') {
                    return '#3498DB';
                } else if (d[1]['Region'] === 'Australia and New Zealand') {
                    return '#138D75';
                } else {
                    return 'red';
                }
            })
            .attr('opacity', '.7')
            .attr('stroke', '#CDCDCD')
            .attr('stroke-width', '2px')
            .attr('cx', (d) => {
                return x(d[1][label]);
            })
            .on('mouseover', showTooltip)
            .on('mousemove', moveTooltip)
            .on('mouseleave', hideTooltip)
            .on('click', setClickedCountryScatter)
            .transition()
            .delay((d, i) => i * animation_delay)
            .duration(animation_duration)
            .ease(animation_easing)
            .attr('r', (d) => {
                if (countriesOfTheWorld[d[0]] === undefined) {
                    return 10;
                } else {
                    if (countriesOfTheWorld[d[0]].population > 800000000) {
                        return (
                            countriesOfTheWorld[d[0]]['Population'] / 25000000
                        );
                    } else if (
                        countriesOfTheWorld[d[0]]['Population'] > 50000000
                    ) {
                        return (
                            countriesOfTheWorld[d[0]]['Population'] / 10000000
                        );
                    } else if (
                        countriesOfTheWorld[d[0]]['Population'] > 1000000
                    ) {
                        return (
                            countriesOfTheWorld[d[0]]['Population'] / 1500000
                        );
                    } else {
                        return countriesOfTheWorld[d[0]]['Population'] / 100000;
                    }
                }
            })
            .attr('cy', (d) => {
                let happinessRankCircle = d[1]['Happiness Rank'];
                return y(
                    (numberCountries(year) + 1 - happinessRankCircle) /
                    numberCountries(year)
                );
            });
        if (focusedCountry !== undefined) {
            countryFocusOn(focusedCountry);
        }
    }

    // Update the data based on the selected category
    function updateData(label) {

        // Dynamically update the new domain of the x-axis based on the category
        let scale;

        if (label === 'graphSocialSupport') {
            category = 'Trust (Government Corruption)';
            scale = 0.6;
        } else if (label === 'graphFreedom') {
            category = 'Freedom to make life choices';
            scale = 0.8;
        } else if (label === 'graphGenerosity') {
            category = 'Generosity';
            scale = 0.9;
        } else if (label === 'graphLifeExpectancy') {
            category = 'Healthy life expectancy';
            scale = 1.2;
        } else if (label === 'graphGdp') {
            category = 'Economy (GDP per Capita)';
            scale = 1.8;
        }

        graph.selectAll('.x-axis').remove();

        // Set the default new domain of the x-axis
        const x = d3.scaleLinear().domain([0, scale]).range([0, graphWidth]);

        // Initialize the x-axis
        const xAxis = d3.axisBottom(x).ticks(20);

        // Append the x-axis to the scatter plot, translate the x-axis to the origin
        const xAxisGroup = graph
            .append('g')
            .attr('transform', `translate(0, ${graphHeight})`)
            .call(xAxis)
            .attr('class', 'x-axis');

        // Update the bar chart based on the new category
        graph
            .selectAll('.country-circle')
            .transition()
            .duration(500)
            .ease(animation_easing)
            .attr('cx', (d) => {
                return x(d[1][category]);
            });

        updateAxisLabel(category);
    }

    // Update the title of the x-axis based on the new category
    function updateAxisLabel(label) {
        if (label === 'graphSocialSupport') {
            category = 'Trust (Government Corruption)';
        } else if (label === 'graphFreedom') {
            category = 'Freedom to make life choices';
        } else if (label === 'graphGenerosity') {
            category = 'Generosity';
        } else if (label === 'graphLifeExpectancy') {
            category = 'Healthy life expectancy';
        } else if (label === 'graphGdp') {
            category = 'Economy (GDP per Capita)';
        }

        graph.select('.x-axis-label').text(`${label}`);
    }

    // An event listener associated to the buttons representing the different categories
    // that allows for dynamically updating the scatterplot based on the selected category
    let btnGroup = document.querySelector('.buttons');
    btnGroup.addEventListener('mousedown', (e) => {
        e.preventDefault();
        let currentBtn = e.target;
        let currentBtnType = currentBtn.classList[1];
        let currentBtnClass;

        if (currentBtnType === 'scatter-menu-button') {
            currentBtnClass = currentBtn.classList[0].split('-')[1];
        }

        if (currentBtnType === 'scatter-menu-button') {
            updateData(currentBtnClass);
            let allBtns = btnGroup.querySelectorAll('a');
            allBtns.forEach((btn) => {
                btn.classList.remove('active');
            });
            currentBtn.classList.add('active');
        }
    });

    // An event listener associated to year slider representing the different years
    // that allows for dynamically updating the scatterplot based on the selected year
    yearSlider.addEventListener('change', function (e) {
        updateYear(yearSlider.value, category);
    });
}

// Remove the focus from a selected country
export function countryFocusOff() {
    focusedCountry = undefined;
    graph.selectAll(`circle`).attr('opacity', '0.7');
}

// Focus on a selected country
export function countryFocusOn(country) {
    regionFocusOff();
    focusedCountry = country;

    graph
        .selectAll(`circle:not(.country-${country.split(' ').join('-')})`)
        .attr('opacity', '0.05');
}

// Focus on the countries of a selected region
export function regionFocusOn(i, d) {
    if (d['Region'] === 'Select all regions') {
        regionFocusOff();
        if (focusedCountry !== undefined) {
            resetClickedCountry();
        }
    } else {
        regionFocusOff();
        if (focusedCountry !== undefined) {
            countryFocusOff();
            resetClickedCountry();
        }
        graph
            .selectAll(
                `circle:not(.continent-${d['Region'].split(' ').join('-')})`
            )
            .attr('opacity', '0.05');
    }
}

// Remove the focus from the countries in a selected region
export function regionFocusOff() {
    graph.selectAll(`circle`).attr('opacity', '0.7');
}
