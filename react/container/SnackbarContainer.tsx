//@ts-nocheck
import { Alert, AlertColor, Button, IconButton, Snackbar, SvgIcon } from "@mui/material";
import { width } from "@mui/system";
import React, { Component } from 'react';
import SVG from "./SVG";
import { $MSnackbar } from "../declare";

class _Snackbar {
    private snack: SnackbarContainer
    message(message, color?: AlertColor = 'info') {
        console.log(this.snack)
        this.snack.setState({
            open: true,
            message: message,
            color: color,
        })
    }
}

export const snackbar = new _Snackbar()

export class SnackbarContainer extends Component<any, $MSnackbar> {
    constructor(props) {
        super(props)
        snackbar.snack = this
        this.state = {
            open: false,
            autoHideDuration: 2000
        }
    }
    handleCloseAction() {
        this.setState({ open: false, message: '' })
    }
    render() {
        const open = this.state.open
        return open ?
            <Snackbar
                {...{
                    ...this.state,
                    children: <Alert
                        severity={this.state.color}
                        children={this.state.message}
                        variant="filled"
                        onClose={this.handleCloseAction.bind(this)}
                        sx={{
                            width: 200,
                            maxWidth: '100%'
                        }} />
                }}
            />
            : <></>
    }
}