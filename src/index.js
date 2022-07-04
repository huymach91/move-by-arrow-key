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
          panelBottomTitle: this.config.panelBottomTitle ? this.config.panelBottomTitle : 'Khóa học',
          completedToggleButtonText: this.config.completedToggleButtonText ? this.config.completedToggleButtonText : 'Hoàn thành',
          inCompletedToggleButtonText: 'Chưa hoàn thành',
          videoText: 'video',
          articleText: 'read',
          showCourseType: false,
          position: 'center',
          readonly: true,
          markDoneFunc: (nodeData, status) => {
            console.log(nodeData, status)
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