import { defineUnlighthouseConfig } from 'unlighthouse/config'

export default defineUnlighthouseConfig({
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