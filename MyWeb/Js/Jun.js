var Jun = {
    $: function (selector, option, dom) {
        var mydom = dom || document;
        if (!option) { return mydom.querySelectorAll(selector) }
        if (option.isId) { return document.getElementById(selector) }
        if (option.isFirst) { return mydom.querySelector(selector) }
        return mydom.querySelectorAll(selector);
    },
    extend: function () {
        var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== "object" && !this.isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && this.isPlainObject(src) ? src : {};
                        }
                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    },
    isPlainObject: function (obj) {
        if (this.type(obj) !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
            return false;
        }
        try {
            if (obj.constructor &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    }
}
if (!window.$) { window.$ = Jun.$; }
HTMLElement.prototype.addClass = function (addClassName) {
    var regex = new RegExp("(\\s)?" + addClassName + "(\\s)?");
    var array = this.className.match(regex);
    if (array && array[0]) {
        return this;
    }
    this.className = this.className + " " + addClassName;
    return this;
}
HTMLElement.prototype.removeClass = function (removeClassName) {
    var regex = new RegExp("(\\s)?" + removeClassName + "(\\s)?");
    var array = this.className.match(regex);
    if (array && array[0]) {
        var matchWord = array[0];
        if (matchWord.split(" ").length > 2) {
            matchWord = matchWord.substr(1);
        }
        this.className = this.className.replace(matchWord, "");
        return this;
    }
    return this;
}
HTMLElement.prototype.hasClass = function (className) {
    var regex = new RegExp("(\\s)?" + className + "(\\s)?");
    var array = this.className.match(regex);
    if (array && array[0]) {
        return true;
    }
    return false;
}
HTMLElement.prototype.toggleClass = function (className) {
    var hasClass = this.hasClass(className);
    if (hasClass) {
        this.removeClass(className);
    } else {
        this.addClass(className);
    }
    return this;
}
HTMLElement.prototype.hide = function () {
    var self = this;

}