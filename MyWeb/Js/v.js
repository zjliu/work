/////////////////参数初始化////////////////////////////
//缺省样式规则
//格式：错误样式|正确样式
var defaultStyle = "style2|style1";
//缺省错误提示
var objDescTips = {
    required: "请输入必填项",
    maxlength: "输入项最大长度不能超过",
    minlength: "输入项最小长度不能小于",
    alphanumeric: "输入项必须为字母和数字",
    numeric: "输入项必须为数字",
    alpha: "输入项必须为字母",
    alnumhyphen: "输入项必须为字母、数字、横线、下划线",
    email: "输入项必须为电子邮件格式",
    lessthan: "输入项必须为数字",
    lessthan_two: "输入项必须小于",
    greaterthan: "输入项必须为数字",
    greaterthan_two: "输入项必须大于",
    regexp: "输入项必须符合自定义格式",
    doselect: "请选择下拉选项",
    telephone: "固定电话格式错误",
    real: "实数格式错误",
    http: "网址格式错误"
}
//缺省正确提示信息
var defaultTip = {
    username: "请输入用户名",
    Email: "请输入邮箱地址",
    Phone: "请输入电话号码",
    introduce: "请输入个人描述",
    Lovers: "请选择个人爱好",
    address: "请选择地区"
};

///////////////////////功能函数//////////////////////////////////
window.onerror = function () { return true };
String.prototype.trueLen = function () { return this.replace(/[^\x00-\xff]/g, "**").length; }
if (!String.prototype.trim) String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); };

//快捷方式
window.$ = function (selector, dom, option) {
    var mydom = dom || document;
    if (!option) { return mydom.querySelectorAll(selector) }
    if (option.isId) { return document.getElementById(selector) }
    if (option.isFirst) { return mydom.querySelector(selector) }
    return mydom.querySelectorAll(selector);
}

//信息提示
function dispInfo(msgObj, msgInfo, msgClass) {
    var objName = msgObj.name
    var msgItem = $("txt" + objName);

    if (!msgItem) {
        alert("Bug: " + objName + "缺少信息显示区域!");
        return false;
    }

    msgItem.style.display = "block";
    msgItem.className = msgClass;
    msgItem.innerHTML = msgInfo;
}

