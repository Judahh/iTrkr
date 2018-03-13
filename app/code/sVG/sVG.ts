import * as d3 from 'd3';

export class SVG{
    private static instance: SVG;
    private d3;

    constructor() {
        this.d3 = d3;
    }

    public static getInstance(): SVG {
        if (!SVG.instance) {
            SVG.instance = new SVG();
        }
        return SVG.instance;
    }

    getD3(){
        return this.d3;
    }
}