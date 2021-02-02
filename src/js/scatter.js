import * as d3 from 'd3';
import countriesOfTheWorld from '../../Datasets/countries-of-the-world.json';

import {
    hoveredCountry,
    clickedCountry,
    setClickedCountry,
    resetClickedCountry,
} from './webgl/globe/globe.js';

export function initScatter(completeData, year) {
    var data = completeData[year];
    var category = 'GDP Per Capita ($)';
    var numberOfCountries;

    // <input> tag used for year selection
    let yearSlider = document.getElementById('yearSlider');

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

    // Animations
    const animation_duration = 1000;
    const animation_delay = 0;
    const animation_easing = d3.easePoly;

    // Height and Width of the graph
    const graphWidth = window.innerWidth - 250;
    const graphHeight = window.innerHeight - 300;

    // create margins and dimensions
    const margin = 100;

    // Formatting of rank in tooltip
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

    // Add the svg frame
    const svg = d3
        .select('#scatter')
        .append('svg')
        .attr(
            'viewBox',
            `0 0 ${graphWidth + margin * 2} ${graphHeight + margin * 2}`
        );

    // Append the graph
    const graph = svg
        .append('g')
        .attr('position', 'relative')
        .attr('class', 'main__svg')
        .attr('transform', `translate(${margin}, ${margin})`);

    // Scale the x - axis, select space between bars using padding
    const x = d3.scaleLinear().domain([0, 1]).range([0, graphWidth]);

    // Load x axis
    const xAxis = d3.axisBottom(x).ticks(20);
    //.tickFormat(d3.format('.00'));

    // Append the x - axis, set the position of the axis at 0
    const xAxisGroup = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis);

    // Scale the y - axis, select space between bars using padding
    const y = d3.scaleLinear().domain([1, 0]).range([0, graphHeight]);

    // Load y axis
    const yAxis = d3.axisLeft(y).ticks(20).tickFormat(d3.format('.0%'));

    // Append the y - axis, set the position of the axis at 0
    const yAxisGroup = graph.append('g').call(yAxis);

    // Labels
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

    var yLabel = graph
        .append('g')
        .append('text')
        .attr('class', 'yAxisGroup')
        .attr('transform', 'rotate(-90)')
        // .attr('position', 'relative')
        .attr('x', -(graphHeight / 2))
        .attr('y', -50)
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .text('Happiness Index (%)');

    // Render tooltip
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

    const setClickedCountryScatter = function (d, i) {
        let countryClicked = {
            id: i[0],
            name: countriesOfTheWorld[i[0]]['Country'],
            index: null,
        };
        if (clickedCountry.data) {
            resetClickedCountry();
        }
        setClickedCountry(countryClicked);
        // Update hovered country
        hoveredCountry.data = {
            id: i[0],
            name: countriesOfTheWorld[i[0]]['Country'],
        };
    };

    // Render initial tooltip
    const showTooltip = function (d, i) {
        let happinessRankTooltip = i[1]['Happiness Rank'];
        console.log('Category var: ', category);
        console.log('Category: ', i[1][category.trim()]);
        console.log('Catergory Manual: ', i[1]['category.toString()']);

        tooltip.transition().duration(200);
        tooltip
            .style('visibility', 'visible')
            .html(
                `
            <strong>Country:</strong> ${i[1]['Country']} (${
                    i[1]['Region']
                })<br/>
            <strong>Happiness Ranking:</strong> ${formatOrdinal(
                    happinessRankTooltip
                )}<br/>
            <strong>${category}:</strong> ${i[1][category]}
                `
            )
            .style('top', d.y - 100 + 'px')
            .style('left', d.x - 160 + 'px');
    };

    // Rendering tooltip on hovering
    const moveTooltip = function (d, i) {
        showTooltip(d, i);
        tooltip.style('top', d.y - 100 + 'px').style('left', d.x - 160 + 'px');
    };

    // Hide tooltip
    const hideTooltip = function (d, i) {
        tooltip.transition().duration(200).style('visibility', 'hidden');
    };

    // Render circles
    const circles = graph.selectAll('circle').data(Object.entries(data));

    circles
        .enter()
        .append('circle')
        .attr(
            'class',
            (d) =>
                `country ${d[1]['Country']} continent-${d[1]['Region']
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


    // Legenda
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
    };

    function regionFocusOn(i, d) {
        console.log('Focus1', d);
        graph
            .selectAll(
                `circle:not(.continent-${d['Region'].split(' ').join('-')})`
            )
            .attr('opacity', '0.05');
    }

    function regionFocusOff(i, d) {
        console.log('Focus2', d);
        graph
            .selectAll(
                `circle:not(.continent-${d['Region'].split(' ').join('-')})`
            )
            .attr('opacity', '0.7');
    }

    // Position of legenda
    const legend = graph
        .selectAll('.legend')
        .data(Object.values(continents))
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('position', 'absolute')
        .attr('transform', `translate(${graphWidth - margin * 2}, ${0})`);

    // Add colored squared to legenda
    legend
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return 20 * i;
        })
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', function (d) {
            console.log('Focus3', d);
            if (d['Region'] === 'Central and Eastern Europe') {
                return '#7cbd1e';
            } else if (d.Region === 'Western Europe') {
                return '#ff1f5a';
            } else if (d.Region === 'Southern Asia') {
                return '#303481';
            } else if (d.Region === 'Southeastern Asia') {
                return '#ff5b44';
            } else if (d.Region === 'Eastern Asia') {
                return '#2fc5cc';
            } else if (d.Region === 'Middle East and Northern Africa') {
                return '#F7DC6F';
            } else if (d.Region === 'Sub-Saharan Africa') {
                return '#BB8FCE';
            } else if (d.Region === 'Latin America and Caribbean') {
                return '#E74C3C';
            } else if (d.Region === 'North America') {
                return '#3498DB';
            } else {
                return 'red';
            }
        })
        .on('mouseover', regionFocusOn)
        .on('mouseleave', regionFocusOff);

    // Add regions to legenda
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
        .on('mouseover', regionFocusOn)
        .on('mouseleave', regionFocusOff);

    // Add legenda title
    legend
        .append('text')
        .attr('x', 25)
        //.attr('dy', '-.2em')
        .attr('y', -25)
        .text('Continent')
        .attr('font-size', '17px')
        .style('text-align', 'left')
        .style('fill', '#FFFFFF');

    // Update the data according to the new category
    function updateYear(year, label) {
        // Render circles
        const countryCircles = graph.selectAll('.country-circle');
        countryCircles.remove();

        data = completeData[year];

        // Render circles
        const circles = graph
            .selectAll('circle')
            .data(Object.entries(data))
            .enter()
            .append('circle')
            .attr(
                'class',
                (d) =>
                    `country ${d[1]['Country']} continent-${d[1]['Region']
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
    }

    // Update the data according to the new category
    function updateData(label) {
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

    function updateAxisLabel(label) {
        // Update the category displayed on the x-axis
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

        // Update the category displayed on the x-axis
        graph.select('.x-axis-label').text(`${label}`);
    }

    // Button group event listener, checks button group and updates if button is not currently selected
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

    // Event listener that listens to the range slider
    yearSlider.addEventListener('change', function (e) {
        // Get slider value, update data and UI
        // yearSliderValue = yearSlider.value;
        console.log('Yearslidesvalue: ', yearSlider.value);

        if (category === 'graphSocialSupport') {
            label = 'Trust (Government Corruption)';
        } else if (category === 'graphFreedom') {
            label = 'Freedom to make life choices';
        } else if (category === 'graphGenerosity') {
            label = 'Generosity';
        } else if (category === 'graphLifeExpectancy') {
            label = 'Healthy life expectancy';
        } else if (category === 'graphGdp') {
            label = 'Economy (GDP per Capita)';
        }

        updateYear(yearSlider.value, label);
    });
}
