import { connect } from 'react-redux';
import App from '../components/App';

import { usersearch } from '../modules/actions';

export default connect(
  ({ app }) => ({ ...app }),
  (dispatch) => ({
    usersearch: (keyword) => dispatch(usersearch(keyword)),
  }),
)(App);
