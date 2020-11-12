import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from './module/Home'
import Knn from './module/Knn'
import PatNum from './module/PatNum';

class App extends Component {
  componentDidMount(){
    document.title = "knn Search"
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={PatNum} exact />
          <Route path="/knn" component={PatNum} exact />
          <Route path="/test" component={Knn} exact />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
