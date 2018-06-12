import {html} from '@polymer/lit-element';
export default html`<style>:host,:host *{box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;margin:0;padding:0;border:0;outline:0;font-size:100%;font:inherit;vertical-align:baseline}:host{position:absolute;top:calc(100% - 5px);left:0;width:100%;border:var(--input-border, var(--border-200, 2px solid var(--color-grey-200, #eae3f0)));border-radius:var(--border-radius, .4rem);border-top-left-radius:0;border-top-right-radius:0;z-index:100;background-color:var(--color-white, #fff)}:empty:host{display:none}:host>*{list-style:none;height:var(--size-main, 4rem);line-height:var(--size-main, 4rem);border-bottom:var(--border-100, 1px solid var(--color-grey-100, #f5f5f5));padding:0 var(--size-small, 2rem);overflow:hidden;text-overflow:ellipsis;user-select:none}:host>*:hover,:host>*.active{background-color:var(--color-hover, var(--color-grey-50, #f8f8ff))}:host>*:last-child{border-bottom:0}:host>* *{vertical-align:middle}:host{display:none;max-height:var(--size-hero, 24rem);overflow-y:auto;z-index:1000}:host([open]){display:block}
</style>`;
