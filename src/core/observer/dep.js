export default class Dep {
    constructor() {
        this.subs = []
    }

    addSub(target) {
        this.subs[target.$id] = target
    }

    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}