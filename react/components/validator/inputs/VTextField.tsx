import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { ValidatorInput } from "../ValidatorInputComponent";

export class VTextField extends ValidatorInput<VTextFieldProps, any>{
    ref = React.createRef<any>()
    input: HTMLInputElement
    eventChange = []

    componentDidMount() {
        this.input = this.ref.current.querySelector('input')
    }
    handleInputChange(e) {
        const { onChange } = this.props
        this.validator()
        this.eventChange.forEach(e => e())
        if (onChange) {
            onChange(e)
        }
    }
    focus() {
        this.input.focus()
    }
    getValue() {
        return this.input.value
    }
    render() {
        const { error } = this

        return <TextField {...this.getProps()} ref={this.ref} onChange={this.handleInputChange.bind(this)} error={error ? true : false} helperText={error} disabled={this.state.disable}></TextField >
    }
}

type VTextFieldProps = TextFieldProps & {}
