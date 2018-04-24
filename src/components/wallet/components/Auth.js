import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'dva/router';

function AuthWallet({dispatch}) {

  return <Redirect to="/" />
}

export default connect()(AuthWallet)
