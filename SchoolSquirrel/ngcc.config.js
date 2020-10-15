module.exports = {
    packages: {
        "nativescript-localize": {
            entryPoints: {
                ".": {
                    override: {
                        main: "./angular.js",
                        typings: "./angular.d.ts",
                    },
                    ignoreMissingDependencies: true,
                },
            },
            ignorableDeepImportMatchers: [
                /@nativescript\/core\//,
            ],
        },
    },
};
