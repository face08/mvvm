function MVVM(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data;
    var me = this;

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function (key) {
        me._proxyData(key);
    });

    this._initComputed();
    observe(data, this);    // 观察数据

    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    constructor: MVVM,

    // watch功能
    $watch: function (key, cb, options) {
        new Watcher(this, key, cb);
    },

    // data属性代理：主要实现this.xxx === this.data.xxx
    _proxyData: function (key, setter, getter) {
        var me = this;
        setter = setter ||
            Object.defineProperty(me, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return me._data[key];
                },
                set: function proxySetter(newVal) {
                    me._data[key] = newVal;
                }
            });
    },

    // 初始化 computed 计算函数
    _initComputed: function () {
        var me = this;
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function (key) {
                // 添加到me===this上
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: function () {
                    }
                });
            });
        }
    }
};
