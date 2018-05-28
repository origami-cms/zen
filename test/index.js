import '@webcomponents/webcomponentsjs/webcomponents-bundle';

import {Element, Form} from '../';
import 'wc-router';

const HTMLTestOne = `
I AM ONE
<nav>
    <wc-link to="/one/cool">One</wc-link>
    <wc-link to="/one/hot">Two</wc-link>
</nav>

<wc-switch>
    <wc-route path='/one/cool'><zen-ui-icon type="user" color="main"></zen-ui-user></wc-route>
    <wc-route path='/one/hot'>Hot</wc-route>
</wc-switch>
`;

class TestOne extends Element {
    constructor() {
        super(HTMLTestOne, ':host {color: red;}');
    }

    connectedCallback() {
        super.connectedCallback();
        (document.querySelector('zen-ui-form')).fields = [{
            name: 'test',
            type: 'checkbox'
        }];
    }
}

class TestTwo extends Element {
    constructor() {
        super(`I am two`, false, false);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this._update.bind(this));
    }

    _update() {
        this.html = 'UPDATED!';
    }
}

window.customElements.define('test-one', TestOne);
window.customElements.define('test-two', TestTwo);
