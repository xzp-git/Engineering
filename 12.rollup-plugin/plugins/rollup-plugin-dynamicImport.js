function dynamicImportPlugin(options = {}) {
    return {
      name: 'dynamicImport',
      renderDynamicImport() {
        console.log('renderDynamicImport');
        return {
          left: `dynamicImportPolyfill(`,
          right: `,import.meta.url)`
        }
      }
    }
  }
  export default dynamicImportPlugin;
  