import {
  WARDS_GET_LIST,
  WARDS_GET_LIST_SUCCESS,
  WARDS_GET_LIST_ERROR,
} from 'Constants/actionTypes'

const INIT_STATE = {
	allWardsItems: null,
	error: '',
	loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {

		case WARDS_GET_LIST:
			return { ...state, loading: false };

		case WARDS_GET_LIST_SUCCESS:
			return { ...state, loading: true, allWardsItems: action.payload };

		case WARDS_GET_LIST_ERROR:
			return { ...state, loading: true, error: action.payload };

		default: return { ...state };
	}
}
