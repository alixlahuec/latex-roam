const path = require("path");

module.exports = {
    "stories": ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
    "addons": ["@storybook/addon-a11y", "@storybook/addon-controls", "@storybook/addon-coverage", "@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
    "framework": "@storybook/react",
    features: {
        interactionsDebugger: true,
    },
    core: {
        builder: "webpack5"
    },
    webpackFinal: async (config) => {
        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    "Roam": require.resolve("../mocks/roam.js")
                }
            }
        }
    },
};