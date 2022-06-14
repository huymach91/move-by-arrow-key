import { Node } from './node';
import { Line } from './line';
import { Text } from './text';
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
   * @param {{ canvasWidth: number, roadmapText: string, panelBottomTitle: string }} config
   */
  generate(data, config) {
    this.intervalX = 120;
    this.defaultX = config.canvasWidth / 2;
    this.initialX = data.x ? data.x : this.defaultX;
    this.initialY = data.y ? data.y : 200;
    this.maxHeightCanvas = this.initialY * data.length;
    this.spaceBetweenY = 50;
    this.rootList = [];
    // right panel config
    this.panelBottomTitle = config.panelBottomTitle;
    // create title
    const roadmapText = config.roadmapText;
    this.roadmapTitle = new Text({
      text: roadmapText,
      x: config.canvasWidth / 2 - roadmapText.length * 3,
      y: 100,
    });
    this.roadmapTitle.createText(this.p5);

    for (let i = 0; i < data.length; i++) {
      const rootData = data[i];
      rootData.x = this.initialX;
      rootData.y = this.initialY + i * this.initialY;
      // create root
      const root = new Node(rootData);
      root.createNode(this.p5);
      root.defaultEvents((event) => {
        this.showRightPanel(true);
        this.setRightPanelData(event.data);
      });
      this.rootList.push(root);
      // draw line from current root to previous root
      if (i > 0) {
        const lineStart = this.centerPoint(this.rootList[i - 1]);
        const lineEnd = this.centerPoint(root);
        const line = new Line(lineStart, lineEnd, { isBezierCurve: true });
        line.createLine(this.p5);
      }
      // draw leaf
      root.leftSide = [];
      root.rightSide = [];

      root.leftTopSide = [];
      root.leftBottomSide = [];

      root.rightTopSide = [];
      root.rightBottomSide = [];

      root.leafs = [];

      const rootElementWidth = root.getNodeWidth();
      const rootElementHeight = root.getNodeHeight();

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
          // calc x-axis
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
              const previousLeaf = root.leftSide[root.leftSide.length - 1];
              root.leftSide.push(currentChildData);
              currentChildData.y =
                currentRootData.y +
                (root.leftSide.length - 1) * this.spaceBetweenY;
            } else {
              root.rightSide.push(currentChildData);
              currentChildData.y =
                currentRootData.y +
                (root.rightSide.length - 1) * this.spaceBetweenY;
            }
          } else {
            currentChildData.y =
              currentRootData.y + currentChildIndex * this.spaceBetweenY;
            // if (isLeft) {
            //   // const previousLeaf = root.leftSide[root.leftSide.length - 1];
            //   // root.leftSide.push(currentChildData);
            //   const isTop =
            //     root.leftTopSide.length < root.leftBottomSide.length
            //       ? true
            //       : false;
            //   if (isTop) {
            //     root.leftTopSide.push(currentChildData);
            //     currentChildData.y =
            //       currentRootData.y -
            //       (root.leftTopSide.length - 1) * this.spaceBetweenY;
            //   } else {
            //     root.leftBottomSide.push(currentChildData);
            //     currentChildData.y =
            //       currentRootData.y +
            //       (root.leftTopSide.length - 1) * this.spaceBetweenY;
            //   }
            // } else {
            //   const isTop =
            //     root.rightTopSide.length < root.rightBottomSide.length
            //       ? true
            //       : false;
            //   if (isTop) {
            //     root.rightTopSide.push(currentChildData);
            //     const lastIndex = root.rightTopSide.length;
            //     currentChildData.y =
            //       currentRootData.y - lastIndex * this.spaceBetweenY;
            //   } else {
            //     root.rightBottomSide.push(currentChildData);
            //     const lastIndex = root.rightBottomSide.length;
            //     currentChildData.y =
            //       currentRootData.y + lastIndex * this.spaceBetweenY;
            //   }
            //   // root.rightSide.push(currentChildData);
            //   // currentChildData.y =
            //   //   currentRootData.y +
            //   //   (root.rightSide.length - 1) * this.spaceBetweenY;
            // }
          }

          // create leaf node
          const leaf = new Node(currentChildData);
          leaf.createNode(this.p5);
          leaf.setBackgroundColor('#ffe599');
          leaf.defaultEvents(() => {
            this.showRightPanel(true);
          });
          currentChildData.elementHeight = leaf.getNodeHeight();
          root.leafs.push(leaf);
          // create line
          const lineStart = {
            x: currentRootData.x + rootElementWidth / 3,
            y: currentRootData.y + rootElementHeight / 2,
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

  calcY() {}

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
        <button class="markdone-btn">
          <span></span>
          <span>Hoàn thành</span>
        </button>
      </div>
      <div class="blank-body">
        <div class="rm-panel">
          <h1 class="rm-panel-heading"></h1>
          <div class="rm-panel-body"></div>
          <div class="rm-bottom-panel">
            <h4 class="rm-bottom-panel-title">${this.panelBottomTitle}</h4>
            <div class="rm-bottom-panel-body">
              
            </div>
          </div
        </div>
      </div>
    `;

    this.overlay.onclick = this.showRightPanel.bind(this, false);

    this.closeButtonElement = this.blankPage.querySelector('.close-btn');
    this.closeButtonElement.onclick = this.showRightPanel.bind(this, false);

    this.doneButtonElement = this.blankPage.querySelector('.markdone-btn');

    this.panelHeading = this.blankPage.querySelector('.rm-panel-heading');
    this.panelBody = this.blankPage.querySelector('.rm-panel-body');
    this.panelBottom = this.blankPage.querySelector('.rm-bottom-panel');
    this.panelBottomTitle = this.blankPage.querySelector(
      '.rm-bottom-panel-title'
    );
    this.panelBottomBody = this.blankPage.querySelector(
      '.rm-bottom-panel-body'
    );

    document.body.append(this.overlay);
    document.body.append(this.blankPage);
  }

  setRightPanelData(nodeData) {
    let courses = nodeData.courses || [
      { id: 1, courseName: 'abcx', courseType: 'video' },
      { id: 2, courseName: 'abcx', courseType: 'bài viết' },
    ];
    this.panelHeading.innerHTML = nodeData.name;
    this.panelBody.innerHTML = nodeData.description;
    this.panelBottomBody.innerHTML =
      '<ul class="rm-courses">' +
      courses
        .map((course) => {
          return (
            '<li class="rm-course"><span class="rm-course-type">' +
            course.courseType +
            '</span>' +
            '<span class="rm-course-name">' +
            course.courseName +
            '</span>' +
            '</li>'
          );
        })
        .join('') +
      '</ul>';
  }

  showRightPanel(show) {
    this.overlay.style.setProperty('display', show ? 'block' : 'none');
    this.blankPage.style.setProperty('display', show ? 'block' : 'none');
  }

  setNodeDone() {
    doneButtonElement.onclick = this.setNodeDone.bind(this);
  }
}
