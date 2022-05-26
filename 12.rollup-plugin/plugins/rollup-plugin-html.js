function  htmlPlugin() {
    return {
        naem: 'html',
        // 生成额外的文件
        generateBunble(options, bundle){
            let entryName //入口文件的名称
            for(let fileName in bundle){
                let assetOrChunkInfo = bundle[fileName]
                if (assetOrChunkInfo.isEntry) {
                    entryName = fileName
                }
            }
        }
    }
}


export default htmlPlugin