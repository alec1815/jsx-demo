import { Component, createElement } from "../lib"

export class MyComponent extends Component {
    render() {
        return <div><h1>My Component</h1>{this.children}</div>
    }
}