import React from "react";
import { AuthProvider } from "./AuthProvider";

export class AllContextProvider extends React.Component {
    render() {
        return <>
            <AuthProvider>
                {this.props.children}
            </AuthProvider>
        </>
    }
}