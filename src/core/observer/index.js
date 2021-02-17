import Dep from "./dep";

export default class Observer {
    constructor(data) {
        this.$data = data

        // 遍历数据
        this.walk(this.$data)
    }

    walk(data) {
        if (!data || typeof data !== "object") return

        Object.keys(data).forEach(key => {
            // 对数据进行劫持
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(obj, key, value) {
        let dep = new Dep()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set: (newValue) => {
                if (value === newValue) return
                value = newValue
                dep.notify()
            }
        })
    }
}