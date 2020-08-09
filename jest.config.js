module.exports = {
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest',
        '^.(lodash-es)+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: [
        'node_modules/(?!@ngrx|lodash-es)'
    ],
    resolver: '@nrwl/jest/plugins/resolver',
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageReporters: ['html']
};
