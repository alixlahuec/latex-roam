import ExportButton from ".";
import { defaultPageUID } from "../../../mocks/roam";


export default {
	component: ExportButton,
	args: {
		uid: defaultPageUID
	}
};

const Template = (args) => <ExportButton {...args} />;

export const Default = Template.bind({});