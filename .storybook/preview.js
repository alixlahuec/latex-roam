/* istanbul ignore file */
import { useEffect, useGlobals } from "@storybook/addons";

import { ExportManager } from "../src/extension";

import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/select/lib/css/blueprint-select.css";
import "../src/index.css";

import A11Y_RULES from "./a11y-rules";


// https://storybook.js.org/docs/react/essentials/toolbars-and-globals
const withTheme = (Story, context) => {
    const [{ theme }, /* updateGlobals */] = useGlobals();

  useEffect(() => {
    document.getElementById("root").parentElement.setAttribute("latex-roam-dark-theme", (theme == "dark").toString());
  }, [theme]);

  useEffect(() => {
    window.latexRoam = new ExportManager();
  }, []);

  return <div style={{ margin: "50px", padding: "20px", height: "1000px" }}>
    <Story {...context} />
  </div>;
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['light', 'dark'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
      // Change title based on selected value
      dynamicTitle: true,
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
    a11y: {
        config: {
            rules: A11Y_RULES
        }
    }
}

export const decorators = [withTheme];