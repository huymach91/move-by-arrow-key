// Import stylesheets
import './style.css';
import p5 from 'p5';
import rawData from './sample-data.json';
import { RoadmapGenerator } from './roadmap-generator';

var size = {
  width: 4000,
  height: 2500,
};

const sketch = (p) => {
  p.setup = () => {
    // let treeData = dataGenerator(rawData['samples']);
    p.createCanvas(size.width, size.height);

    let samples2 = rawData['samples2'];

    const roadmapGenerator = new RoadmapGenerator(p);
    // roadmapGenerator.dagreVersion(samples2);
    roadmapGenerator.generate(samples2, {
      canvasWidth: innerWidth,
      roadmapText: 'Back-end',
      panelBottomTitle: 'Free Content',
      completedToggleButtonText: 'Completed',
      inCompletedToggleButtonText: 'Pending',
      videoText: 'video',
      articleText: 'read',
      markDoneFunc: (nodeData, newStatus) => {
        console.log('fetch', nodeData, newStatus);
      },
    });
    document.addEventListener('afterCanvasInit', (event) => {
      const maxHeightCanvas = event.detail.maxHeightCanvas;
      size.height = maxHeightCanvas;
      p.resizeCanvas(size.width, size.height);
    });
  };

  p.draw = () => {};
};

new p5(sketch);
