/**
 * Pure generator sorting algorithm.
 * Yields operation events; does not touch DOM, timers, or UI.
 */
export default function* treeSort(arr) {
  let a = [...arr];
  let n = a.length;

  class Node {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
    }
  }

  let root = null;
  yield { type: "line", line: 2, description: "Building Binary Search Tree from array elements...", array: [...a], indices: [] };

  function insert(node, val) {
    if (!node) return new Node(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }

  for (let i = 0; i < n; i++) {
    root = insert(root, a[i]);
    yield { type: "pivot", indices: [i], array: [...a], line: 2, description: `Inserted ${a[i]} into BST` };
  }

  let idx = 0;
  function* inorder(node) {
    if (!node) return;
    yield* inorder(node.left);
    a[idx] = node.val;
    yield { type: "overwrite", indices: [idx], array: [...a], line: 4, description: `BST In-order Traversal: placed ${node.val} at arr[${idx}]` };
    idx++;
    yield* inorder(node.right);
  }

  yield* inorder(root);
  for (let k = 0; k < n; k++) yield { type: "markSorted", indices: [k], array: [...a], line: 4, description: "Tree Sort Complete!" };
}

/** 19. LIBRARY SORT (Gapped Insertion Sort) */
