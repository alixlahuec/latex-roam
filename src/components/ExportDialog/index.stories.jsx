import ExportDialog from "../ExportDialog";

import { defaultPageUID } from "../../../mocks/roam";

import { expect, jest } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";

import { sleep } from "../../../.storybook/utils";


export default {
	component: ExportDialog,
	args: {
		isOpen: true,
		onClose: jest.fn(),
		uid: defaultPageUID
	},
	argTypes: {
		onClose: { action: true }
	}
};

const Template = (args) => <ExportDialog {...args} />;

export const Default = Template.bind({});
Default.play = async({ args, canvasElement }) => {
	const frame = within(canvasElement.parentElement);

	const exportButton = frame.getByRole("button", { name: "Export page contents" });
	await userEvent.click(exportButton);

	await sleep(3000);

	await expect(frame.getByRole("textbox", { name: "Generated LaTeX output" }))
		.toBeInTheDocument();
	await expect(frame.getByRole("button", { name: "Export to Overleaf" }))
		.toBeInTheDocument();
	await expect(frame.getByRole("button", { name: "Download .tex file" }))
		.toBeInTheDocument();

	const closeButton = frame.getByRole("button", { name: "Close" });
	await userEvent.click(closeButton);
	await expect(args.onClose).toHaveBeenCalled();

};