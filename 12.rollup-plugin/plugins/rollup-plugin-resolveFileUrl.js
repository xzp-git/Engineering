const resolveFilePlugin = (options = {}) => {
  return {
    name: "resolveFileUrl",
    resolveId(source) {
      if (source === "logger") {
        return source;
      }
    },
    load(importee) {
      if (importee === "logger") {
        //向输出目录里生成一个新的文件，文件名叫logger.js 文件内容叫  'export default "logger"'
        let referenceId = this.emitFile({
          type: "asset",
          source: 'export default "logger"',
          fileName: "logger.js",
        });
      }
    },
  };
};

export default resolveFilePlugin;
