//@ts-nocheck
import { Validator } from "../ValidatorComponent"
import { ValidatorInput } from "../ValidatorInputComponent"

export class ValidatorRule {
    currentInput: ValidatorInput<any, any>
    constructor(input) {
        this.currentInput = input
    }
    email() {
        const input = this.currentInput
        if (!regex(input.getValue(), /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            input.error = 'Email không hợp lệ'
            return false
        }
        return true
    }
    nonRequire() {
        const input = this.currentInput
        if (input.getValue().length === 0) {
            return true
        }
        input.error = ''
        return false
    }
    require() {
        const input = this.currentInput
        if (input.getValue().length === 0) {
            input.error = 'Trường này là bắt buộc'
            return false
        }
        return true
    }
    min(length: number) {
        const input = this.currentInput
        if (input.getValue().length <= length) {
            input.error = `Tối thiểu ${length} kí tự`
            return false
        }
        return true
    }
    max(length: number) {
        const input = this.currentInput
        if (input.getValue().length >= length) {
            input.error = `Tối đa ${length} kí tự`
            return false
        }
        return true
    }
    confirm(fieldName, descriptionFieldConfirm) {
        const input = this.currentInput

        // list field will check confirm (cache)
        let list = input.confirmInputList

        if (!list) {
            list = {}
            input.confirmInputList = list

            // auto exclude this field when submit
            if (this.currentInput.props.excludeSubmit === undefined) {
                this.currentInput.excludeSubmit = true
            }
        }

        let inputFollow: ValidatorInput<any, any> = list[fieldName]

        if (!inputFollow) {
            // push field follow (cache)
            const parent: Validator = this.currentInput.props.parent
            inputFollow = parent.getInput(fieldName)
            if (!inputFollow) return false
            list[fieldName] = inputFollow
            if (Array.isArray(inputFollow.eventChange)) {
                inputFollow.eventChange.push(input.validator.bind(input))
            }
        }


        if (inputFollow.getValue() !== input.getValue()) {
            input.error = `Trường không trùng khớp với ${descriptionFieldConfirm || fieldName}`
            return false
        }

        return true
    }
}

function regex(v, regex) {
    return v.match(regex) && true
}
