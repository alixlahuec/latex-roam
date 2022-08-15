import ExportDialog from "../ExportDialog";

import { pageUIDWithFigure } from "../../../mocks/roam";

import { expect, jest } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";

import { sleep } from "../../../.storybook/utils";


export default {
	component: ExportDialog,
	args: {
		isOpen: true,
		onClose: jest.fn(),
		uid: pageUIDWithFigure
	},
	argTypes: {
		onClose: { action: true }
	}
};

const Template = (args) => <ExportDialog {...args} />;

export const Default = Template.bind({});
Default.play = async({ args, canvasElement }) => {

	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		blob: () => Promise.resolve(new Blob([{ some: "content" }]))
	}));

	const frame = within(canvasElement.parentElement);

	const exportButton = frame.getByRole("button", { name: "Generate LaTeX" });
	await userEvent.click(exportButton);

	await sleep(3000);

	await expect(frame.getByRole("textbox", { name: "Generated LaTeX output" }))
		.toBeInTheDocument();
	await expect(frame.getByRole("button", { name: "Open in Overleaf" }))
		.toBeInTheDocument();
	await expect(frame.getByRole("button", { name: ".TEX" }))
		.toBeInTheDocument();
	await expect(frame.getByRole("button", { name: "Figures (1)" }))
		.toBeInTheDocument();

	const closeButton = frame.getByRole("button", { name: "Close dialog" });
	await userEvent.click(closeButton);
	await expect(args.onClose).toHaveBeenCalled();

};