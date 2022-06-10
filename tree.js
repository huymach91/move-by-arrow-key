import { Node } from './node';

export class Tree {
  constructor(data) {
    this.data = new Node(data);
    this.children = [];
  }

  addChild(root, data) {
    const newNode = Node(data);
    if (!root) {
      return new Tree(newNode);
    }
    this.children.push(newNode);
  }
}
