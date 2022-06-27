// Import stylesheets
import './style.css';
import p5 from 'p5';
import { RoadmapGenerator } from './roadmap-generator';

export class RoadmapStartup {

  constructor(data, config) {
    this.data   = data;
    this.config = config;
    this.size = {
      width: config.width,
      height: config.height
    }
  }

  startup() {
    var size = this.size;
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(size.width, size.height);
        const roadmapGenerator = new RoadmapGenerator(p);
        roadmapGenerator.generate(this.data, {
          canvasWidth: innerWidth,
          roadmapText: this.config.title,
          panelBottomTitle: this.config.panelBottomTitle ? this.config.panelBottomTitle : 'Free Content',
          completedToggleButtonText: this.config.completedToggleButtonText ? this.config.completedToggleButtonText : 'Completed',
          inCompletedToggleButtonText: 'Pending',
          videoText: 'video',
          articleText: 'read',
          markDoneFunc: (nodeData, newStatus) => {
            console.log('fetch', nodeData, newStatus);
          }
        });
        document.addEventListener('afterCanvasInit', (event) => {
          const maxHeightCanvas = event.detail.maxHeightCanvas;
          size.height = maxHeightCanvas;
          p.resizeCanvas(size.width, size.height);
        });
      };
    
      p.draw = () => {};
    };
    
    new p5(sketch, this.config.container);
  }

}

// const rm = new RoadmapStartup(rawData.samples2, {
//   title: "Front-end"
// });
// rm.startup();