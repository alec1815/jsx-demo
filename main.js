import { createElement, Component, render } from "./lib"

import { MyComponent } from "./component/MyComponent"



let jsx = <MyComponent id="my">
    <div>hello</div>
</MyComponent>

console.log(jsx)

render(jsx, document.body)