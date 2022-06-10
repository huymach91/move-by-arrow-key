// Import stylesheets
import './style.css';
import p5 from 'p5';
import rawData from './sample-data.json';
import { RoadmapGenerator } from './roadmap-generator';

var size = {
  width: window.innerWidth,
  height: 2500,
};

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(size.width, size.height);
    // let treeData = dataGenerator(rawData['samples']);
    let samples2 = rawData['samples2'];

    const roadmapGenerator = new RoadmapGenerator(p);
    roadmapGenerator.generate(samples2, { canvasWidth: innerWidth });
  };

  p.draw = () => {};

  p.windowResized = () => {
    p.resizeCanvas(size.width, size.height);
  };
};

new p5(sketch);
