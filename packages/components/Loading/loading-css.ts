import {html} from '@polymer/lit-element';
import { TemplateResult } from 'lit-html';
export default html`<style>:host{width:var(--loading-size, var(--size-main, 4rem));height:var(--loading-size, var(--size-main, 4rem));display:flex;align-items:center;justify-content:center}:host span{display:inline-block;width:50%;height:50%;border:var(--loading-border, 0.2rem solid var(--color-grey-200, #eae3f0));border-top-color:var(--color-main, var(--color-purple, #693a91));border-radius:50%;animation:spin 1s infinite;animation-timing-function:cubic-bezier(0.3, 1.65, 0.7, -0.65)}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
</style>` as TemplateResult;
