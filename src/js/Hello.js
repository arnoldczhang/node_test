"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var MyClass = (function (_super) {
    __extends(MyClass, _super);
    function MyClass(props) {
        return _super.call(this, props) || this;
    }
    MyClass.prototype.clickHandler = function () {
        alert(111);
    };
    MyClass.prototype.render = function () {
        return (React.createElement("h1", { onClick: this.clickHandler },
            "hello ",
            this.props.name));
    };
    return MyClass;
}(React.Component));
function default_1(name) {
    return (React.createElement(MyClass, { name: name }));
}
exports.default = default_1;
;
//# sourceMappingURL=Hello.js.map