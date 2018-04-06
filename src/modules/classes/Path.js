export default class Path {
    constructor(pieces) {
        this.pieces = pieces || []
        this.get = this
            .get
            .bind(this)
        this.first = this
            .first
            .bind(this)
        this.last = this
            .last
            .bind(this)
        this.append = this
            .append
            .bind(this)
        this.pop = this
            .pop
            .bind(this)
        this.toString = this
            .toString
            .bind(this)
        this.count = this
            .count
            .bind(this)
    }

    count() {
        return this.pieces.length
    }

    get(i) {
        return this.pieces[i]
    }

    first() {
        return this.count() === 0
            ? ''
            : this.get(0)
    }

    last() {
        return this.count() === 0
            ? ''
            : this.get(this.count() - 1)
    }

    append(pieces) {
        var n = this.pieces
        if (typeof pieces === 'string') 
            n.push(pieces)
        else if (typeof pieces === 'object') 
            n = n.concat(pieces)
        return new Path(n)
    }

    pop() {
        var n = this.pieces
        if (n.length >= 1) 
            n.pop()
        return new Path(n)
    }

    toString() {
        return '/' +
                this
            .pieces
            .join('/')
    }
}