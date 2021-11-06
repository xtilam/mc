//@ts-nocheck
import React, { Component, createElement, createRef } from "react";
import { ValidatorRule } from "./rules/ValidatorRule";
import { ValidatorInput } from "./ValidatorInputComponent";


export class Validator extends Component<ValidatorProps, ValidatorState> {
    form = createRef<HTMLFormElement>();
    inputs = {};
    waitSubmit = false;
    async handleSubmit(e) {
        e.preventDefault();

        if (this.waitSubmit) {
            throw 'waiting form submit';
        }

        if (this.props.syncSubmit ?? true) {
            this.waitSubmit = true;
        }

        const oldStatus = this.disableAllInput(true)

        const { onSuccess } = this.props;
        if (this.isValidForm() && onSuccess) {
            try {

                await onSuccess({
                    json: this.resultJson.bind(this),
                    formData: this.resultFormData.bind(this),
                    axios: this.axios.bind(this)
                });
            } catch (error) {
                console.error(error)
            }
        }

        this.disableAllInput(false, oldStatus)
        this.waitSubmit = false;
    }
    async axios(
        promiseAxios: Promise<any>,
        config: {
            error?: (res) => any,
            success?: (res) => any
        }
    ): any {

        const { error, success } = config

        try {
            const res = await promiseAxios;
            success && success(res)
        } catch (err) {
            // validator server error
            if (err.status === 422 && err.message === 'The given data was invalid.') {
                const { errors } = err;
                for (const field in errors) {
                    const input = this.getInput(field);
                    if (!input)
                        continue;
                    const style = { display: 'block' };
                    const errChildren = <>{errors[field].map((err, index) => <span key={index} style={style} children={err.charAt(0).toUpperCase() + err.slice(1)} />)}</>;
                    input.setError(errChildren);
                }
                return
            }

            if (error.status) {
                err = {
                    code: 99999999,
                    message: err.message
                }
            }

            // controller error
            error && error(err)

        }
    }
    disableAllInput(status: boolean, oldStatusList: boolean = {}) {

        for (const key in this.inputs) {
            const input = this.getInput(key)
            if (!input) continue

            if (status === undefined || status === true) {
                oldStatusList[key] = input.state.disable
                input.disable(true)
            } else {
                const oldStatus = oldStatusList[key]
                input.disable(oldStatus === undefined ? false : oldStatus)
            }
        }

        return oldStatusList
    }
    resultFormData(): FormData {
        const form = new FormData()
        for (const key in this.inputs) {
            const input = this.getInput(key)
            if (!input || input.excludeSubmit)
                continue;
            form.append(key, input.getValue())
        }
        return form
    }
    resultJson(): any {
        const json = {}
        for (const key in this.inputs) {
            const input = this.getInput(key)
            if (input.excludeSubmit)
                continue;
            json[key] = input.getValue()
        }
        return json
    }
    isValidForm() {
        for (const key in this.inputs) {
            const input = this.getInput(key);
            input.validator();
            if (input.error) {
                input.focus();
                return false;
            }
        }
        return true;
    }
    getInput(name): ValidatorInput {
        return this.inputs[name].current;
    }
    register(element: React.ReactElement, validator?: (r: ValidatorRule) => boolean = () => true) {
        const name = element.props.name
        if (!name)
            throw 'register require name props'
        const ref = React.createRef()
        this.inputs[name] = ref
        return createElement(element.type, { ...element.props, parent: this, ...{ validator: validator, ref: ref } });
    }
    render() {
        return <form ref={this.form} onSubmit={this.handleSubmit.bind(this)}>
            {this.props.render({ register: this.register.bind(this) })}
        </form>;
    }
}


export declare namespace ValidatorEvent {
    type onSuccess = (e: {
        formData: typeof Validator.prototype.resultFormData
        json: typeof Validator.prototype.resultJson
        axios: typeof Validator.prototype.axios
    }) => void

}

interface ValidatorProps {
    render: (methods: {
        register: typeof Validator.prototype.register,
    }) => JSX.Element,
    onSuccess: ValidatorEvent.onSuccess,
    syncSubmit?: boolean
}

interface ValidatorState {
    error: string,
}