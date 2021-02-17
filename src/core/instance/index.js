import Observer from "../observer";
import Compiler from "../../compiler";

class Vue {
    constructor(options = {
        el: "",
        data: {},
        methods: {}
    }) {
        this.$el = options.el && document.querySelector(options.el)
        this.$data = options.data
        this.$methods = options.methods

        if (this.$el) {
            // 数据劫持
            new Observer(this.$data)
            // 数据代理
            this.proxyData(this.$data)
            // 函数代理
            this.proxyMethods(this.$methods)
            // 模板编译
            new Compiler(this)
        } else {
            throw Error("el配置不能为空")
        }
    }

    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newValue) {
                    data[key] = newValue
                }
            })
        })
    }

    proxyMethods(methods) {
        Object.keys(methods).forEach(key => {
            this[key] = methods[key]
        })
    }
}

window.Vue = Vue

export default Vue