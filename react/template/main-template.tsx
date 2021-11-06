import { Grid } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import { env } from "../config/env";

export class MainTemplate extends React.Component {
    render() {
        return <>
            <Helmet title="Dinzltt App">
                <meta name="description" content={env.contentPage} />
            </Helmet>
            <Grid container >
                <Grid item xs={12}>
                    <Header />
                </Grid>
                <Grid item xs={12}>
                    {this.props.children}
                </Grid>
            </Grid>
        </>
    }
}