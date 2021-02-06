import * as d3 from 'd3';

// Variable that contains the svg frame
var graph;
// Variable that initializes the y-axis
var y;

// Total height and total widht of the bar chart
const totalGraphWidth = 800;
const totalGraphHeight = 400;

// Margins on all sides of the bar chart
const margin = { top: 50, right: 20, bottom: 120, left: 80 };
const graphWidth = totalGraphWidth - margin.left - margin.right;
const graphHeight = totalGraphHeight - margin.top - margin.bottom;

// Function to initialize the bar chart
export function initBarChart(completeData, country, year) {
    // Initialize the svg frame
    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', `0 0 ${totalGraphWidth} ${totalGraphHeight}`);

    // Append the bar chart to the svg frame
    graph = svg
        .append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Append the x-axis to the bar chart, translate the x-axis to the origin
    const xAxisGroup = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`);

    // Append the y-axis to the bar chart
    const yAxisGroup = graph.append('g').attr('class', 'y-axis');

    // Set the domain of the y-axis
    y = d3.scaleLinear().range([graphHeight, 0]);

    // Set the domain of the x-axis, set the space between the bars using padding
    const x = d3
        .scaleBand()
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    // Add title to the x-axis of the bar chart 
    const xTitle = graph
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', graphWidth + 10)
        .attr('y', graphHeight + 50)
        .attr('fill', 'white')
        .text('Category');

    // Add title to the y-axis of the bar chart 
    const yTitle = graph
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', margin.right)
        .attr('y', -20)
        .attr('fill', 'white')
        .text('Value');

    // Initialize the x-axis
    const xAxis = d3.axisBottom(x);
    // Initialize the y-axis
    const yAxis = d3.axisLeft(y);

    // Initialze the data for the bar chart, selecting the appropriate year and country
    let data = completeData[year][country];
    let graphData;

    // Set the value of the bars to zero if the data of a particular year is not available in the dataset
    if (data === undefined) {
        graphData = {
            'Economy (GDP per Capita)': 0,
            'Freedom to make life choices': 0,
            Generosity: 0,
            'Healthy life expectancy': 0,
            'Trust (Government Corruption)': 0,
        };
    } else {
        // Assign the data to seperate categories
        graphData = {
            'Economy (GDP per Capita)': data['Economy (GDP per Capita)'],
            'Freedom to make life choices': data['Freedom to make life choices'],
            Generosity: data['Generosity'],
            'Healthy life expectancy': data['Healthy life expectancy'],
            'Trust (Government Corruption)': data['Trust (Government Corruption)'],
        };
    }

    // Set the name of a bar equal to the corresponding category
    const barsKeys = Object.keys(graphData);
    // Set the value of a bar equal to the corresponding category
    const barsValues = Object.values(graphData);

    // Initialize the bars in the bar chart
    const bars = [];
    barsKeys.forEach((key, idx) => {
        bars[idx] = { name: barsKeys[idx], value: barsValues[idx] };
    });

    // Dynamically set the domain of the y-axis to category containing the maximum value
    y.domain([0, (Math.ceil(d3.max(barsValues) * 10) / 10).toFixed(1)]);

    // Dynamically set the domain of the x-axis to the categories in the dataset
    x.domain(barsKeys);

    // Associate the data with the available bars
    const rects = graph.selectAll('rect').data(bars);
    rects.exit().remove();

    // Append the bars with predefined interactions and properties to the chart
    rects
        .enter()
        .append('rect')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .attr('class', 'rect')
        .attr('width', x.bandwidth)
        .attr('height', 0)
        .attr('fill', 'white')
        .attr('x', (d) => x(d.name))
        .attr('y', graphHeight)
        .merge(rects)
        .transition()
        .duration(1500)
        .attr('y', (d) => {
            return y(d.value);
        })
        .attr('height', (d) => {
            return graphHeight - y(d.value);
        });

    // Call the x-axis
    xAxisGroup.call(xAxis);
    // Call the y-axis
    yAxisGroup.call(yAxis);

    // Styling properties of the category names on the x-axis
    xAxisGroup
        .selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor', 'end')
        .attr('fill', 'white')
        .style('font-size', '12px');

    // Initialize the hover function 
    function handleMouseOver(d, i) {

        // Select the hovered bar and change its color
        d3.select(this).style('fill', '#B3B6B7');

        let valueCharacter = i.value.toString();

        // Display the value corresponding to the hovered category inside the associated bar
        const hover = graph
            .append('text')
            .transition()
            .duration(1000)
            .attr('id', 't' + d.x + '-' + d.y)
            .attr(
                'y',
                graphHeight - parseInt(d3.select(this).attr('height')) / 2
            )
            .attr(
                'x',
                parseInt(d3.select(this).attr('x')) +
                (parseInt(d3.select(this).attr('width')) / 2 - 12)
            )
            .attr('pointer-events', 'none')
            .attr('class', 'hover')
            .style('fill', '#FFFFFF')
            .text(valueCharacter.substring(0, 4));
    }

    // Deinitialize the hover function
    function handleMouseOut(d, i) {
        d3.select(this).attr('style', '#FFFFFF');
        d3.selectAll('.hover').remove();
    }
}

// Update the bar charts based on the selected country and year
export function updateBarChartData(completeData, year, country) {
    console.log('Y-axis: ', graph.selectAll('.x-axis'));
    graph.selectAll('.y-axis').remove();

    // Append the x-axis to the bar chart, translate the x-axis to the origin
    const xAxisGroup = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`);

    // Append the y-axis to the bar chart
    const yAxisGroup = graph.append('g').attr('class', 'y-axis');

    // Set the domain of the y-axis
    y = d3.scaleLinear().range([graphHeight, 0]);

    // Set the domain of the x-axis, set the space between the bars using padding
    const x = d3
        .scaleBand()
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    // Initialize the x-axis
    const xAxis = d3.axisBottom(x);
    // Initialize the y-axis
    const yAxis = d3.axisLeft(y);


    // Reinitialze the data for the bar chart, selecting the appropriate year and country
    let data = completeData[year][country];

    // Variable containing the formatted data
    let graphData;

    // Set the value of the bars to zero if the data of a particular year is not available in the dataset
    if (data === undefined) {
        graphData = {
            'Economy (GDP per Capita)': 0,
            'Freedom to make life choices': 0,
            Generosity: 0,
            'Healthy life expectancy': 0,
            'Trust (Government Corruption)': 0,
        };
    } else {
        // Assign the data to seperate categories
        graphData = {
            'Economy (GDP per Capita)': data['Economy (GDP per Capita)'],
            'Freedom to make life choices': data['Freedom to make life choices'],
            Generosity: data['Generosity'],
            'Healthy life expectancy': data['Healthy life expectancy'],
            'Trust (Government Corruption)': data['Trust (Government Corruption)'],
        };
    }

    // Set the name of a bar equal to the corresponding category
    const barsKeys = Object.keys(graphData);
    // Set the value of a bar equal to the corresponding category
    const barsValues = Object.values(graphData);

    // Initialize the bars in the bar chart
    const bars = [];
    barsKeys.forEach((key, idx) => {
        bars[idx] = { name: barsKeys[idx], value: barsValues[idx] };
    });

    // Dynamically set the domain of the y-axis to category containing the maximum value
    y.domain([0, (Math.ceil(d3.max(barsValues) * 10) / 10).toFixed(1)]);

    // Dynamically set the domain of the x-axis to the categories in the dataset
    x.domain(barsKeys);

    // Associate the data with the available bars
    const rects = graph.selectAll('rect').data(bars);
    rects.exit().remove();

    // Update the bar chart based on the new data
    graph
        .selectAll('rect')
        .transition()
        .duration(500)
        .attr('y', (d) => {
            return y(d.value);
        })
        .attr('height', (d) => {
            return graphHeight - y(d.value);
        });

    // Call the x-axis
    xAxisGroup.call(xAxis);
    // Call the y-axis
    yAxisGroup.call(yAxis);

    // Styling properties of the category names on the x-axis
    xAxisGroup
        .selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor', 'end')
        .attr('fill', 'white')
        .style('font-size', '12px');
}

// Remove the bar chart when a country is deselected
export function removeBarChart() {
    let chart = document.getElementById('chart').querySelector('svg');
    if (chart) {
        chart.remove();
    }
}
