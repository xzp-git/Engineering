/**
 * 以深度优先的方式遍历此节点
 * @param {*} astNode 
 * @param {*} param1 
 */
function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}
function visit(node, parent, enter, leave) {
  if (enter) {
    enter.call(null, node, parent);
  }
  const keys = Object.keys(node).filter(key => typeof node[key] == 'object');
  keys.forEach(key => {
    let value = node[key];
    if (Array.isArray(value)) {
      value.forEach(child => visit(child, node, enter, leave))
    } else if (value && value.type) {
      visit(value, node, enter, leave)
    }
  });
  if (leave) {
    leave.call(null, node, parent);
  }
}
module.exports = walk;