//////////////////////////////核心类//////////////////////////////
//控件验证
function unitCheck(evt) {
    var evt = evt ? evt : window.event;
    var srcEle = (evt.target) ? evt.target : evt.srcElement;
    var strDescrīptor = srcEle.getAttribute("descrīptor");
    var arrDescrīptor = strDescrīptor.split('|');
    var arrStyle = defaultStyle.split('|');

    if (srcEle.getAttribute("errormsg") == null) {
        var arrErrorMsg = new Array();
    } else {
        var strErrorMsg = srcEle.getAttribute("errormsg");
        var arrErrorMsg = strErrorMsg.split('|');
    }

    if (strDescrīptor.search(/rq|required|ds/gi) == -1) {
        if (srcEle.value.length == 0) {
            dispInfo(srcEle, defaultTip[srcEle.id], arrStyle[1]);
            return true;
        }
    }

    for (var iteDes = 0; iteDes < arrDescrīptor.length; iteDes++) {
        if (!V2validateData(arrDescrīptor[iteDes], srcEle, arrErrorMsg[iteDes])) return false;
    }
    disName = srcEle.name;
    dispInfo(srcEle, defaultTip[disName], arrStyle[1]);
    return true;
}
function Validator(frmname) {
    this.formobj = document.forms[frmname];
    this.strForm = frmname;
    if (!this.formobj) {
        alert("BUG: 不能得到表单对象" + frmname);
        return false;
    }
    if (this.formobj.onsubmit) {
        this.formobj.old_onsubmit = this.formobj.onsubmit;
        this.formobj.onsubmit = null;
    } else {
        this.formobj.old_onsubmit = null;
    }
    this.formobj.onsubmit = form_submit_handler;
    this.addValidation = add_validation;
    this.setAddnlValidationFunction = set_addnl_vfunction;
    this.clearAllValidations = clear_all_validations;
}
function set_addnl_vfunction(functionname) {
    this.formobj.addnlvalidation = functionname;
}
function clear_all_validations() {
    for (var itr = 0; itr < this.formobj.elements.length; itr++) {
        this.formobj.elements[itr].validationset = null;
    }
}
function form_submit_handler() {
    for (var itr = 0; itr < this.elements.length; itr++) {
        if (this.elements[itr].validationset && !this.elements[itr].validationset.validate()) {
            return false;
        }
    }
    if (this.addnlvalidation) {
        str = " var ret = " + this.addnlvalidation + "()";
        eval(str);
        if (!ret) return ret;
    }
    return true;
}
function add_validation(itemname, descrīptor, errstr) {
    if (!this.formobj) {
        alert("BUG: 不能得到表单对象!");
        return;
    }
    var itemobj = this.formobj[itemname];
    if (!itemobj) {
        alert("BUG: 不能得到被验证对象: " + itemname);
        return false;
    }
    if (!itemobj.validationset) {
        itemobj.validationset = new ValidationSet(itemobj);
    }
    itemobj.validationset.add(descrīptor, errstr);
}
function ValidationSet(inputitem) {
    this.vSet = new Array();
    this.add = add_validationdesc;
    this.validate = vset_validate;
    this.itemobj = inputitem;
}
function add_validationdesc(desc, error) {
    this.vSet[this.vSet.length] = new ValidationDesc(this.itemobj, desc, error);
}
function vset_validate() {
    for (var itr = 0; itr < this.vSet.length; itr++) {
        if (!this.vSet[itr].validate()) {
            return false;
        }
    }
    return true;
}
function ValidationDesc(inputitem, desc, error) {
    this.desc = desc;
    this.error = error;
    this.itemobj = inputitem;
    this.validate = vdesc_validate;
}
function vdesc_validate() {
    var arrStyle = defaultStyle.split('|');

    if (!this.itemobj.getAttribute("descrīptor")) {
        alert('Bug：缺少' + this.itemobj.id + '验证标识符descrīptor');
        return false;
    }
    if (this.itemobj.getAttribute("descrīptor").search(/rq|required|ds/gi) == -1) {
        if (this.itemobj.value.length == 0) {
            dispInfo(this.itemobj, defaultTip[this.itemobj.id], arrStyle[1]);
            return true;
        }
    }

    if (!V2validateData(this.desc, this.itemobj, this.error)) {
        this.itemobj.focus();
        return false;
    }
    return true;
}
function V2validateData(strValidateStr, objValue, strError) {
    var epos = strValidateStr.search("=");
    var command = "";
    var cmdvalue = "";
    var arrStyle = defaultStyle.split('|');

    if (epos >= 0) {
        command = strValidateStr.substring(0, epos);
        cmdvalue = strValidateStr.substr(epos + 1);
    } else {
        command = strValidateStr;
    }
    var _value = objValue.value.trim();
    switch (command) {
        case "required":
        case "rq":
            {
                if (eval(_value.trueLen()) == 0) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.required;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "maxlength":
        case "mx":
            {
                if (eval(_value.trueLen()) > eval(cmdvalue)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.maxlength + cmdvalue;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "minlength":
        case "mi":
            {
                if (eval(_value.trueLen()) < eval(cmdvalue)) {
                    if (!strError || strError.length == 0) {
                        strError = objDesTip.minlength + cmdvalue;
                        return false;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "alphanumeric":
        case "an":
            {
                var charpos = _value.search("[^A-Za-z0-9]");
                if (_value.trueLen() > 0 && charpos >= 0) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.alphanumeric;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "numeric":
        case "nc":
            {
                var charpos = _value.search("[^0-9]");
                if (_value.trueLen() > 0 && charpos >= 0) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.numeric;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "alpha":
        case "aa":
            {
                var charpos = _value.search("[^A-Za-z]");
                if (_value.trueLen() > 0 && charpos >= 0) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.alpha;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "alnumhyphen":
        case "ay":
            {
                var charpos = _value.search("[^A-Za-z0-9\-_]");
                if (_value.trueLen() > 0 && charpos >= 0) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.alnumhyphen;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "email":
        case "el":
            {
                var pattern = /^[\w-\.]+\@[\w\.-]+\.[a-z]{2,4}$/;
                if (!pattern.test(_value)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.email;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "lessthan":
        case "lt":
            {
                if (isNaN(_value)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.lessthan;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                if (eval(_value) >= eval(cmdvalue)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.lessthan_two + cmdvalue;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "greaterthan":
        case "gt":
            {
                if (isNaN(_value)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.greaterthan;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                if (eval(_value) <= eval(cmdvalue)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.greaterthan_two + cmdvalue;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "regexp":
        case "rg":
            {
                if (_value.trueLen() > 0) {
                    if (!_value.match(cmdvalue)) {
                        if (!strError || strError.length == 0) {
                            strError = objDescTips.regexp;
                        }
                        dispInfo(objValue, strError, arrStyle[0]);
                        return false;
                    }
                }
                break;
            }
        case "doselect":
        case "ds":
            {
                if (objValue.selectedIndex == null) {
                    alert("BUG: 不能找到select对象");
                    return false;
                }
                if (objValue.selectedIndex == eval(cmdvalue)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.doselect;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "telephone":
        case "te":
            {
                var pattern = /^0?\d{2}\-?\d{3}\-?\d{8}$/;
                if (!pattern.test(_value)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.telephone;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "real":
        case "rl":
            {
                var pattern = /^[\+\-]?\d*\.?\d*$/;
                if (!pattern.test(_value)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.real;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
        case "http":
        case "hp":
            {
                var pattern = /^http:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
                if (!pattern.test(_value)) {
                    if (!strError || strError.length == 0) {
                        strError = objDescTips.http;
                    }
                    dispInfo(objValue, strError, arrStyle[0]);
                    return false;
                }
                break;
            }
    }
    return true;
}