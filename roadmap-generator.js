import { Node } from './node';
import { Line } from './line';
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
    this.intervalX = 120;
    this.defaultX = config.canvasWidth / 2;
    this.initialX = data.x ? data.x : this.defaultX;
    this.initialY = data.y ? data.y : 200;
    this.maxHeightCanvas = this.initialY * data.length;
    this.rootList = [];

    for (let i = 0; i < data.length; i++) {
      const rootData = data[i];
      rootData.x = this.initialX;
      rootData.y = this.initialY + i * this.initialY;
      rootData.borderColor = 'red';
      // create root
      const root = new Node(rootData);
      root.createNode(this.p5);
      root.defaultEvents(() => {
        this.showRightPanel(true);
      });
      this.rootList.push(root);
      // draw line from current root to previous root
      if (i > 0) {
        const lineStart = this.centerPoint(this.rootList[i - 1]);
        const lineEnd = this.centerPoint(root);
        const line = new Line(lineStart, lineEnd);
        line.createLine(this.p5);
      }
      // draw leaf
      const leftSide = [];
      const rightSide = [];
      const rootElementWidth = root.getNodeWidth();
      preorderTraversal(
        rootData,
        (currentRootData, currentChildData, currentChildIndex) => {
          const isFirstLevel =
            root.data.name === currentRootData.name ? true : false;
          const isLeft = currentChildIndex % 2 !== 0 ? true : false;
          currentChildData.isLeft = isLeft;
          // currentChildData.x = isLeft ? currentRootData.x - rootElementWidth - 50 : currentRootData.x + rootElementWidth + 50;
          const childLength = currentChildData.name.length * 6;
          let leftX = currentRootData.x - rootElementWidth - this.intervalX;
          const rightX = currentRootData.x + rootElementWidth + this.intervalX;
          // create leafs (calc x-axis)
          if (isLeft) {
            leftX -= childLength;
          }
          if (isFirstLevel) {
            currentChildData.x = isLeft ? leftX : rightX;
          } else {
            if (currentRootData.isLeft) {
              currentChildData.x = leftX;
            } else {
              currentChildData.x = rightX;
            }
          }
          // calc y-axis
          if (isFirstLevel) {
            if (isLeft) {
              leftSide.push(currentChildData);
              currentChildData.y =
                currentRootData.y + (leftSide.length - 1) * 50;
            } else {
              rightSide.push(currentChildData);
              currentChildData.y =
                currentRootData.y + (rightSide.length - 1) * 50;
            }
          } else {
            currentChildData.y = currentRootData.y - currentChildIndex * 50;
          }
          const leaf = new Node(currentChildData);
          leaf.createNode(this.p5);
          leaf.defaultEvents(() => {
            this.showRightPanel(true);
          });
          // create line
          const lineStart = {
            x: currentRootData.x + root.getNodeWidth() / 3,
            y: currentRootData.y + root.getNodeHeight() / 2,
          };
          const lineEnd = {
            x: currentChildData.x + leaf.getNodeWidth() / 3,
            y: currentChildData.y + leaf.getNodeHeight() / 2,
          };
          const line = new Line(lineStart, lineEnd);
          line.createLine(this.p5);
        }
      );
    }
    // console.log('maxHeightCanvas', this.p5, this.maxHeightCanvas);
    document.dispatchEvent(
      new CustomEvent('afterCanvasInit', {
        detail: { maxHeightCanvas: this.maxHeightCanvas },
      })
    );
    // this.afterViewInit.dispatchEvent(this.afterViewInit);
    this.createRightPanel();
  }

  centerPoint(node) {
    return {
      x: node.data.x + node.getNodeWidth() / 2,
      y: node.data.y + node.getNodeHeight() / 2,
    };
  }

  drawLineRightToLeft(nodeStart, nodeEnd) {
    const lineStart = {
      x: nodeStart.data.x + nodeStart.getNodeWidth() / 2,
      y: nodeStart.data.y + nodeStart.getNodeHeight() / 2,
    };
    const lineEnd = {
      x: nodeEnd.data.x + nodeEnd.getNodeWidth(),
      y: nodeEnd.data.y + nodeEnd.getNodeHeight() / 2,
    };
    const line = new Line(lineStart, lineEnd);
    line.createLine(this.p5);
  }

  drawLineLeftToRight(nodeStart, nodeEnd) {}

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
          <div class="rm-panel-body-2">
            <ul></ul>
          </div
        </div>
      </div>
    `;

    this.overlay.onclick = this.showRightPanel.bind(this, false);

    const closeButtonElement = this.blankPage.querySelector('.close-btn');
    closeButtonElement.onclick = this.showRightPanel.bind(this, false);

    document.body.append(this.overlay);
    document.body.append(this.blankPage);
  }

  showRightPanel(show, nodeData) {
    this.overlay.style.setProperty('display', show ? 'block' : 'none');
    this.blankPage.style.setProperty('display', show ? 'block' : 'none');
  }
}
