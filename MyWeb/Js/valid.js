/// <reference path="Jun.js" />

var JunValidator = (function () {
    var defaultOption = {

    }
    var Validator = function (option) {
        this.option = defaultOption;
        Jun.extend(this.option, option);
    }
    Validator.prototype = {


    }
    return Validator;
})();