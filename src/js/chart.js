import * as d3 from 'd3';
import { raycastToGlobe } from './webgl/globe/globe.js'
// Import scene file
import {
    scene,
    canvas,
    camera,
    mouse,
    renderer,
    controls,
    raycaster,
} from './webgl/scene.js';

export function initChart(completeData, country) {
    console.log('data: ', completeData);
    console.log('country: ', country);
    console.log('data[country]', completeData[country]);

    // Height and Width of the graph
    const totalGraphWidth = 800;
    const totalGraphHeight = 400;

    // create margins and dimensions
    const margin = { top: 50, right: 20, bottom: 100, left: 50 };
    const graphWidth = totalGraphWidth - margin.left - margin.right;
    const graphHeight = totalGraphHeight - margin.top - margin.bottom;

    // Add the svg frame
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', totalGraphWidth)
        .attr('height', totalGraphHeight)
    //.attr('viewBox', '0 0 size size');

    // Append the graph
    const graph = svg.append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Append the x - axis, set the position of the axis at 0
    const xAxisGroup = graph.append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
    // Append the y - axis
    const yAxisGroup = graph.append('g');

    // Scale the y - axis
    const y = d3.scaleLinear()
        .range([graphHeight, 0])

    // Scale the x - axis, select space between bars using padding
    const x = d3.scaleBand()
        .range([0, graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    // Add a title to the graph
    const xTitle = graph.append('text')
        .attr('text-anchor', 'end')
        .attr('x', graphWidth + 10)
        .attr('y', graphHeight + 50)
        .attr('fill', 'white')
        .text('Category');

    // Add a title to the graph
    const yTitle = graph.append('text')
        .attr('text-anchor', 'end')
        .attr('x', margin.right)
        .attr('y', - 20)
        .attr('fill', 'white')
        .text('Value');

    // Load both axis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Set the data to the country data
    const data = completeData[country];
    const graphData = data;
    delete graphData['Region'];
    delete graphData['Happiness Rank'];
    delete graphData['Happiness Score'];

    // Name on the x-axis
    const barsKeys = Object.keys(graphData);
    // Value on the x-axis
    const barsValues = Object.values(graphData);

    // Create bar charts
    const bars = []
    barsKeys.forEach((key, idx) => {
        bars[idx] = { name: barsKeys[idx], value: barsValues[idx] }
    });

    // Range of values
    y.domain([0, Math.ceil(d3.max(barsValues))])

    // Number of categories
    x.domain(barsKeys);

    // Tie data to the rects available
    const rects = graph
        .selectAll('rect')
        .data(bars)

    rects.enter()
        .append('rect')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .attr('width', x.bandwidth)
        .attr('height', 0)
        .attr('fill', 'white')
        .attr('x', d => x(d.name))
        .attr('y', graphHeight)
        .merge(rects) // Everything called below merge affects both entered and currently existing elements
        .transition().duration(1500)
        .attr('y', d => {
            if (typeof d.value === 'string') {
                const newValue = d.value.replace(/,/g, '.')
                console.log('new y', newValue);
                return y(newValue);
            }
            console.log('new d', d.value);
            return y(d.value);
        })
        .attr('height', d => {
            if (typeof d.value === 'string') {
                const newValue = d.value.replace(/,/g, '.')
                console.log('new height', newValue);
                return graphHeight - y(newValue);
            }
            return graphHeight - y(d.value);
        });

    // Call both axis
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Lay-out text below graph
    xAxisGroup.selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor', 'end')
    //     .attr('fill', 'white')
    //     .style('font-size', '17px')
    //     .style('font-family', 'sans-serif')

    function handleMouseOver(d, i) {  // Add interactivity
        // Use D3 to select element, change color and size
        d3.select(this)
            .style('fill', '#B3B6B7');

        let valueCharacter = i.value.toString();

        // Specify where to put label of text
        const hover = graph.append('text')
            .transition()
            .duration(500)
            .attr('id', 't' + d.x + '-' + d.y)
            .attr('y', graphHeight - (parseInt(d3.select(this).attr('height')) / 2))
            .attr('x', parseInt(d3.select(this).attr('x')) + (parseInt(d3.select(this).attr('width')) / 2 - 12))
            .attr('pointer-events', 'none')
            .attr('class', 'hover')
            .style('fill', '#FFFFFF')
            .text(valueCharacter.substring(0, 4));
    }

    function handleMouseOut(d, i) {
        d3.select(this).attr('style', '#FFFFFF')
        d3.selectAll('.hover').remove();  // Remove text location
    }
}


