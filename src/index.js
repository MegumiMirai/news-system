import React from "react";
import ReactDOM from 'react-dom/client'
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import './util/http'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
      <HashRouter>
        <App/>
      </HashRouter>
    </Provider>

)