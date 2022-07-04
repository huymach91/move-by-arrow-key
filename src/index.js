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
        roadmapGenerator.generate(
          this.data, 
          Object.assign({
            canvasWidth: innerWidth,
            roadmapText: this.config.title,
            panelBottomTitle: 'Khóa học',
            completedToggleButtonText: 'Hoàn thành',
            inCompletedToggleButtonText: 'Chưa hoàn thành',
            videoText: 'video',
            articleText: 'read',
            showCourseType: false,
            position: 'left',
            // readonly: true,
            // rightPanelZIndex: 10,
            markDoneFunc: (nodeData, status) => {
              // console.log(nodeData, status)
            }
          }, this.config)
        );
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