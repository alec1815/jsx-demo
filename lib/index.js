const RENDER_TO_DOM = Symbol("render to dom")

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(component) {
        let range = document.createRange()
        range.setStart(this.root, this.root.childNodes.length)
        range.setEnd(this.root, this.root.childNodes.length)
        component[RENDER_TO_DOM](range)
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }

}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
    }
    setAttribute(name, value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        this.render()[RENDER_TO_DOM](range)
    }
}

export function createElement(type, attributes, ...children) {
    // DOM元素
    let element
    if (typeof type === "string") {
        element = new ElementWrapper(type)
    } else {
        element = new type
    }
    // DOM属性
    for (let name in attributes) {
        element.setAttribute(name, attributes[name])
    }
    // 子DOM节点
    let insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === "string") {
                child = new TextWrapper(child)
            }
            if (typeof child === "object" && child instanceof Array) {
                insertChildren(child)
            } else {
                element.appendChild(child)
            }
        }
    }
    insertChildren(children)
    return element
}

export function render(component, parentElemnt) {
    // parentElemnt.appendChild(component.root)
    let range = document.createRange()
    range.setStart(parentElemnt, 0)
    range.setEnd(parentElemnt, parentElemnt.childNodes.length)
    range.deleteContents()
    component[RENDER_TO_DOM](range)
}