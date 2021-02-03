import * as d3 from 'd3';
let svg;
const totalGraphWidth = 800;
const totalGraphHeight = 350;

export function initLineChart(data, countryId) {
    svg = d3
        .select('#lineChart')
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', `0 0 ${totalGraphWidth} ${totalGraphHeight}`);

    let dataFilter = [];
    for (let year = 2015; year <= 2020; year++) {
        let countryData = data[year][countryId];
        // If a country does not exists in a certain year, give all properties 0
        if (countryData === undefined) {
            countryData = {
                Country: '',
                'Economy (GDP per Capita)': 0,
                'Freedom to make life choices': 0,
                Generosity: 0,
                'Happiness Rank': 0,
                'Happiness Score': 0,
                'Healthy life expectancy': 0,
                Region: '',
                'Trust (Government Corruption)': 0,
            };
        }
        countryData.Year = year;
        countryData.ISO = countryId;
        dataFilter.push(countryData);
    }
    render(dataFilter);
}

const render = (data) => {
    const yAxisLabel = 'Happiness Score';
    const xAxisLabel = 'Year';
    const margin = { top: 20, right: 40, bottom: 20, left: 50 };
    const innerWidth = totalGraphWidth - margin.left - margin.right;
    const innerHeight = totalGraphHeight - margin.bottom - margin.top;
    const numberFormat = d3.format('.3f');

    const scores = {
        happiness: { type: 'Happiness Score' },
        economy: { type: 'Economy (GDP per Capita)' },
        freedom: { type: 'Freedom to make life choices' },
        health: { type: 'Healthy life expectancy' },
        generosity: { type: 'Generosity' },
        trust: { type: 'Trust (Government Corruption)' },
    };

    const widthOffset = 275;

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d['Happiness Score'])])
        .range([innerHeight, 0])
        .nice();

    const yScale2 = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(
                data,
                (a) => a['Economy (GDP per Capita)'],
                (b) => b['Freedom to make life choices'],
                (c) => c['Healthy life expectancy'],
                (d) => d['Generosity'],
                (e) => e['Trust (Government Corruption)']
            ) + 0.3,
        ])
        .range([innerHeight, 0])
        .nice();

    const xScale = d3
        .scalePoint()
        .domain(data.map((d) => d['Year']))
        .range([0, innerWidth - widthOffset])
        .padding(0.75);

    const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
        .attr('class', 'leftAxis')
        .call(d3.axisLeft(yScale))
        .selectAll('.tick line')
        .remove();

    g.append('g')
        .attr('transform', `translate(${innerWidth - widthOffset},0)`)
        .attr('class', 'rightAxis')
        .call(d3.axisRight(yScale2))
        .selectAll('.tick line')
        .remove();

    g.append('g')
        .call(d3.axisBottom(xScale))
        .attr('class', 'bottomAxis')
        .attr('transform', `translate(0,${innerHeight})`)
        .selectAll('.tick line')
        .remove();

    // Original line
    const ogLine = d3
        .line()
        .x((d) => xScale(d['Year']))
        .y(innerHeight);

    // Drawing of line for overall rating
    const lineGenerator = d3
        .line()
        .x((d) => xScale(d['Year']))
        .y((d) => yScale(d['Happiness Score']));

    g.append('path')
        .attr('d', ogLine(data))
        .transition()
        .duration(1500)
        .attr('class', 'line-path')
        .attr('d', lineGenerator(data));

    // Drawing of line for economy rating
    const lineGenerator2 = d3
        .line()
        .x((d) => xScale(d['Year']))
        .y((d) => yScale2(d['Economy (GDP per Capita)']));

    g.append('path')
        .attr('d', ogLine(data))
        .transition()
        .duration(1500)
        .attr('class', 'line-path2')
        .attr('d', lineGenerator2(data));

    // Drawing of line for freedom rating
    const lineGenerator3 = d3
        .line()
        .x((d) => xScale(d['Year']))
        .y((d) => yScale2(d['Freedom to make life choices']));

    g.append('path')
        .attr('d', ogLine(data))
        .transition()
        .duration(1500)
        .attr('class', 'line-path3')
        .attr('d', lineGenerator3(data));

    // Drawing of line for health rating
    const lineGenerator4 = d3
        .line()
        .x((d) => xScale(d['Year']))
        .y((d) => yScale2(d['Healthy life expectancy']));

    g.append('path')
        .attr('d', ogLine(data))
        .transition()
        .duration(1500)
        .attr('class', 'line-path4')
        .attr('d', lineGenerator4(data));

    // Drawing of line for generosity rating
    const lineGenerator5 = d3
        .line()
        .x((d) => xScale(d['Year']))
        .y((d) => yScale2(d['Generosity']));

    g.append('path')
        .attr('d', ogLine(data))
        .transition()
        .duration(1500)
        .attr('class', 'line-path5')
        .attr('d', lineGenerator5(data));

    // Drawing of line for trust rating
    const lineGenerator6 = d3
        .line()
        .x((d) => xScale(d['Year']))
        .y((d) => yScale2(d['Trust (Government Corruption)']));

    g.append('path')
        .attr('d', ogLine(data))
        .transition()
        .duration(1500)
        .attr('class', 'line-path6')
        .attr('d', lineGenerator6(data));

    // Define the div for the tooltip
    let tooltip = g.append('div').attr('class', 'tooltip').style('opacity', 0);

    // Define the div for the tooltip
    var div = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Drawing of dots for overall rating
    const xHappDots = (d) => xScale(d['Year']);
    const yHappDots = (d) => yScale(d['Happiness Score']);

    let dots = g
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cy', innerHeight)
        .attr('cx', xHappDots)
        .attr('r', 8)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

    dots.transition().duration(1500).attr('cy', yHappDots);

    // Drawing of dots for economy rating
    let ecoDots = g
        .selectAll('circle2')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle2')
        .attr('cy', innerHeight)
        .attr('cx', (d) => xScale(d['Year']))
        .attr('r', 5)
        .on('mouseover', handleMouseOverEco)
        .on('mouseout', handleMouseOutEco);

    ecoDots
        .transition()
        .duration(1500)
        .attr('cy', (d) => yScale2(d['Economy (GDP per Capita)']));

    // Drawing of dots for freedom rating
    let freeDots = g
        .selectAll('circle3')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle3')
        .attr('cy', (d) => innerHeight)
        .attr('cx', (d) => xScale(d['Year']))
        .attr('r', 5)
        .on('mouseover', handleMouseOverFree)
        .on('mouseout', handleMouseOutFree);

    freeDots
        .transition()
        .duration(1500)
        .attr('cy', (d) => yScale2(d['Freedom to make life choices']));

    // Drawing of dots for health rating
    let healthDots = g
        .selectAll('circle4')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle4')
        .attr('cy', (d) => innerHeight)
        .attr('cx', (d) => xScale(d['Year']))
        .attr('r', 5)
        .on('mouseover', handleMouseOverHealth)
        .on('mouseout', handleMouseOutHealth);

    healthDots
        .transition()
        .duration(1500)
        .attr('cy', (d) => yScale2(d['Healthy life expectancy']));

    // Drawing of dots for generosity rating
    let genDots = g
        .selectAll('circle5')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle5')
        .attr('cy', (d) => innerHeight)
        .attr('cx', (d) => xScale(d['Year']))
        .attr('r', 5)
        .on('mouseover', handleMouseOverGen)
        .on('mouseout', handleMouseOutGen);

    genDots
        .transition()
        .duration(1500)
        .attr('cy', (d) => yScale2(d['Generosity']));

    // Drawing of dots for trust rating
    let trustDots = g
        .selectAll('circle6')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle6')
        .attr('cy', (d) => innerHeight)
        .attr('cx', (d) => xScale(d['Year']))
        .attr('r', 5)
        .on('mouseover', handleMouseOverTrust)
        .on('mouseout', handleMouseOutTrust);

    trustDots
        .transition()
        .duration(1500)
        .attr('cy', (d) => yScale2(d['Trust (Government Corruption)']));

    // Adds interactivity when mouse is over dot
    function handleMouseOver(d, i) {
        let current = d3.select(this);

        // Set stroke of dot to steelblue to mimick zoom
        current.style('stroke', 'steelblue');

        // Determine location of text
        let xText = current.attr('cx');
        let yText = current.attr('cy') - 25;

        // Initialize transition for tooltip
        div.transition().duration(200).style('opacity', 0.9);

        // Determine text of tooltip
        div.html(i['Year'] + '<br/>' + numberFormat(i['Happiness Score']))
            .style('left', xText + 'px')
            .style('top', yText + 'px');
    }

    // Stops interactivity when mouse is no longer over economy dot
    function handleMouseOut(d, i) {
        let current = d3.select(this);

        // Reset stroke of dot to white
        current.style('stroke', 'white');

        div.transition().duration(500).style('opacity', 0);
    }

    // Adds interactivity when mouse is over economy dot
    function handleMouseOverEco(d, i) {
        let current = d3.select(this);

        // Set stroke of dot to red to mimick zoom
        current.style('fill', 'rgba(255,0,0,1');
        current.style('stroke', 'red');

        d3.selectAll('.rightAxis').style('color', 'rgba(255, 0, 0, 1');
        d3.selectAll('.line-path2').style('stroke', 'rgba(255, 0, 0, 1');

        // Determine location of text
        let xText = current.attr('cx');
        let yText = current.attr('cy') - 25;

        // Initialize transition for tooltip
        div.transition().duration(200).style('opacity', 0.9);

        // Determine text of tooltip
        div.html(
            i['Year'] + '<br/>' + numberFormat(i['Economy (GDP per Capita)'])
        )
            .style('left', xText + 'px')
            .style('top', yText + 'px');
    }

    // Stops interactivity when mouse is no longer over economy dot
    function handleMouseOutEco(d, i) {
        let current = d3.select(this);

        d3.selectAll('.rightAxis').style('color', 'rgba(0, 0, 0, 0.2)');
        current.style('fill', 'rgba(255, 0, 0, 0.3');
        d3.selectAll('.line-path2').style('stroke', 'rgba(255, 0, 0, 0.3');
        current.style('stroke', 'white');

        div.transition().duration(500).style('opacity', 0);
    }

    // Adds interactivity when mouse is over freedom dot
    function handleMouseOverFree(d, i) {
        let current = d3.select(this);

        // Set stroke of dot to orange to mimick zoom
        current.style('fill', 'rgba(255, 165, 0, 1)');
        current.style('stroke', 'rgba(255, 165, 0, 1)');

        d3.selectAll('.rightAxis').style('color', 'rgba(255, 165, 0, 1)');
        d3.selectAll('.line-path3').style('stroke', 'rgba(255, 165, 0, 1)');

        // Determine location of text
        let xText = current.attr('cx');
        let yText = current.attr('cy') - 25;

        // Initialize transition for tooltip
        div.transition().duration(200).style('opacity', 0.9);

        // Determine text of tooltip
        div.html(
            i['Year'] +
                '<br/>' +
                numberFormat(i['Freedom to make life choices'])
        )
            .style('left', xText + 'px')
            .style('top', yText + 'px');
    }

    // Stops interactivity when mouse is no longer over freedom dot
    function handleMouseOutFree(d, i) {
        let current = d3.select(this);

        d3.selectAll('.rightAxis').style('color', 'rgba(0, 0, 0, 0.2)');
        current.style('fill', 'rgba(255, 165, 0, 0.3)');
        d3.selectAll('.line-path3').style('stroke', 'rgba(255, 165, 0, 0.3)');
        current.style('stroke', 'white');

        div.transition().duration(500).style('opacity', 0);
    }

    // Adds interactivity when mouse is over health dot
    function handleMouseOverHealth(d, i) {
        let current = d3.select(this);

        // Set stroke of dot to violet to mimick zoom
        current.style('fill', 'rgba(238, 130, 238, 1)');
        current.style('stroke', 'rgba(238, 130, 238, 1)');

        d3.selectAll('.rightAxis').style('color', 'rgba(238, 130, 238, 1)');
        d3.selectAll('.line-path4').style('stroke', 'rgba(238, 130, 238, 1)');

        // Determine location of text
        let xText = current.attr('cx');
        let yText = current.attr('cy') - 25;

        // Initialize transition for tooltip
        div.transition().duration(200).style('opacity', 0.9);

        // Determine text of tooltip
        div.html(
            i['Year'] + '<br/>' + numberFormat(i['Healthy life expectancy'])
        )
            .style('left', xText + 'px')
            .style('top', yText + 'px');
    }

    // Stops interactivity when mouse is no longer over health dot
    function handleMouseOutHealth(d, i) {
        let current = d3.select(this);

        d3.selectAll('.rightAxis').style('color', 'rgba(0, 0, 0, 0.2)');
        current.style('fill', 'rgba(238, 130, 238, 0.3)');
        d3.selectAll('.line-path4').style('stroke', 'rgba(238, 130, 238, 0.3)');
        current.style('stroke', 'white');

        div.transition().duration(500).style('opacity', 0);
    }

    // Adds interactivity when mouse is over generosity dot
    function handleMouseOverGen(d, i) {
        let current = d3.select(this);

        // Set stroke of dot to dark green to mimick zoom
        current.style('fill', 'rgba(0, 128, 128, 1)');
        current.style('stroke', 'rgba(0, 128, 128, 1)');

        d3.selectAll('.rightAxis').style('color', 'rgba(0, 128, 128, 1)');
        d3.selectAll('.line-path5').style('stroke', 'rgba(0, 128, 128, 1)');

        // Determine location of text
        let xText = current.attr('cx');
        let yText = current.attr('cy') - 25;

        // Initialize transition for tooltip
        div.transition().duration(200).style('opacity', 0.9);

        // Determine text of tooltip
        div.html(i['Year'] + '<br/>' + numberFormat(i['Generosity']))
            .style('left', xText + 'px')
            .style('top', yText + 'px');
    }

    // Stops interactivity when mouse is no longer over generosity dot
    function handleMouseOutGen(d, i) {
        let current = d3.select(this);

        d3.selectAll('.rightAxis').style('color', 'rgba(0, 0, 0, 0.2)');
        current.style('fill', 'rgba(0, 128, 128, 0.3)');
        d3.selectAll('.line-path5').style('stroke', 'rgba(0, 128, 128, 0.3)');
        current.style('stroke', 'white');

        div.transition().duration(500).style('opacity', 0);
    }

    // Adds interactivity when mouse is over trust dot
    function handleMouseOverTrust(d, i) {
        let current = d3.select(this);

        // Set stroke of dot to dark green to mimick zoom
        current.style('fill', 'rgba(64, 224, 208, 1)');
        current.style('stroke', 'rgba(64, 224, 208, 1)');

        d3.selectAll('.rightAxis').style('color', 'rgba(64, 224, 208, 1)');
        d3.selectAll('.line-path6').style('stroke', 'rgba(64, 224, 208, 1)');

        // Determine location of text
        let xText = current.attr('cx');
        let yText = current.attr('cy') - 25;

        // Initialize transition for tooltip
        div.transition().duration(200).style('opacity', 0.9);

        // Determine text of tooltip
        div.html(
            i['Year'] +
                '<br/>' +
                numberFormat(i['Trust (Government Corruption)'])
        )
            .style('left', xText + 'px')
            .style('top', yText + 'px');
    }

    // Stops interactivity when mouse is no longer over trust dot
    function handleMouseOutTrust(d, i) {
        let current = d3.select(this);

        d3.selectAll('.rightAxis').style('color', 'rgba(0, 0, 0, 0.2)');
        current.style('fill', 'rgba(64, 224, 208, 0.3)');
        d3.selectAll('.line-path6').style('stroke', 'rgba(64, 224, 208, 0.3)');
        current.style('stroke', 'white');

        div.transition().duration(500).style('opacity', 0);
    }

    const legendOffset = 200;
    const legendFontSize = '12px';

    // Legend circles
    g.append('circle')
        .attr('cx', innerWidth - legendOffset)
        .attr('cy', 130)
        .attr('r', 6)
        .style('fill', 'steelblue');
    g.append('circle')
        .attr('cx', innerWidth - legendOffset)
        .attr('cy', 160)
        .attr('r', 6)
        .style('fill', 'red');
    g.append('circle')
        .attr('cx', innerWidth - legendOffset)
        .attr('cy', 190)
        .attr('r', 6)
        .style('fill', 'orange');
    g.append('circle')
        .attr('cx', innerWidth - legendOffset)
        .attr('cy', 220)
        .attr('r', 6)
        .style('fill', 'violet');
    g.append('circle')
        .attr('cx', innerWidth - legendOffset)
        .attr('cy', 250)
        .attr('r', 6)
        .style('fill', 'teal');
    g.append('circle')
        .attr('cx', innerWidth - legendOffset)
        .attr('cy', 280)
        .attr('r', 6)
        .style('fill', 'turquoise');

    // Legend text
    g.append('text')
        .attr('x', innerWidth - legendOffset + 25)
        .attr('y', 130)
        .text(scores.happiness.type)
        .style('font-size', legendFontSize)
        .style('color', '#fff')
        .attr('alignment-baseline', 'middle');
    g.append('text')
        .attr('x', innerWidth - legendOffset + 25)
        .attr('y', 160)
        .text(scores.economy.type)
        .style('font-size', legendFontSize)
        .style('color', '#fff')
        .attr('alignment-baseline', 'middle');
    g.append('text')
        .attr('x', innerWidth - legendOffset + 25)
        .attr('y', 190)
        .text(scores.freedom.type)
        .style('font-size', legendFontSize)
        .style('color', '#fff')
        .attr('alignment-baseline', 'middle');
    g.append('text')
        .attr('x', innerWidth - legendOffset + 25)
        .attr('y', 220)
        .text(scores.health.type)
        .style('font-size', legendFontSize)
        .style('color', '#fff')
        .attr('alignment-baseline', 'middle');
    g.append('text')
        .attr('x', innerWidth - legendOffset + 25)
        .attr('y', 250)
        .text(scores.generosity.type)
        .style('font-size', legendFontSize)
        .style('color', '#fff')
        .attr('alignment-baseline', 'middle');
    g.append('text')
        .attr('x', innerWidth - legendOffset + 25)
        .attr('y', 280)
        .text(scores.trust.type)
        .style('font-size', legendFontSize)
        .style('color', '#fff')
        .attr('alignment-baseline', 'middle');
};

export function removeLineChart() {
    let chart = document.getElementById('lineChart').querySelector('svg');
    if (chart) {
        chart.remove();
    }
}
