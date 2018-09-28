# Button
The button element is a styled button with options of
adding an icon, loading state, and size.



## Properties

| Prop | Type | Description | Optional | Default |
|---|---|---|---|---|
| `color` |  `string`  |  | ✓ |  |
| `disabled` |  `true`  `false`  |  | ✓ |  |
| `hollow` |  `true`  `false`  |  | ✓ |  |
| `icon` |  `string`  `false`  |  | ✓ |  |
| `iconright` |  `true`  `false`  |  | ✓ |  |
| `loading` |  `true`  `false`  |  | ✓ |  |
| `renderComplete` |  `reference`  `Promise`  `[object Object]`  | Returns a promise which resolves after the element next renders. The promise resolves to &#x60;true&#x60; if the element rendered and &#x60;false&#x60; if the element did not render. This is useful when users (e.g. tests) need to react to the rendered state of the element after a change is made. This can also be useful in event handlers if it is desireable to wait to send an event until after rendering. If possible implement the &#x60;_didRender&#x60; method to directly respond to rendering within the rendering lifecycle. |  |  |
| `size` |  `string`  |  | ✓ |  |

## CSS Properties

| Prop | Description |
|---|---|
| `--btn-padding` | Padding for the button |
| `--btn-height` | Height of the button |
| `--btn-border-radius` | Border radius of the button |
| `--btn-bg` | Background color of the button |
