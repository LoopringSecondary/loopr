import React from 'react';
import {Alert, Tabs} from 'antd'
import {FormattedMessage} from 'react-intl';
import {Redirect, Route, Switch} from 'dva/router'
import intl from 'react-intl-universal';
import {connect} from 'dva';
import ReactMarkdown from 'react-markdown'
import fetch from 'dva/fetch';

class Home extends React.Component{
  state={
    contentMd: ''
  };

  componentDidMount(){
    const {match, location} = this.props;
    const keyword = location.pathname.replace(`${match.path}/`, '')
    const url = `//raw.githubusercontent.com/Loopring/loopr-docs/master/en/${keyword}.md`
    let content = ''
    fetch(url)
      .then(res => {
        return res.text()
      }).then(res => {
      this.setState({contentMd: res})
      console.log('content:',res)
    })
  }

  render(){
    return (
      <div>
        {this.state.contentMd && <ReactMarkdown source={this.state.contentMd} />}
      </div>
    )
  }
}

export default connect()(Home)
