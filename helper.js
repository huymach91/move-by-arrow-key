export function dataGenerator(rawData) {
  var output = {};

  rawData.sort(function (a, b) {
    return !a['order'] || !b['order'] ? 1 : a['order'] - b['order'];
  });

  for (let item of rawData) {
    const key = item.parent;
    if (!key) {
      output[key] = [];
      continue;
    }
    const refs = output[key] || [];
    refs.push(item);

    output[key] = refs;
  }

  return output;
}

/**
 * @summary levelOrderTraversal
 * @node { id: number, name: string, children: [] }
 */
function levelOrderTraversal(root) {
  if (!root) return;
  // Standard level order traversal code
  // using queue
  let q = [root];
  let level = 0;
  while (q.length) {
    let n = q.length;
    level++;

    while (n) {
      const p = q.pop();
      const children = p.children || [];
      // console.log(String('').padStart(level, '-') + p.name)
      for (let i = 0; i < children.length; i++) {
        q.unshift(children[i]);
      }
      n--;
    }
  }
}

/**
 * @summary preorderTraversal
 * @node { id: number, name: string, children: [] }
 */
export function preorderTraversal(root, fn) {
  const children = root.children || [];

  // childDepth['level']++;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    child.level = root.level + 1;
    fn(root, child, i); // do other thing
    preorderTraversal(children[i], fn);
  }
}
