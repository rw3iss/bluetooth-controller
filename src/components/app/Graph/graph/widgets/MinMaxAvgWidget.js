export default class MinMaxAvgWidget {

    minimum = Number.MAX_VALUE;
    maximum = 0;
    average = undefined;

    // styles
    minLineColor = '#aa2244';
    minLineWidth = 2;
    avgLineColor = '#5555cc';
    avgLineWidth = 2;
    maxLineColor = '#22aa44';
    maxLineWidth = 2;

    constructor() {
    }

    update(g) {
        let data = g.getData();
        let total = 0;
        for (var i = 0; i < data.length; i++ ) {
            let d = data[i];
            if (d.y < this.minimum) this.minimum = d.y;
            if (d.y > this.maximum) this.maximum = d.y;
            total += d.y;
        }
        this.average = total/data.length;
    }

    // todo: verify, and move these calculations to update()
    render(g) {
        let xStart = g.axesPadding+g.axesLineWidth;
        let xEnd = g.width - g.axesPadding;//*2 - g.dataMargin;
        let yStart = g.height-g.axesPadding-g.axesLineWidth/2+1;
        let yDist = g.yMax-g.yMin;

        let minYPerc = (this.minimum-g.yMin) / yDist;
        let avgYPerc = (this.average-g.yMin) / yDist;
        let maxYPerc = (this.maximum-g.yMin) / yDist;

        let minYPos = g.height * minYPerc - (g.axesPadding*2)-g.axesLineWidth/2;
        let avgYPos = g.height * avgYPerc - (g.axesPadding*2)-g.axesLineWidth/2;
        let maxYPos = g.height * maxYPerc - (g.axesPadding*2)-g.axesLineWidth/2;

        // max:
        g.drawLine(xStart, yStart-maxYPos-g.axesLineWidth+this.minLineWidth/2, 
            xEnd, yStart-maxYPos-g.axesLineWidth+this.minLineWidth/2, this.maxLineColor, this.maxLineWidth);
        g.drawText(this.maximum, xEnd, yStart-maxYPos-g.textOffset, null, g.graphFont, this.maxLineColor);
        // avg:
        g.drawLine(xStart, yStart-avgYPos-g.axesLineWidth+this.avgLineWidth/2, 
            xEnd, yStart-avgYPos-g.axesLineWidth+this.avgLineWidth/2, this.avgLineColor, this.avgLineWidth);
        g.drawText(this.average, xEnd, yStart-avgYPos-g.textOffset, null, g.graphFont, this.avgLineColor);
        // min:
        g.drawLine(xStart, yStart-minYPos-g.axesLineWidth+this.maxLineWidth/2, 
            xEnd, yStart-minYPos-g.axesLineWidth+this.maxLineWidth/2, this.minLineColor, this.minLineWidth);
        g.drawText(this.minimum, xEnd, yStart-minYPos-g.textOffset, null, g.graphFont, this.minLineColor);
    }

}
