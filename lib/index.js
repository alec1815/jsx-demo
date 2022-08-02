const RENDER_TO_DOM = Symbol("render to dom")

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        // [\s\S]+ 所有字符
        let matched
        if (matched = name.match(/^on([\s\S]+)/)) {
            let eventType = matched[1].replace(/[A-Z]/g, c => c.toLowerCase())
            this.root.addEventListener(eventType, value)
        } else {
            if (name === "className") {
                this.root.setAttribute("class", value)
            } else {
                this.root.setAttribute(name, value)
            }

        }
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
        this._range = null
    }
    setAttribute(name, value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        this._range = range
        this.render()[RENDER_TO_DOM](range)
    }
    rerender() {
        this._range.deleteContents()
        this[RENDER_TO_DOM](this._range)
    }
    setState(newState) {

        if (this.state === null || typeof this.state !== "object") {
            this.state = newState
            this.rerender()
            return
        }

        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== "object") {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        merge(this.state, newState)
        this.rerender()
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
            if (child === null) {
                continue
            }
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