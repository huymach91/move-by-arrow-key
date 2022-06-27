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
   * @param {{
   *    canvasWidth: number,
   *    roadmapText: string,
   *    panelBottomTitle: string,
   *    videoText: string,
   *    articleText: string
   *    markDoneFunc: Function
   * }} config
   */
  generate(data, config) {
    this.intervalX = 50;
    this.defaultX = config.canvasWidth / 2;
    this.initialX = data.x ? data.x : this.defaultX;
    this.initialY = data.y ? data.y : 200;
    this.maxHeightCanvas = this.initialY * data.length;
    this.spaceBetweenY = 50;
    this.rootList = [];
    this.leftColumn = {};
    this.rightColumn = {};
    // right panel config
    this.panelBottomTitle = config.panelBottomTitle;
    this.videoText = config.videoText;
    this.articleText = config.articleText;
    this.completedToggleButtonText = config.completedToggleButtonText;
    this.inCompletedToggleButtonText = config.inCompletedToggleButtonText;
    this.markDoneFunc = config.markDoneFunc;
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
      rootData.level = 0;
      // calc next y-axis
      if (i > 0) {
        const previousRoot = this.rootList[i - 1];
        // const currentY = rootData.y;
        // const nextY = Math.max(currentY, previousRoot.maxChildY);
        rootData.y = previousRoot.maxChildY + 60;
        rootData.previousNode = previousRoot;
      }
      // create root
      const root = new Node(rootData);
      root.createNode(this.p5);
      root.defaultEvents((event) => {
        this.showRightPanel(true);
        this.setRightPanelData(event.data);
      });
      this.rootList.push(rootData);

      rootData.maxChildY = root.element.y;
      rootData.maxLeftChildY = root.element.y;
      rootData.maxRightChildY = root.element.y;
      rootData.width = root.getNodeWidth();
      rootData.height = root.getNodeHeight();

      // draw line from current root to previous root
      if (i > 0) {
        const previousRoot = this.rootList[i - 1];
        const lineStart = this.centerPoint(previousRoot);
        const lineEnd = this.centerPoint(rootData);
        const line = new Line(lineStart, lineEnd, { isBezierCurve: true });
        line.createLine(this.p5);
      }
      // draw leaf
      root.leftSide = [];
      root.rightSide = [];
      root.leafs = [];

      preorderTraversal(
        rootData,
        (currentRootData, currentChildData, currentChildIndex) => {
          // console.log(currentChildData.name, currentChildData.level);
          // root start from 2nd
          const isFirstLevel =
            root.data.name === currentRootData.name ? true : false;
          const isLeft = isFirstLevel
            ? currentChildIndex % 2 !== 0
              ? true
              : false
            : currentRootData.isLeft;
          currentChildData.isLeft = isLeft;

          let leftX = currentRootData.x - this.intervalX;
          const rightX =
            currentRootData.x + currentRootData.width + this.intervalX;

          // calc x-axis
          if (isLeft) {
            currentChildData.x = leftX;
          } else {
            currentChildData.x = rightX;
          }

          // add to left, right columns
          const childLevel = currentChildData.level;
          if (isLeft) {
            const leftColumn = this.leftColumn[childLevel] || [];
            leftColumn.push(currentChildData);
            this.leftColumn[childLevel] = leftColumn;
          } else {
            const rightColumn = this.rightColumn[childLevel] || [];
            rightColumn.push(currentChildData);
            this.rightColumn[childLevel] = rightColumn;
          }

          // calc y-axis
          if (isFirstLevel) {
            if (isLeft) {
              root.leftSide.push(currentChildData);
              const maxLeftChildY =
                currentChildIndex === 1
                  ? currentRootData.maxLeftChildY
                  : currentRootData.maxLeftChildY + this.spaceBetweenY;
              currentChildData.y = maxLeftChildY;
            } else {
              root.rightSide.push(currentChildData);
              const maxRightChildY =
                currentChildIndex === 0
                  ? currentRootData.maxRightChildY
                  : currentRootData.maxRightChildY + this.spaceBetweenY;
              currentChildData.y = maxRightChildY;
            }
          } else {
            let childY =
              currentRootData.y + currentChildIndex * this.spaceBetweenY;
            currentChildData.y = childY;
          }

          // create leaf node
          const leaf = new Node(currentChildData);
          leaf.createNode(this.p5);
          leaf.setBackgroundColor('#ffe599');
          leaf.defaultEvents((event) => {
            this.showRightPanel(true);
            this.setRightPanelData(event.data);
          });

          currentChildData.width = leaf.getNodeWidth();
          currentChildData.height = leaf.getNodeHeight();

          if (isLeft) {
            currentChildData.x -= currentChildData.width;
            leaf.setX(currentChildData.x);
            leaf.setTickTopLeft();
          } else {
            leaf.setTickTopRight();
          }

          root.leafs.push(leaf);

          if (isLeft) {
            currentRootData.maxLeftChildY = Math.max(
              currentRootData.maxLeftChildY,
              currentChildData.y
            );
            currentChildData.maxLeftChildY = currentChildData.y;
            rootData.maxLeftChildY = currentRootData.maxLeftChildY;
          } else {
            currentRootData.maxRightChildY = Math.max(
              currentRootData.maxRightChildY,
              currentChildData.y
            );
            currentChildData.maxRightChildY = currentChildData.y;
            rootData.maxRightChildY = currentRootData.maxRightChildY;
          }
          // find max y

          rootData.maxChildY = Math.max(
            rootData.maxChildY,
            rootData.maxRightChildY,
            rootData.maxLeftChildY,
            currentChildData.y
          );

          // create line
          const startNode = isFirstLevel ? rootData : currentRootData;
          if (isLeft) {
            this.drawLineFromRight(startNode, currentChildData);
          } else {
            this.drawLineFromLeft(startNode, currentChildData);
          }
        }
      );
    }

    document.dispatchEvent(
      new CustomEvent('afterCanvasInit', {
        detail: { maxHeightCanvas: this.maxHeightCanvas },
      })
    );
    this.createRightPanel();
  }

  drawLineFromRight(nodeStart, nodeEnd) {
    const startPoint = {
      x: nodeStart.x,
      y: nodeStart.y + nodeStart.height / 3,
    };
    const endPoint = {
      x: nodeEnd.x + nodeEnd.width - 20,
      y: nodeEnd.y + nodeEnd.height / 2,
    };
    const line = new Line(startPoint, endPoint, { style: 'dotted' });
    line.createLine(this.p5);
  }

  drawLineFromLeft(nodeStart, nodeEnd) {
    console.log(nodeStart.name, nodeStart.x, nodeStart.width);
    const startPoint = {
      x: nodeStart.x + nodeStart.width - 10,
      y: nodeStart.y + nodeStart.height / 3,
    };
    const endPoint = {
      x: nodeEnd.x,
      y: nodeEnd.y + nodeEnd.height / 3,
    };
    const line = new Line(startPoint, endPoint, { style: 'dotted' });
    line.createLine(this.p5);
  }

  centerPoint(node) {
    return {
      x: node.x + node.width / 2,
      y: node.y + node.height / 2,
    };
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
        <button class="toggle-btn">
          <span class="toggle-btn-icon material-icons"></span>
          <span class="toggle-btn-text"></span>
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

    this.toggleButtonElement = this.blankPage.querySelector('.toggle-btn');

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
      {
        id: 1,
        courseName: '',
        courseType: 'video',
        link: 'https://google.com',
      },
      {
        id: 2,
        courseName: "An Absolute Beginner's Guide to Using npm",
        courseType: 'article',
        link: 'https://google.com',
      },
    ];
    this.panelHeading.innerHTML = nodeData.name;
    this.panelBody.innerHTML = nodeData['description'] || '';
    this.panelBottomBody.innerHTML =
      '<ul class="rm-courses">' +
      courses
        .filter((course) => course.courseName)
        .map((course) => {
          let backgroundClass = '';
          let courseTypeName = '';
          const href = course.link
            ? 'href="' + course.link + '" target="_blank"'
            : '';
          if (course.courseType === 'video') {
            backgroundClass = 'bg-orange';
            courseTypeName = this.videoText;
          } else if (course.courseType === 'article') {
            backgroundClass = 'bg-purple';
            courseTypeName = this.articleText;
          } else {
          }
          return (
            '<li class="rm-course"><span class="rm-course-type ' +
            backgroundClass +
            '">' +
            courseTypeName +
            '</span>' +
            '<a ' +
            href +
            '><span class="rm-course-name">' +
            course.courseName +
            '</span>' +
            '</a></li>'
          );
        })
        .join('') +
      '</ul>';

    this.setNodeDone(nodeData);
    this.setStatus(nodeData);
  }

  showRightPanel(show) {
    this.overlay.style.setProperty('display', show ? 'block' : 'none');
    this.blankPage.style.setProperty('display', show ? 'block' : 'none');
  }

  setNodeDone(nodeData) {
    this.toggleButtonElement.onclick = () => {
      const newStatus = this.toggleButtonElement.classList.contains('completed')
        ? false
        : true;
      nodeData.completed = newStatus;
      this.markDoneFunc(nodeData, newStatus);
      this.setStatus(nodeData);
    };
  }

  setStatus(nodeData) {
    const icon = this.toggleButtonElement.querySelector('.toggle-btn-icon');
    const text = this.toggleButtonElement.querySelector('.toggle-btn-text');
    if (nodeData['completed']) {
      this.toggleButtonElement.classList.add('completed');
      this.toggleButtonElement.classList.remove('pending');
      text.textContent = this.completedToggleButtonText;
      icon.innerHTML = 'done';
    } else {
      this.toggleButtonElement.classList.remove('completed');
      this.toggleButtonElement.classList.add('pending');
      text.textContent = this.inCompletedToggleButtonText;
      icon.innerHTML = 'refresh';
    }
    console.log(this.toggleButtonElement);
  }
}