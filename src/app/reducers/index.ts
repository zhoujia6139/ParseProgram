import { combineReducers, ReducersMapObject } from 'redux';
import { RootState } from './state';
import testReducer from './testReducer';
import { reducer as formReducer } from 'redux-form';
export { RootState };

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
  test: testReducer,
  form: formReducer
} as ReducersMapObject);
