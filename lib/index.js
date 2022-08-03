const RENDER_TO_DOM = Symbol("render to dom")

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
        this._range = null
    }
    get vdom() {
        return this.render().vdom
    }
    get vchildren() {
        return this.children.map(child => child.vdom)
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
    // rerender() {
    //     let oldRange = this._range
    //     // 创建一个新的range把老的range起始位置
    //     let range = document.createRange()
    //     range.setStart(oldRange.startContainer, oldRange.startOffset)
    //     range.setEnd(oldRange.startContainer, oldRange.startOffset)
    //     this[RENDER_TO_DOM](range)
    //     // 将老的range插入到新的range之后
    //     oldRange.setStart(range.endContainer, range.endOffset)
    //     oldRange.deleteContents()
    // }
    setState(newState) {
        if (this.state === null || typeof this.state !== "object") {
            this.state = newState
            this.rerender()
            return
        }

        this.state = Object.assign({}, this.state, newState)

        // let merge = (oldState, newState) => {

        //     for (let p in newState) {
        //         if (oldState[p] === null || typeof oldState[p] !== "object") {
        //             oldState[p] = newState[p]
        //             console.log(oldState, oldState[p])
        //         } else {
        //             merge(oldState[p], newState[p])
        //         }
        //     }
        // }
        // merge(this.state, newState)
        this.rerender()
    }
}
class ElementWrapper extends Component {
    constructor(type) {
        super(type)
        this.type = type
    }
    get vdom() {
        return this
        // {
        //     type: this.type,
        //     props: this.props,
        //     children: this.children.map(children => children.vdom)
        // }
    }
    // setAttribute(name, value) {
    //     // [\s\S]+ 所有字符
    //     let matched
    //     if (matched = name.match(/^on([\s\S]+)/)) {
    //         let eventType = matched[1].replace(/[A-Z]/g, c => c.toLowerCase())
    //         this.root.addEventListener(eventType, value)
    //     } else {
    //         if (name === "className") {
    //             this.root.setAttribute("class", value)
    //         } else {
    //             this.root.setAttribute(name, value)
    //         }

    //     }
    // }
    // appendChild(component) {
    //     let range = document.createRange()
    //     range.setStart(this.root, this.root.childNodes.length)
    //     range.setEnd(this.root, this.root.childNodes.length)
    //     component[RENDER_TO_DOM](range)
    // }
    [RENDER_TO_DOM](range) {
        range.deleteContents()

        let root = document.createElement(this.type)

        for (const name in this.props) {
            let value = this.props[name]
            let matched
            if (matched = name.match(/^on([\s\S]+)/)) {
                let eventType = matched[1].replace(/[A-Z]/g, c => c.toLowerCase())
                root.addEventListener(eventType, value)
            } else {
                if (name === "className") {
                    root.setAttribute("class", value)
                } else {
                    root.setAttribute(name, value)
                }
            }
        }

        for (const child of this.children) {
            let childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)
            child[RENDER_TO_DOM](childRange)
        }

        range.insertNode(root)
    }

}

class TextWrapper extends Component {
    constructor(content) {
        super(content)
        this.content = content
        this.root = document.createTextNode(content)
    }
    get vdom() {
        return this
        // {
        //     type: '#text',
        //     content: this.content
        // }
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
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