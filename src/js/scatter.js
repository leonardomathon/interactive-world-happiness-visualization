import * as d3 from 'd3';

export function initScatter(data, year) {
    console.log('data: ', data);

    const numberOfCountries = year === '2015' ?
        158 : (year === '2016' ? 157 :
            (year === '2017' ? 155 :
                (year === '2018' ? 153 :
                    (year === '2019' ? 155 :
                        (year === '2020' ? 153 : 0)))));

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
    };

    // Add the svg frame
    const svg = d3.select('#scatter')
        .append('svg')
        .attr('width', graphWidth + margin * 2)
        .attr('height', graphHeight + margin * 2);

    // Append the graph
    const graph = svg.append('g')
        .attr('position', 'relative')
        .attr('class', 'main__svg')
        .attr('transform', `translate(${margin}, ${margin})`)

    // Scale the x - axis, select space between bars using padding
    const x = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, graphWidth]);

    // Load x axis
    const xAxis = d3
        .axisBottom(x)
        .ticks(20);
    //.tickFormat(d3.format('.00'));

    // Append the x - axis, set the position of the axis at 0
    const xAxisGroup = graph.append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis);

    // Scale the y - axis, select space between bars using padding
    const y = d3
        .scaleLinear()
        .domain([1, 0])
        .range([0, graphHeight]);

    // Load y axis
    const yAxis = d3
        .axisLeft(y)
        .ticks(20)
        .tickFormat(d3.format('.0%'))

    // Append the y - axis, set the position of the axis at 0
    const yAxisGroup = graph.append('g')
        .call(yAxis);

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
        .style('background-color', 'black')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white')
        .style('z-index', '999999999')
        .style('position', 'absolute')
        .style('display', 'block');

    // Render initial tooltip
    const showTooltip = function (d, i) {
        let happinessRankTooltip = i['Happiness Rank']

        tooltip.transition().duration(200);
        tooltip
            .style('visibility', 'visible')
            .html(
                `
            <strong>Country:</strong> ${i.Country} (${i.Region})<br/>
            <strong>Happiness Ranking:</strong> ${formatOrdinal(happinessRankTooltip)}
                `
            )
            .style('top', d.y - 100 + 'px')
            .style('left', d.x - 160 + 'px');
    };

    // Rendering tooltip on hovering
    const moveTooltip = function (d, i) {
        showTooltip(d, i);
        tooltip
            .style('top', d.y - 100 + 'px')
            .style('left', d.x - 160 + 'px');
    };

    // Hide tooltip
    const hideTooltip = function (d, i) {
        tooltip
            .transition()
            .duration(200)
            .style('visibility', 'hidden');
    };

    // Render circles
    const circles = graph
        .selectAll('circle')
        .data(Object.values(data))
        .enter()
        .append('circle')
        .attr(
            'class',
            d =>
                `country ${d.Country} continent-${d.Region
                    .split(' ')
                    .join('-')} country-bubble`
        )
        .attr('fill', d => {
            if (d.Region === 'Central and Eastern Europe') {
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
        .attr('opacity', '.7')
        .attr('stroke', '#CDCDCD')
        .attr('stroke-width', '2px')
        .attr('cx', d => {
            return x(d['Generosity']);
        })
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseleave', hideTooltip)
        .transition()
        .delay((d, i) => i * animation_delay)
        .duration(animation_duration)
        .ease(animation_easing)
        .attr('r', d => {
            return 5;
            // if (d.population > 800000000) {
            //     return d.population / 25000000;
            // } else if (d.population > 50000000) {
            //     return d.population / 10000000;
            // } else if (d.population > 1000000) {
            //     return d.population / 1500000;
            // } else {
            //     return d.population / 100000;
            // }
        })
        .attr('cy', d => {
            console.log(d)
            let happinessRankCircle = d['Happiness Rank']
            return y(((numberOfCountries + 1) - happinessRankCircle) / numberOfCountries);
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
        NA: { Region: 'North America' }
    };

    function regionFocusOn(i, d) {
        graph
            .selectAll(
                `circle:not(.continent-${d.Region.split(" ").join("-")})`
            )
            .attr("opacity", "0.05");
    };

    function regionFocusOff(i, d) {
        graph
            .selectAll(
                `circle:not(.continent-${d.Region.split(" ").join("-")})`
            )
            .attr("opacity", "0.7");
    };

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
            return 25 * i;
        })
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', function (d) {
            if (d.Region === 'Central and Eastern Europe') {
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
        .attr('class', d => `legend-${d.Region.split(' ').join('-')}`)
        .attr('y', function (d, i) {
            return 25 * i;
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


    // updateData(dataType) {
    //     d3.json('dist/data/countries.json').then(data => {
    //         this.chart
    //             .selectAll('.country-bubble')
    //             .transition()
    //             .duration(500)
    //             .ease(ANIMATION_EASING)
    //             .attr('cx', d => {
    //                 return this.xScale(d[dataType] / 156) + 25;
    //             });

    //         this.updateAxisLabel(dataType);
    //     });
    // }

    // updateAxisLabel(type) {
    //     // xLabel
    //     let label;
    //     if (type === 'graphSocialSupport') {
    //         label = 'Social Support';
    //     } else if (type === 'graphFreedom') {
    //         label = 'Freedom';
    //     } else if (type === 'graphGenerosity') {
    //         label = 'Generosity';
    //     } else if (type === 'graphLifeExpectancy') {
    //         label = 'Life Expectancy';
    //     } else if (type === 'graphGdp') {
    //         label = 'GDP Per Capita ($)';
    //     }
    //     this.chart.select('.x-axis-label').text(`${label}`);
    // }
}

