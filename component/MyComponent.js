import { Component, createElement } from "../lib"

export class MyComponent extends Component {
    constructor() {
        super()
        this.state = {
            a: 1,
            b: 2
        }
    }
    render() {
        return <div>
            <h1>My Component</h1>
            <span>{this.state.a.toString()}</span>
            <button onClick={() => {
                this.state.a++
                this.rerender()
            }}>add</button>
            {this.children}
        </div>
    }
}