import { jsPanel } from 'jspanel4/es6module/jspanel.js';
import 'jspanel4/es6module/extensions/hint/jspanel.hint.js';
import 'jspanel4/es6module/extensions/modal/jspanel.modal.js';
import { initChart } from '../chart.js';

// Creates a warning of GPU utilization
export function createGPUHintPanel() {
    jsPanel.hint.create({
        position: 'center-top 0 15 down',
        contentSize: '330 auto',
        content:
            '<p class="p-2 text-sm">The hover function is very GPU intensive. The application might become less responsive.</p>',
        theme: '#b12424 filled',
        headerTitle:
            '<i class="ri-error-warning-line mr-2"></i> Performance warning',
        closeOnEscape: true,
        autoclose: {
            time: '4s',
            progressbar: false,
        },
    });
}

// Creates a panel that shows the current dataset
export function createDatasetPanel(yearSliderValue, yearWorldHappiness) {
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
}

// Creates a panel that shows a visualization
export function createGraphPanel(panelTitle, html) {
    return jsPanel.create({
        theme: {
            bgPanel: '#10224D',
            bgContent: '#0f1629c2',
            colorHeader: '#fff',
            colorContent: `#fff`,
        },
        panelSize: {
            width: 500,
            height: 300,
        },
        position: {
            my: 'left-top',
            at: 'left-top',
            offsetX: 15,
            offsetY: 100,
        },
        headerControls: {
            minimize: 'remove',
            close: 'remove',
            size: 'md',
        },
        headerTitle: panelTitle,
        dragit: {
            cursor: 'default',
        },
        content: html,
        maximizedMargin: [25, 25, 25, 25],
        closeOnEscape: true,
    });
}

export function createErrorPanel(errorTitle, errorMsg) {
    jsPanel.hint.create({
        position: 'center-top 0 15 down',
        contentSize: '330 auto',
        content: `<p class="p-2 text-sm">${errorMsg}</p>`,
        theme: '#b12424 filled',
        headerTitle: `<i class="ri-error-warning-line mr-2"></i> ${errorTitle}`,
        closeOnEscape: true,
        autoclose: {
            time: '4s',
            progressbar: false,
        },
    });
}

// // Creates a panel that shows the chart visualization
// export function createChartPanel(completeData, country) {
//     jsPanel.create({
//         theme: {
//             bgPanel: '#000',
//             bgContent: '#0f0f0f',
//             colorHeader: '#fff',
//             colorContent: `#fff`,
//         },
//         panelSize: {
//             width: () => window.innerWidth * 0.3,
//             height: '50vh',
//         },
//         headerTitle:
//             'World Happiness report',
//         dragit: {
//             cursor: 'default',
//         },
//         maximizedMargin: [25, 25, 25, 25],
//         closeOnEscape: true,
//         data: initChart(completeData, country),
//         callback: function () {
//             this.content.innerHTML = `<pre><code>${initChart(completeData, country)}</code></pre>`;
//         },
//     });
// }