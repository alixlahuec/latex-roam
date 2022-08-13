export const A11Y_RULES = [
    {
        id: "color-contrast",
        // axe-playwright currently generates inconsistent results for color contrast.
        // Mark violations for review rather than triggering a fail
        reviewOnFail: true
    }
];