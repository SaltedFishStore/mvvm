import Dep from "./dep";

let watcherId = 0

export default class Watcher {

    constructor(exp, context, cb) {
        this.$exp = exp
        this.$context = context
        this.$cb = cb
        this.$id = watcherId++
        this.update()
    }

    compoteExpression(exp, scope) {
        let fn = new Function("scope", "with(scope) { return " + exp + "}")
        return fn(scope)
    }

    get() {
        Dep.target = this
        const newValue = this.compoteExpression(this.$exp, this.$context);
        Dep.target = null
        return newValue
    }

    update() {
        this.$cb && this.$cb.call(this.$context, this.get())
    }
};