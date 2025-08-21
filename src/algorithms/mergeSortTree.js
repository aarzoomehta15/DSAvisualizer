let __id = 0;
const newId = () => (++__id).toString();

function makeNode(arr, left = null, right = null) {
  return { id: newId(), arr: [...arr], left, right };
}

function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id,
    arr: [...node.arr],
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function pushFrame(frames, root, type, activeId, meta = {}) {
  frames.push({
    tree: cloneTree(root), 
    // deep copy so previous frames persist visually
    type,                  
    // "split"  "mergeStep"  "merged"
    activeId,
    meta,                  
    // e.g. {from:"L"/"R", picked: number}
  });
}

function buildSplitTree(arr, frames) {
  const root = makeNode(arr);
  // first appearance of this node
  // (record so the very first frame shows the full array as a root)
  // NB: activeId = root.id to lightly highlight
  pushFrame(frames, root, "split", root.id);

  function split(node) {
    if (node.arr.length <= 1) return;

    const mid = Math.floor(node.arr.length / 2);
    node.left = makeNode(node.arr.slice(0, mid));
    node.right = makeNode(node.arr.slice(mid));

    // show this node just split into two children
    pushFrame(frames, root, "split", node.id);

    split(node.left);
    split(node.right);
  }

  split(root);
  return root;
}

function mergeBottomUp(root, frames) {
  function mergeNode(node) {
    if (!node.left && !node.right) {
      // leaf; already "merged"
      pushFrame(frames, root, "merged", node.id);
      return node.arr;
    }

    const L = mergeNode(node.left);
    const R = mergeNode(node.right);

    let i = 0, j = 0;
    const merged = [];

    // per-pick merge steps
    while (i < L.length && j < R.length) {
      if (L[i] <= R[j]) {
        merged.push(L[i]);
        i++;
        node.arr = [...merged, ...L.slice(i), ...R.slice(j)];
        pushFrame(frames, root, "mergeStep", node.id, { from: "L", picked: merged[merged.length - 1] });
      } else {
        merged.push(R[j]);
        j++;
        node.arr = [...merged, ...L.slice(i), ...R.slice(j)];
        pushFrame(frames, root, "mergeStep", node.id, { from: "R", picked: merged[merged.length - 1] });
      }
    }
    while (i < L.length) {
      merged.push(L[i]);
      i++;
      node.arr = [...merged, ...L.slice(i), ...R.slice(j)];
      pushFrame(frames, root, "mergeStep", node.id, { from: "L", picked: merged[merged.length - 1] });
    }
    while (j < R.length) {
      merged.push(R[j]);
      j++;
      node.arr = [...merged, ...L.slice(i), ...R.slice(j)];
      pushFrame(frames, root, "mergeStep", node.id, { from: "R", picked: merged[merged.length - 1] });
    }

    node.arr = merged;
    // final state for this node
    pushFrame(frames, root, "merged", node.id);
    return merged;
  }

  mergeNode(root);
}

//Public API
export function getMergeSortFrames(array) {
  __id = 0; // reset ids for every run
  const frames = [];
  const root = buildSplitTree(array, frames);
  mergeBottomUp(root, frames);
  return frames;
}
