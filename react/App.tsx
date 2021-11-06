
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { utils } from "./common/utils";
import { route } from "./config/route";
import { SnackbarContainer } from "./container/SnackbarContainer";
import { AllContextProvider } from "./context/AllContextProvider";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/RegisterPage";
import VerificationEmail from "./pages/auth/VerificationEmail";
import CreatePost from "./pages/post/CreatePost";
import './scss/App.scss';
import { MainTemplate } from "./template/main-template";




export default class App extends React.Component {
    render() {
        return <BrowserRouter>
            <SnackbarContainer />
            <AllContextProvider>
                <MainTemplate>
                    <Switch>
                        <Route path={route.login} component={LoginPage} />
                        <Route path={route.register} component={RegisterPage} />
                        <Route path={route.verification} component={VerificationEmail} />
                        <Route path={route.createPost} component={CreatePost} />
                    </Switch>
                </MainTemplate>
            </AllContextProvider>
        </BrowserRouter>
    }
}