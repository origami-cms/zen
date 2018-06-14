"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lit_element_1 = require("@polymer/lit-element");
exports.default = lit_element_1.html `<style>:host ul.options{box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;margin:0;padding:0;border:0;outline:0;font-size:100%;font:inherit;vertical-align:baseline}:host ul.options li.option:before{position:absolute;width:100%;height:100%;top:0;left:0}:host{user-select:none}:host ul.options{list-style:none;display:grid;grid-template-columns:repeat(var(--radio-icons-columns, 3), 1fr);grid-gap:2rem}:host ul.options li.option{position:relative;text-align:center;cursor:pointer;border:var(--border-200, 2px solid var(--color-grey-200, #eae3f0));border-radius:var(--border-radius, .4rem);padding:var(--size-tiny, 1rem) 0;transition:all var(--transition-time, .35s);background-color:var(--radio-icons-bg);box-shadow:var(--radio-icons-shadow)}:host ul.options li.option:before{content:'';background-color:var(--color-main, var(--color-purple, #693a91));opacity:0;transition:all var(--transition-time, .35s)}:host ul.options li.option.active{border:var(--border-main, 2px solid var(--color-main, var(--color-purple, #693a91)))}:host ul.options li.option.active:before{opacity:0.2}:host ul.options li.option .img{position:relative}:host ul.options li.option .img,:host ul.options li.option .img img,:host ul.options li.option .img *{max-height:calc(default('size-super') * 1.5)}:host ul.options li.option>span{display:inline-block;margin-top:var(--size-small, 2rem);white-space:normal}
</style>`;
