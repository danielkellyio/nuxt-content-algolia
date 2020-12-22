# Nuxt Content Algolia Module
Automatically (during `npm run generate`) sync content stored in your project with nuxt content to an [Algolia](https://www.algolia.com) index. This allows you to manage your content in your repo while providing powerful search capabilities to your site users.

Works great with sites hosted on Netlify, etc that automatically run your build command when you commit new content.

## Installation
```
npm install nuxt-content-algolia algoliasearch
```

## Quickstart
```javascript
// nuxt.config.js
export default{
    buildModules: [
        'nuxt-content-algolia',
        // ...
    ],
    nuxtContentAlgolia: {
        appId: process.env.ALGOLIA_APP_ID,
        // !IMPORTANT secret key should always be an environment variable
        // this is not your search only key but the key that grants access to modify the index
        apiKey: process.env.ALGOLIA_API_KEY, 
        
        // relative to content directory
        // each path get's its own index
        paths: [
            {
                name: 'blog',
                // optional (will use name if index not specified)
                index: process.env.ALGOLIA_INDEX || 'blog',
                fields: ['title', 'description', 'bodyPlainText', 'tags'],
            },
        ],
    },
}
```
