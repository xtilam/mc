//@ts-ignore
//@ts-nocheck

import { Component } from "react";
import { ValidatorRule } from "./rules/ValidatorRule";

export abstract class ValidatorInput<P = any, S = any> extends Component<{
    excludeSubmit?: boolean,
    validator?: (rule: ValidatorRule) => any,
    disabled?: boolean
} & P, { disable: boolean } & S> {
    excludeSubmit: boolean = false
    error = ''
    validatorRule: ValidatorRule
    constructor(props) {
        super(props)
        this.validatorRule = new ValidatorRule(this)
        const { disabled } = this.props
        this.state = {
            disable: disabled === undefined ? false : disabled
        }
    }
    abstract getValue()
    abstract focus()
    disable(status: boolean) {
        this.setState({ disable: status === undefined ? true : status })
    }
    validator() {
        const { validator } = this.props
        if (validator && validator.apply(this, [this.validatorRule])) {
            return this.setError('')
        }
        return this.setError(this.error)
    }
    setError(error) {
        this.error = error
        this.setState({})
    }
    getProps() {
        const props = { ...this.props }
        delete props.validator
        delete props.excludeSubmit
        delete props.parent
        return props
    }
}


