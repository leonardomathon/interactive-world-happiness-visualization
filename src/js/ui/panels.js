import { jsPanel } from 'jspanel4/es6module/jspanel.js';
import 'jspanel4/es6module/extensions/hint/jspanel.hint.js';
import 'jspanel4/es6module/extensions/modal/jspanel.modal.js';
import { initChart } from '../chart.js';

const panelTheme = {
    bgPanel: '#10224D',
    bgContent: '#0f1629c2',
    colorHeader: '#fff',
    colorContent: `#fff`,
};

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
        theme: panelTheme,
        borderRadius: '.5rem',
        panelSize: {
            width: 400,
            height: 450,
        },
        headerTitle:
            'World Happiness report ' + yearSliderValue + ' - JSON Dataset',
        dragit: {
            cursor: 'default',
        },
        position: {
            my: 'right-bottom',
            at: 'right-bottom',
            offsetX: -5,
            offsetY: -69,
        },
        closeOnEscape: true,
        data: JSON.stringify(yearWorldHappiness, null, '\t'),
        callback: function () {
            this.content.innerHTML = `<pre><code style="font-size:12px;">${this.options.data}</code></pre>`;
        },
    });
}

// Creates a panel that shows a bar chart visualization
export function createBarChartPanel(panelTitle, contentHtml) {
    return jsPanel.create({
        theme: panelTheme,
        borderRadius: '.5rem',
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
        content: contentHtml,
    });
}

// Creates a panel that shows a bar chart visualization
export function createScatterPanel(panelTitle, contentHtml, footerHtml) {
    return jsPanel.create({
        theme: panelTheme,
        borderRadius: '.5rem',
        panelSize: {
            width: 550,
            height: 360,
        },
        resizeit: {
            aspectRatio: 'content',
        },
        position: {
            my: 'left-top',
            at: 'left-top',
            offsetX: 15,
            offsetY: 425,
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
        content: contentHtml,
        footerToolbar: footerHtml,
    });
}

// Creates a panel that shows a bar chart visualization
export function createLineChartPanel(panelTitle, contentHtml) {
    return jsPanel.create({
        theme: panelTheme,
        borderRadius: '.5rem',
        panelSize: {
            width: 500,
            height: 300,
        },
        position: {
            my: 'right-bottom',
            at: 'right-bottom',
            offsetX: -5,
            offsetY: -69,
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
        content: contentHtml,
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
