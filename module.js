const consola = require('consola')
const algoliasearch = require('algoliasearch')

export default function algoliaModule(moduleOptions = {}) {
    this.options.nuxtContentAlgolia = this.options.nuxtContentAlgolia || {}
    const config = {
        hook: 'generate:done',
        ...this.options.nuxtContentAlgolia,
        ...moduleOptions,
    }
    
    if (!config.appId || !config.apiKey) {
        consola.error(
            new Error('appId and apiKey are required for nuxt-algolia module')
        )
        return
    }
    
    this.nuxt.hook(config.hook, async (nuxt) => {
        const { $content } = require(`${nuxt.options.srcDir}/node_modules/@nuxt/content`)
        for (let i = 0; i < config.paths.length; i++) {
            const path = config.paths[i]
            const indexName = path.index || path.name
            let docs = await $content(path.name).fetch()
            
            docs = docs.map((doc) => {
                const newDoc = {}
                path.fields.forEach((field) => (newDoc[field] = doc[field]))
                newDoc.objectID = doc.slug
                return newDoc
            })
            
            const client = algoliasearch(config.appId, config.apiKey)
            const index = client.initIndex(indexName)
    
            // clear the index in case any documents were removed
            index.clearObjects()
            
            const { objectIDs } = await index.saveObjects(docs)
            consola.success(
                `Indexed ${objectIDs.length} records in Algolia for: ${indexName}`
            )
        }
    })
}

module.exports.meta = require('./package.json')
