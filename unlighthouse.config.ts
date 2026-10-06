import { defineUnlighthouseConfig } from 'unlighthouse/config'
import { siteUrl } from './src/data/site.mjs'

export default defineUnlighthouseConfig({
    site: siteUrl,
    scanner: {
        samples: 1,
        throttle: true,
        exclude: [
            '/404',
            '/api/*',
        ],
    },

    lighthouseOptions: {
        onlyCategories: [
            'performance',
            'accessibility',
            'best-practices',
            'seo',
        ],
    },
})
