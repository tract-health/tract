import {
  PATIENTS_GET_LIST,
  PATIENTS_GET_LIST_SUCCESS,
  PATIENTS_GET_LIST_ERROR,
  PATIENTS_GET_LIST_WITH_FILTER,
  PATIENTS_GET_LIST_WITH_ORDER,
  PATIENTS_GET_LIST_SEARCH,
  PATIENTS_ADD_ITEM,
  PATIENTS_ADD_ITEM_SUCCESS,
  PATIENTS_ADD_ITEM_ERROR,
  PATIENTS_REMOVE_ITEM,
  PATIENTS_REMOVE_ITEM_SUCCESS,
  PATIENTS_REMOVE_ITEM_ERROR,
  PATIENTS_SELECTED_ITEMS_CHANGE,
  PATIENTS_DISCHARGE_ITEM,
  PATIENTS_DISCHARGE_ITEM_SUCCESS,
  PATIENTS_DISCHARGE_ITEM_ERROR
} from 'Constants/actionTypes'

const INIT_STATE = {
	allPatientsItems: null,
	patientsItems: null,
	error: '',
	filter: null,
	searchKeyword: '',
	orderColumn: null,
	loading: false,
	labels: [
		{ label: "NA", color: "na" },
		{ label: "VERY LOW", color: "verylow" },
		{ label: "LOW", color: "low" },
		{ label: "MEDIUM", color: "medium" },
		{ label: "HIGH", color: "high" },
		{ label: "VERY HIGH", color: "veryhigh" }
	],
	orderColumns: [
		{ column: "id", label: "ID" },
		{ column: "name", label: "Full Name" },
		{ column: "createDate", label: "Created Date" },
	],
  	categories: ["Flexbox", "Sass", "React"],
	selectedItems: []
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {

		case PATIENTS_GET_LIST:
			return { ...state, loading: false };

		case PATIENTS_GET_LIST_SUCCESS:
			return { ...state, loading: true, allPatientsItems: action.payload, patientsItems: action.payload };

		case PATIENTS_GET_LIST_ERROR:
			return { ...state, loading: true, error: action.payload };

		case PATIENTS_GET_LIST_WITH_FILTER:
			if (action.payload.column === '' || action.payload.value === '') {
				return { ...state, loading: true, patientsItems: state.allPatientsItems, filter: null };
			} else {
				const filteredItems = state.allPatientsItems.filter((item) =>
					item[action.payload.column] === action.payload.value);
				return {
					...state, loading: true, patientsItems: filteredItems, filter: {
						column: action.payload.column,
						value: action.payload.value
					}
				}
			}

		case PATIENTS_GET_LIST_WITH_ORDER:
			if (action.payload === '') {
				return { ...state, loading: true, patientsItems: state.patientsItems, orderColumn: null };
			} else {
				const sortedItems = state.patientsItems.sort((a, b) => {
					if (
						a[action.payload] <
						b[action.payload]
					)
						return -1;
					else if (
						a[action.payload] >
						b[action.payload]
					)
						return 1;
					return 0;
				});

				return { ...state, loading: true, patientsItems: sortedItems, orderColumn: state.orderColumns.find(x => x.column === action.payload) }
			}

		case PATIENTS_GET_LIST_SEARCH:
			if (action.payload === '') {
				return { ...state, patientsItems: state.allPatientsItems };
			} else {
				const keyword = action.payload.toLowerCase();
				const searchItems = state.allPatientsItems.filter((item) =>
					item.id.toString().toLowerCase().indexOf(keyword) > -1
					|| item.name.toLowerCase().indexOf(keyword) > -1
          || item.createDate.toLowerCase().indexOf(keyword) > -1);
				return { ...state, loading: true, patientsItems: searchItems, searchKeyword: action.payload }
			}

		case PATIENTS_ADD_ITEM:
			return { ...state, loading: false };

		case PATIENTS_ADD_ITEM_SUCCESS:
			return { ...state, loading: true, allPatientsItems: action.payload, patientsItems: action.payload };

		case PATIENTS_ADD_ITEM_ERROR:
			return { ...state, loading: true, error: action.payload };

    case PATIENTS_REMOVE_ITEM:
      return { ...state, loading: false };

    case PATIENTS_REMOVE_ITEM_SUCCESS:
      return { ...state, loading: true, allPatientsItems: action.payload, patientsItems: action.payload };

    case PATIENTS_REMOVE_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

	case PATIENTS_SELECTED_ITEMS_CHANGE:
		return { ...state, loading: true, selectedItems: action.payload};

	case PATIENTS_DISCHARGE_ITEM:
      return { ...state, loading: false };

    case PATIENTS_DISCHARGE_ITEM_SUCCESS:
      return { ...state, loading: true, allPatientsItems: action.payload, patientsItems: action.payload };

    case PATIENTS_DISCHARGE_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

	default: return { ...state };
	}
}
