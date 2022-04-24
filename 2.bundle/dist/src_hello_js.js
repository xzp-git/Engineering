window["chunkGlobal"].push([
  ["src_hello_js"],
  {
    "./src/hello.js": (module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        default: () => _DEFAULT_EXPORT__,
      });
      const _DEFAULT_EXPORT__ = "hello";
    },
  },
]);
