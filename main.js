import { createElement, Component, render } from "./lib"

import { MyComponent } from "./component/MyComponent"



let jsx = <div>
    <MyComponent id="my">
        <div>hello</div>
    </MyComponent>
</div>

console.log(jsx)

render(jsx, document.body)