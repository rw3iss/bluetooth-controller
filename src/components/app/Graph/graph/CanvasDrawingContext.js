// TODO:
// change most of these arguments to Options {} object

export default class CanvasDrawingContext {
    
    ctx = undefined;

    constructor(context) {
        console.log('ctx', context)
        this.ctx = context;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    // returns a gradient through the n-size colors
    // todo: determine size
    createGradient(x, y, w, h, colors) {
        let gradient = this.ctx.createLinearGradient(x, y, x+w, y+h);
        for(let i in colors) {
            gradient.addColorStop(i/colors.length, colors[i]);
        }
        return gradient;
    }

    drawLine(x, y, x2, y2, color, width) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        if (width) {
            this.ctx.lineWidth = width;
        }
        if (color) {
            this.ctx.strokeStyle = color; 
        }
        this.ctx.stroke();
    }

    drawRect(x, y, w, h, color, gradient) {
        this.ctx.save();
        this.ctx.beginPath();
        if (gradient) {
            this.ctx.fillStyle = this.createGradient(x, y, w, h, gradient);
        } else if (color) {
            this.ctx.fillStyle = color;
        }
        this.ctx.fillRect(x, y, w, h);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawRectGradient(x, y, x2, y2) {
        grd.addColorStop(0, "black");
        grd.addColorStop(1, "white");

        ctx.fillStyle = grd;
        ctx.fillRect(20, 20, 150, 100);
    }

    drawCircle(x, y, radius, border, color, gradient) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        if (gradient) {
            this.ctx.fillStyle = this.createGradient(x, y, radius*2, radius*2, gradient);
        } else if (color) {
            this.ctx.fillStyle = color;
        }
        this.ctx.fill();
        this.ctx.lineWidth = border;
        this.ctx.strokeStyle = '#123';
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawText(text, x, y, angle, font, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.textAlign = "center";
        if (font)
            this.ctx.font = font;
        if (angle) {
            this.ctx.rotate(angle * (Math.PI / 180));
        }
        if (color) {
            this.ctx.fillStyle = color;
        }
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    }

}
