# Zen Autocomplete


## Properties

| Prop | Type | Description | Optional | Default |
|---|---|---|---|---|
| `icon` |  `string`  | Icon to display in the field | ✓ |  |
| `loading` |  `true`  `false`  | Displays a loading spinner on the right | ✓ |  |
| `minlength` |  `number`  | Minimum number of characters to enter before searching | ✓ |  |
| `name` |  `string`  | Name of the field | ✓ |  |
| `options` |  `Function`  `InputDropdownResults`  |  |  |  |
| `placeholder` |  `string`  | Default text to show when there is no entered text | ✓ |  |
| `query` |  `string`  | Inputted text | ✓ |  |
| `renderComplete` |  `reference`  `Promise`  `[object Object]`  | Returns a promise which resolves after the element next renders. The promise resolves to &#x60;true&#x60; if the element rendered and &#x60;false&#x60; if the element did not render. This is useful when users (e.g. tests) need to react to the rendered state of the element after a change is made. This can also be useful in event handlers if it is desireable to wait to send an event until after rendering. If possible implement the &#x60;_didRender&#x60; method to directly respond to rendering within the rendering lifecycle. |  |  |
| `value` |  `string`  | Value of the selected item | ✓ |  |

