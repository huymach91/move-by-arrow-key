import { Node } from './node';
import { Line } from './line';
import { Text } from './text';
import { preorderTraversal, levelOrderTraversal } from './helper';

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
    this.readonly = config.readonly;
    this.rightPanelZIndex = config.rightPanelZIndex;
    this.startX = config.startX ? config.startX : this.alignCanvas(config);
    this.startY = config.startY ? config.startY : 200;
    this.initialX = data.x ? data.x : this.startX;
    this.initialY = data.y ? data.y : this.startY;
    this.maxHeightCanvas = this.initialY * data.length;
    this.spaceBetweenY = 50;
    this.rootList = [];
    this.rootNodes = [];
    this.leftColumn = {};
    this.rightColumn = {};
    // right panel config
    this.panelBottomTitle = config.panelBottomTitle;
    this.videoText = config.videoText;
    this.articleText = config.articleText;
    this.showCourseType = config.showCourseType;
    this.courseData = config.courseData;
    this.completedToggleButtonText = config.completedToggleButtonText;
    this.inCompletedToggleButtonText = config.inCompletedToggleButtonText;
    this.markDoneFunc = config.markDoneFunc;
    this.updateSizeFunc = config.updateSizeFunc;
    this.rootBackgroundColor = config.rootBackgroundColor;
    this.rootTextColor = config.rootTextColor;
    this.childBackgroundColor = config.childBackgroundColor;
    this.childTextColor = config.childTextColor;
    // create title
    const roadmapText = config.roadmapText;
    this.roadmapTitle = new Text({
      text: roadmapText,
      x: this.startX - roadmapText.length,
      y: this.startY - 50,
    });
    this.roadmapTitle.createText(this.p5);

    for (let i = 0; i < data.length; i++) {
      const rootData = data[i];
      rootData.x = this.initialX;
      rootData.y = this.initialY + i * this.initialY;
      rootData.level = 0;
      rootData.backgroundColor = this.rootBackgroundColor;
      rootData.textColor = this.rootTextColor;
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
      root.setBackgroundColor(rootData.backgroundColor);
      root.setTextColor(rootData.textColor);

      root.defaultEvents((event) => {
        this.showRightPanel(true);
        this.setRightPanelData(event);
      });

      if (this.readonly) {
        root.setTickHide();
      }

      this.rootList.push(rootData);
      this.rootNodes.push(root);

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
          currentRootData.leafs = [];
          currentChildData.parentData = currentRootData;
          currentChildData.backgroundColor = this.childBackgroundColor;
          currentChildData.textColor = this.childTextColor;
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
          leaf.setBackgroundColor(currentChildData.backgroundColor);
          leaf.setTextColor(currentChildData.textColor);

          leaf.defaultEvents((event) => {
            this.showRightPanel(true);
            this.setRightPanelData(event);
          });

          if (this.readonly) {
            leaf.setTickHide();
          }

          this.rootNodes.push(leaf);

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
          currentRootData.leafs.push(leaf);

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
          this.maxHeightCanvas = rootData.maxChildY;

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

    this.updateSizeFunc({ maxHeightCanvas: this.maxHeightCanvas });
    // document.dispatchEvent(
    //   new CustomEvent('afterCanvasInit', {
    //     detail: { maxHeightCanvas: this.maxHeightCanvas },
    //   })
    // );
    this.createRightPanel();
  }

  alignCanvas(config) {
    const canvasWidth = config.canvasWidth;
    switch(config.position) {
      case 'left':
        return canvasWidth / 3;
      default:
        return canvasWidth / 2;
    }
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
    const line = new Line(startPoint, endPoint, { style: 'dash' });
    line.createLine(this.p5);
  }

  drawLineFromLeft(nodeStart, nodeEnd) {
    const startPoint = {
      x: nodeStart.x + nodeStart.width - 10,
      y: nodeStart.y + nodeStart.height / 3,
    };
    const endPoint = {
      x: nodeEnd.x,
      y: nodeEnd.y + nodeEnd.height / 3,
    };
    const line = new Line(startPoint, endPoint, { style: 'dash' });
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
    this.overlay.style.setProperty('z-index', this.rightPanelZIndex - 1);

    this.blankPage = document.createElement('div');
    this.blankPage.setAttribute('class', 'blank-page');
    this.blankPage.style.setProperty('z-index', this.rightPanelZIndex);
    this.blankPage.innerHTML = `
      <div class="blank-header">
        <span class="close-btn">&#x2715</span>
        <button class="toggle-btn">
          <span class="toggle-btn-icon material-icons"></span>
          <span class="toggle-btn-text"></span>
        </button>
      </div>
      <hr />
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

    if (this.readonly) {
      this.toggleButtonElement.style.setProperty('display', 'none');
    }

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

  setRightPanelData(event) {
    const nodeData = event.data;
    let courses = nodeData.courses || [];
    this.panelHeading.innerHTML = nodeData.name;
    this.panelBody.innerHTML = nodeData['description'] || '';
    this.panelBottomBody.innerHTML =
      '<ul class="rm-courses">' +
      courses
        .filter((course) => course.name)
        .map((course) => {
          let backgroundClass = '';
          let courseTypeName = '';
          const hideCourseTypeClass = this.showCourseType ? '' : 'rm-hidden';
          const href = course.courseLink
            ? 'href="' + course.courseLink + '" target="_blank"'
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
            '<li class="rm-course"><span class="rm-course-type ' + hideCourseTypeClass + ' ' +
            backgroundClass +
            '">' +
            courseTypeName +
            '</span>' +
            '<a ' +
            href +
            '><span class="rm-course-name">' +
            course.name +
            '</span>' +
            '</a></li>'
          );
        })
        .join('') +
      '</ul>';

    this.showCourseContent(courses.length ? true : false);

    this.setNodeDone(event);
    this.setStatus(nodeData);
  }

  showRightPanel(show) {
    this.overlay.style.setProperty('display', show ? 'block' : 'none');
    this.blankPage.style.setProperty('display', show ? 'block' : 'none');
  }

  showCourseContent(show) {
    if (show) {
      this.panelBottom.classList.remove('rm-hidden');
    } else {
      this.panelBottom.classList.add('rm-hidden');
    }
  }

  setNodeDone(event) {
    const nodeData = event.data;
    // mark itself
    this.toggleButtonElement.onclick = () => {
      const completed = this.toggleButtonElement.classList.contains('completed')
        ? false
        : true;
      // set tick to green if completed
      levelOrderTraversal({ id: 0, name: '', children: [nodeData] }, (childData) => {
        if (childData.name) {
          childData.completed = completed;
          const firstNode = this.findRootNode(childData);
          this.setTickColor(firstNode, childData.completed);
        }
      });

      // // emit
      if (nodeData.parentData) {
        const parentData = nodeData.parentData;
        const parentNode = this.findRootNode(parentData);
        if (parentData.children && parentData.children.length) {
            const isParentCompleted = this.completeParent(parentData);
            parentData.completed = isParentCompleted;
            parentNode.data.completed = isParentCompleted;
            this.setTickColor(parentNode, parentNode.data.completed);
        }
      }
      
      this.markDoneFunc(nodeData, completed);
      this.setStatus(nodeData);
    };
  }
 
  setTickColor(node, completed) {
    if (completed) {
      node.colorizeTick('green');
    } else {
      node.colorizeTick('default');
    }
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
  }

  findRootNode(nodeData) {
    return this.rootNodes.find(r => r.data.id === nodeData.id && r.data.name === nodeData.name);
  }

  completeParent(root) {
    let isCompleted = true;
    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i];
      if (!child.completed) {
        isCompleted = false;
      }
    }
    return isCompleted;
  }

}
