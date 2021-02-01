import * as d3 from 'd3';

var graph;

// Height and Width of the graph
const totalGraphWidth = 800;
const totalGraphHeight = 400;

// create margins and dimensions
const margin = { top: 50, right: 20, bottom: 100, left: 50 };
const graphWidth = totalGraphWidth - margin.left - margin.right;
const graphHeight = totalGraphHeight - margin.top - margin.bottom;

// Scale the y - axis
var y;

export function initBarChart(completeData, country) {
    // Add the svg frame
    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', `0 0 ${totalGraphWidth} ${totalGraphHeight}`);

    // Append the graph
    graph = svg
        .append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Append the x - axis, set the position of the axis at 0
    const xAxisGroup = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`);
    // Append the y - axis
    const yAxisGroup = graph.append('g');

    // Scale the y - axis
    y = d3.scaleLinear().range([graphHeight, 0]);

    // Scale the x - axis, select space between bars using padding
    const x = d3
        .scaleBand()
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    // Add a title to the graph
    const xTitle = graph
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', graphWidth + 10)
        .attr('y', graphHeight + 50)
        .attr('fill', 'white')
        .text('Category');

    // Add a title to the graph
    const yTitle = graph
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', margin.right)
        .attr('y', -20)
        .attr('fill', 'white')
        .text('Value');

    // Load both axis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Set the data to the country data
    const data = completeData[yearSlider.value][country];
    const graphData = data;
    delete graphData['Country'];
    delete graphData['Region'];
    delete graphData['Happiness Rank'];
    delete graphData['Happiness Score'];

    // Name on the x-axis
    const barsKeys = Object.keys(graphData);
    // Value on the x-axis
    const barsValues = Object.values(graphData);

    // Create bar charts
    const bars = [];
    barsKeys.forEach((key, idx) => {
        bars[idx] = { name: barsKeys[idx], value: barsValues[idx] };
    });

    // Range of values
    y.domain([0, (Math.ceil(d3.max(barsValues) * 10) / 10).toFixed(1)]);

    // Number of categories
    x.domain(barsKeys);

    // Tie data to the rects available
    const rects = graph.selectAll('rect').data(bars);
    rects.exit().remove();

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

    // Call both axis
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Lay-out text below graph
    xAxisGroup
        .selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor', 'end')
        .attr('fill', 'white')
        .style('font-size', '17px')
        .style('font-family', 'sans-serif');

    function handleMouseOver(d, i) {
        // Add interactivity
        // Use D3 to select element, change color and size
        d3.select(this).style('fill', '#B3B6B7');

        let valueCharacter = i.value.toString();

        // Specify where to put label of text
        const hover = graph
            .append('text')
            .transition()
            .duration(500)
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

    function handleMouseOut(d, i) {
        d3.select(this).attr('style', '#FFFFFF');
        d3.selectAll('.hover').remove(); // Remove text location
    }
}

// Update the data according to the new category
export function updateBarChartData(completeData, year, country) {
    // Set the data to the country data
    const data = completeData[year][country];
    const graphData = data;
    delete graphData['Country'];
    delete graphData['Region'];
    delete graphData['Happiness Rank'];
    delete graphData['Happiness Score'];

    // Name on the x-axis
    const barsKeys = Object.keys(graphData);
    // Value on the x-axis
    const barsValues = Object.values(graphData);

    // Create bar charts
    const bars = [];
    barsKeys.forEach((key, idx) => {
        bars[idx] = { name: barsKeys[idx], value: barsValues[idx] };
    });

    // Tie data to the rects available
    const rects = graph.selectAll('rect').data(bars);
    rects.exit().remove();

    graph
        .selectAll('rect')
        .transition()
        .duration(500)
        .attr('y', (d) => {
            console.log('new d', d);
            return y(d.value);
        })
        .attr('height', (d) => {
            console.log('new height', d.value);
            return graphHeight - y(d.value);
        });
}
