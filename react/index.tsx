import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

React.Component.prototype.componentWillUnmount = function () {
    this.setState = () => { }
    this.unmounted = true
}


{
    const appendMethod = FormData.prototype.append
    FormData.prototype.append = function (...args) {
        if (Array.isArray(args[1])) {
            for (const value of args[1]) {
                appendMethod.apply(this, value)
            }
            return
        }
        appendMethod.apply(this, args)
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
