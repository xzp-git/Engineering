const pathLib = require("path");
const babel = require("@babel/core");
const types = require("@babel/types");
const AnnotationMap = {
  TSNumberKeyword: "NumericLiteral",
};
