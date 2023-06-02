import React from "react";

import './App.scss';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./containers/auth/login_page";
import Page404 from "./containers/404";


const App = () => {
	return (
		<div className="App">	
			<Router>
				<Routes>
					<Route exact path="/" component={<Navigate to="/login" replace={true}/>} />
					<Route path="/login" component={<LoginPage />} />
					<Route path="*" component={<Page404 />} />
				</Routes>
			</Router>		
		</div>
	);
}

export default App;
