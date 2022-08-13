import ExportDialog from "../ExportDialog";

import { defaultPageUID } from "../../../mocks/roam";


export default {
	component: ExportDialog,
	args: {
		isOpen: true,
		onClose: () => {},
		uid: defaultPageUID
	}
};

const Template = (args) => <ExportDialog {...args} />;

export const Default = Template.bind({});