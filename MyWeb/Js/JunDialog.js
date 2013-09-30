var JunDialog = (function () {
    var defaultOption = {
        element: null,
    };
    var documentEl = document.documentElement;
    var Dialog = function (option) {
        this.option = this.extend(true, {}, defaultOption, option);
        this.init();
    }

    Dialog.prototype = {
        init: function () {
            this.ClassInit();
            var coverEl = document.createElement("div");
            coverEl.addClass("jundialog_cover");
            documentEl.appendChild(coverEl);
            documentEl.addClass("jundialog_ready");
            
        },
        show: function () {
            var element = this.option.element;
            documentEl.addClass("jundialog_active");
        },
        extend: function () {

            function isPlainObject(obj) {
                var class2type = {},
                    core_toString = class2type.toString,
                    core_hasOwn = class2type.hasOwnProperty;

                function type(obj) {
                    if (obj == null) {
                        return String(obj);
                    }
                    return typeof obj === "object" || typeof obj === "function" ?
                        class2type[core_toString.call(obj)] || "object" :
                        typeof obj;
                }

                function isWindow(obj) {
                    return obj != null && obj === obj.window;
                }

                if (type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
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
                        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && this.isArray(src) ? src : [];

                            } else {
                                clone = src && isPlainObject(src) ? src : {};
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
        ClassInit: function () {
            HTMLElement.prototype.addClass = function (addClassName) {
                var regex = new RegExp("(\\s)?" + addClassName + "(\\s)?");
                var array = this.className.match(regex);
                if (array && array[0]) {
                    return this;
                }
                var str = this.className ? " " : "";
                this.className = this.className + str + addClassName;
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
        }
    }

    return Dialog;
})();