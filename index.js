// Import stylesheets
import './style.css';
import p5 from 'p5';
import rawData from './sample-data.json';
import { RoadmapGenerator } from './roadmap-generator';

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(innerWidth, innerHeight);
    // let treeData = dataGenerator(rawData['samples']);
    let samples2 = rawData['samples2'];

    const roadmapGenerator = new RoadmapGenerator(p);
    roadmapGenerator.generate(samples2, { canvasWidth: innerWidth });
  };

  p.draw = () => {};

  p.windowResized = () => {
    p.resizeCanvas(innerWidth, innerHeight);
  };
};

new p5(sketch);
