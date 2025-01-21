import CanvasDrawingContext from './CanvasDrawingContext';

/*
Todo: render Labels for all data and widgets AFTER they render themselves... (two render passes...)

*/
export default class Graph extends CanvasDrawingContext {

    data = undefined;
    config = undefined;

    zoomLevel = 1;
    xMin = undefined;
    xMax = undefined; // todo
    yMin = undefined; // todo
    yMax = undefined; // todo

    widgets = [];

    // styling params: can be moved...

    chartStyle = 'bar'; // bar, point, line

    fontColor = '#ffffff';
    textXOffset = 0;
    textYOffset = -5;

    axesLineWidth = 4;
    axesPadding = 40;
    axesFont = '16px sans-serif';
    axesColor = '#228855';

    graphFont = '12px sans-serif';
    dataMargin = 10;

    // bar styles:
    barWidth = undefined;

    // point styles:
    pointRadius = 7;
    pointColor = '#ffd452';
    pointBorder = 1;

    // line styles:
    lineColor = '#898a6d';

    gradientColor = ['#ffd452', '#898a6d', '#544a7d'];

    // end styling params

    constructor(canvasContext, config = {}) {
        super(canvasContext);
        this.width = config.width || 400;
        this.height = config.height || 400;
        this.config = config;
        if (config.style) this.chartStyle = config.style;
    }

    setData(data) {
        this.data = data;
        this.xMin = 1;
        this.xMax = data.length;
    }

    getData() {
        return this.data;
    }

    setMinMax(min, max) {
        this.yMin = min;
        this.yMax = max;
    }

    setZoomLevel() {
    }

    // adds a width to the graph view state
    addWidget(widget) {
        this.widgets.push(widget);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.render();
    }

    render() {
        this.clear();
        this.renderAxes();
        this.renderData();
        this.renderWidgets();
    }

    // render the axes at some offset from width and height
    renderAxes() {
        // x axis
        this.drawLine(0 + this.axesPadding + this.axesLineWidth / 2, 0 + this.axesPadding, 0 + this.axesPadding + this.axesLineWidth / 2, 0 + this.height - this.axesPadding, this.axesColor, this.axesLineWidth);
        this.drawText('Time', 0 + this.width / 2 - (this.axesPadding / 2), 0 + this.height - (this.axesPadding / 2), 0, this.axesFont, this.fontColor);
        this.drawText(this.xMin, 0 + (this.axesPadding), 0 + this.height - (this.axesPadding / 2), 0, this.graphFont, this.fontColor);
        this.drawText(this.xMax, 0 + this.width - (this.axesPadding), 0 + this.height - (this.axesPadding / 2), 0, this.graphFont, this.fontColor);
        // y axis
        this.drawLine(0 + this.axesPadding, 0 + this.height - this.axesPadding - this.axesLineWidth / 2, 0 + this.width - this.axesPadding, 0 + this.height - this.axesPadding - this.axesLineWidth / 2, this.axesColor, this.axesLineWidth);
        this.drawText('Value', 0 + (this.axesPadding / 2), 0 + this.height / 2 - (this.axesPadding / 2), 90, this.axesFont, this.fontColor);
        this.drawText(this.yMin, 0 + (this.axesPadding / 2), 0 + this.height - (this.axesPadding) - (20), 90, this.graphFont, this.fontColor);
        this.drawText(this.yMax, 0 + (this.axesPadding / 2), 0 + (this.axesPadding) + (20), 90, this.graphFont, this.fontColor);
    }

    // render the graph from the dimensions and current zoom level
    renderData() {
        console.log(`renderData`, this.data);
        // todo: zoom = 2 = 50% zoom in (only show half points);

        let xStart = 0 + this.axesPadding + this.axesLineWidth;
        let yStart = 0 + this.height - this.axesPadding - this.axesLineWidth;

        let drawData = (i, point, dataWidth, nextPt, color) => {
            //console.log(`drawData`, i, point, dataWidth, color);
            let xPos = i * dataWidth;
            // yh = (graph height) * (this value's percent over total y) - (paddings)
            let yHeight = this.height * ((point.y - this.yMin) / (this.yMax - this.yMin)) - (this.axesPadding * 2) - this.axesLineWidth / 2;
            let textXOffset = this.textXOffset;
            let textYOffset = this.textYOffset;

            let center = (xStart + xPos + this.dataMargin) + (dataWidth - this.dataMargin) / 2;

            switch (this.chartStyle) {
                case 'bar':
                    if (this.barWidth) {
                        this.drawRect(center - this.barWidth / 2, yStart - yHeight, this.barWidth, yHeight, null, this.gradientColor);
                    } else {
                        this.drawRect(xStart + xPos + this.dataMargin, yStart - yHeight, dataWidth - this.dataMargin, yHeight, null, color || this.gradientColor);
                    }
                    break;

                case 'point':
                    this.drawCircle(center + this.pointRadius / 2, yStart - yHeight, this.pointRadius, this.pointBorder, color || this.pointColor, this.gradientColor);
                    textYOffset = textYOffset - this.pointRadius;
                    textXOffset = textXOffset + this.pointRadius / 2;
                    break;

                case 'line':
                    let xEnd = center + dataWidth - this.pointRadius / 2;//-this.dataMargin;
                    let yEnd = yStart - yHeight;

                    textYOffset = textYOffset - this.pointRadius;
                    textXOffset = textXOffset + this.pointRadius / 2;

                    // draw a line connecting to next point
                    if (nextPt) {
                        let nextYHeight = this.height * ((nextPt.y - this.yMin) / (this.yMax - this.yMin)) - (this.axesPadding * 2) - this.axesLineWidth / 2;
                        yEnd = yStart - nextYHeight;
                        this.drawLine(center + this.pointRadius / 2, yStart - yHeight, xEnd, yEnd, this.lineColor);
                    }

                    this.drawCircle(center + this.pointRadius / 2, yStart - yHeight,
                        this.pointRadius, this.pointBorder, this.pointColor, color || this.gradientColor);

                    break;
                default:
                    throw "chartStyle not supported.";
            }

            this.drawText(point.y.toString(), center + textXOffset, yStart - yHeight + textYOffset, 0, this.graphFont, this.fontColor);
        }

        const layerColor = (d) => {
            const layer = this.config.layers.find(l => l.id == d.id);
            console.log(`layerColor`, d, self, layer);
            return layer?.color || "black";
        }

        const drawLayerData = (d) => {
            let dl = d.data.length;
            console.log(`DLD`, d, this)
            let dataWidth = (this.width - this.axesPadding * 2 - this.dataMargin - this.axesLineWidth) / (dl);
            for (let i = 0; i < dl; i++) {
                let p = d.data[i];
                // calculate where to draw this point
                drawData(i, p, dataWidth, i < dl ? d.data[i + 1] : null);//layerColor(d));
            }
        };

        if (this.data) {
            if (Array.isArray(this.data)) {
                this.data.forEach(d => drawLayerData(d));
            } else {
                drawLayerData(this.data);
            }

        }
    }

    // render the widgets after the data is rendered.
    renderWidgets() {
        for (let i in this.widgets) {
            this.widgets[i].update(this);
            this.widgets[i].render(this);
        }
    }

}
