import Watcher from "../core/observer/watcher";

export default class Compiler {
    constructor(context) {
        this.$context = context
        this.$el = context.$el
        // 将节点转换成文档片段
        this.$fragment = this.nodeToFragment(this.$el);
        // 编译模板
        this.compiler(this.$fragment)
        // 将处理后的文档片段添加到页面
        this.$el.appendChild(this.$fragment)
    }

    nodeToFragment(node) {
        const fragment = document.createDocumentFragment()
        const nodeList = []

        if (node.childNodes && node.childNodes.length) {
            node.childNodes.forEach(child => {
                if (!this.ignore(child)) {
                    nodeList.push(child)
                }
            })
        }
        nodeList.forEach(child => {
            fragment.appendChild(child)
        })

        return fragment
    }

    ignore(node) {
        return (node.nodeType === 8 || (node.nodeType === 3 && node.textContent.trim() === ""))
    }

    compiler(node) {
        if (node.childNodes && node.childNodes.length) {
            node.childNodes.forEach(child => {
                if (child.nodeType === 1) {
                    // 元素节点
                    this.compilerElementNode(child)
                } else if (child.nodeType === 3) {
                    // 文本节点
                    this.compilerTextNode(child)
                }
            })
        }
    }

    compilerElementNode(node) {
        const self = this
        const attrs = [...node.attributes]

        attrs.forEach(attr => {
            const {name: attrName, value: attrValue} = attr
            const dirName = attrName.slice(2)
            switch (dirName) {
                case "text":
                    new Watcher(attrValue, self.$context, (newValue) => {
                        node.textContent = newValue
                    })
                    break
                case "module":
                    new Watcher(attrValue, self.$context, (newValue) => {
                        node.value = newValue
                    })
                    node.addEventListener("input", e => {
                        self.$context[attrValue] = e.target.value
                    })
                    break
            }
            if (attrName.indexOf("@") === 0) {
                const type = attrName.slice(1)
                node.addEventListener(type, self.$context[attrValue].bind(self.$context))
            }
        })

        this.compiler(node);
    }

    compilerTextNode(node) {
        const text = node.textContent.trim()
        if (text) {
            const exp = this.parseTextExp(text)
            new Watcher(exp, this.$context, (newValue) => {
                node.textContent = newValue
            })
        }
    }

    parseTextExp(text) {
        let reg = /\{\{(.+?)\}\}/g
        let pics = text.split(reg)
        let matcher = text.match(reg)
        let tokens = []

        pics.forEach(item => {
            if (matcher && matcher.indexOf("{{" + item + "}}") > -1) {
                tokens.push("(" + item.trim() + ")")
            } else {
                tokens.push("'" + item + "'")
            }
        })

        return tokens.join("+")
    }
}