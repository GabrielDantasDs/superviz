import { List } from "@/interfaces/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getInitialState = (): ProjectState => {
	let initialId = "";
	let initialName = "";
	let initialLists = [];
	let initialCardActivities = [];

	if (typeof window !== "undefined") {
		initialId = localStorage.getItem("project_id") ?? "";
		initialName = localStorage.getItem("project_title") ?? "";

		let project_cards_activities = localStorage.getItem("cards_activities");
		let project_lists = localStorage.getItem("project_lists");

		if (project_lists !== null) {
			initialLists = JSON.parse(project_lists);
		} else {
			initialLists = [];
		}

		if (project_cards_activities !== null) {
			initialCardActivities = JSON.parse(project_cards_activities);
		} else {
      initialCardActivities = [];
		}
	}

	return {
		id: initialId,
		name: initialName,
		lists: initialLists,
		cards_activities: initialCardActivities,
	};
};

interface ProjectState {
	id: string;
	name: string;
	lists: List[];
	cards_activities: [];
}

const initialState: ProjectState = {
	id: "",
	name: "",
	lists: [],
	cards_activities: [],
};

const projectSlice = createSlice({
	name: "project",
	initialState: getInitialState,
	reducers: {
		setProject: (state, action: PayloadAction<ProjectState>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.lists = action.payload.lists;
      state.cards_activities = action.payload.cards_activities
		},
	},
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;
