import { Node } from './node';
import { preorderTraversal } from './helper';

import './style.css';

export class RoadmapGenerator {
  /**
   * @param {p5js} p5 - this is an instance of p5js
   */
  constructor(p5) {
    this.p5 = p5;
  }

  /**
   * @param {Array<{ id: string, name: string }>} data
   * @param {{ canvasWidth: number }} config
   */
  generate(data, config) {
    this.interval = 50;
    this.defaultX = config.canvasWidth / 2;
    this.initialX = data.x ? data.x : this.defaultX;
    this.initialY = data.y ? data.y : 150;

    for (let i = 0; i < data.length; i++) {
      const rootData = data[i];
      rootData.x = this.initialX;
      rootData.y = this.initialY + i * this.initialY;
      // create root
      const root = new Node(
        Object.assign(
          {
            x: this.initialX,
            y: this.initialY + i * this.initialY,
          },
          rootData
        )
      );
      root.createNode(this.p5);
      root.defaultEvents(() => {
        this.showRightPanel(true);
      });

      const rootElementWidth = root.getNodeWidth();
      preorderTraversal(
        rootData,
        (currentRootData, currentChildData, currentChildIndex) => {
          // create leafs
          console.log('rootElementWidth', rootElementWidth);
          currentChildData.x = currentRootData.x - rootElementWidth - 50;
          currentChildData.y = currentRootData.y - (currentChildIndex + 1) * 50;
          const leaf = new Node(currentChildData);
          leaf.createNode(this.p5);
          console.log(currentChildData);
        }
      );
    }

    this.createRightPanel();
  }

  insertTreeWithSamples2(node) {
    // 1. handle current node
    this.treeData.addChild(this.treeData, node);
    // 2. recusive children
    if (node.children && node.children.length) {
      // this.insertTreeWithSamples2();
    }
  }

  createRightPanel() {
    this.overlay = document.createElement('div');
    this.overlay.setAttribute('class', 'roadmap-overlay');

    this.blankPage = document.createElement('div');
    this.blankPage.setAttribute('class', 'blank-page');

    this.blankPage.innerHTML = `
      <div class="blank-header">
        <span class="close-btn">&#x2715</span>
        <button class="mark-done">
          <span></span>
          <span>Hoàn thành</span>
        </button>
      </div>
      <div class="blank-body">
        <div class="rm-panel">
          <h1 class="rm-panel-heading">Internet</h1>
          <div class="rm-panel-body">
            The Internet is a global network of computers connected to each other which communicate through a standardized set of protocols.
          </div>
        </div>
      </div>
    `;

    this.overlay.onclick = this.showRightPanel.bind(this, false);

    const closeButtonElement = this.blankPage.querySelector('.close-btn');
    closeButtonElement.onclick = this.showRightPanel.bind(this, false);

    document.body.append(this.overlay);
    document.body.append(this.blankPage);
  }

  showRightPanel(show) {
    this.overlay.style.setProperty('display', show ? 'block' : 'none');
    this.blankPage.style.setProperty('display', show ? 'block' : 'none');
  }
}