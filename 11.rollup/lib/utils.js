const walk = require('./ast/walk');
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function replacementIdentifiers(statement, source, replacements) {
  walk(statement, {
    enter(node) {
      if (node.type === 'Identifier') {
        if (node.name && replacements[node.name]) {
          //age=>age$2
          source.overwrite(node.start, node.end, replacements[node.name]);
        }
      }
    }
  });
}

exports.hasOwnProperty = hasOwnProperty;
exports.replacementIdentifiers = replacementIdentifiers;