import React from 'react'
import { Switch, Link, Route } from 'react-router-dom'

// TODO
class RandomNestedPage extends React.Component {
  static getInitialProps () {
    console.log('page...')
    return {}
  }

  render () {
    return (
      <div> About nicee </div>
    )    
  }
}

class RandomPage extends React.Component {
  static getInitialProps () {
    console.log('!!!!layout....')
    return {}
  }

  render () {
    return (
      <div>
        <Switch>
          <Route exact path="/random/moo" component={RandomNestedPage} />
        </Switch>
      </div>
    )    
  }
}

export default class Page extends React.Component {
  render () {
    return (
      <div>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" component={RandomPage} />
          <Route path="/random" component={RandomPage} />
        </Switch>
      </div>
    )
  }
}