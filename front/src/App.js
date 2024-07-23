import {Route, Switch, BrowserRouter} from 'react-router-dom'

import Login from "./components/login"
import SuccessLogin from"./components/SuccessLogin"
import "./App.css"

const App = ()=> {
return(
      <BrowserRouter>
      <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/Home" component={SuccessLogin} />
      </Switch>
      </BrowserRouter>
)
}

export default App;