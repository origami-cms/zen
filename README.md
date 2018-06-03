# Zen Components
A super flexible, reusable, and themeble suite of custom elements to use for building progressive web apps. No dependencies required.

## Motivation
To provide a (up to date) collection of commerical ready components to build web apps with. There are many other libraries such as [PolymerElements](https://github.com/PolymerElements/), however most use Google's Material Design. Zen was intially design for (Origami CMS)[https://github.com/origami-cms/], but is also completely themeable and restylable as it uses (Zen CSS)[https://github.com/origami-cms/zen-css] for all it's styling.

Currently, all elements are written in Polymer, using [@polymer/lit-element](https://github.com/Polymer/lit-element).


## Installation
Simply run `yarn install origami-zen` to install the module.
From here, you can import all the components with:
```js
// This will automatically register all the elements ready for use
import 'origami-zen';
```

## Usage
Zen elements function like normal HTML elements, with attributes, styling, etc. They are all prefixed with `zen-` in their tag name:

```html
<html>
<head>
    <script src="/js/zen.min.js"></script>
</head>
<body>
    <zen-icon-set></zen-icon-set>
    <zen-button icon="add">Create</zen-button>
    <zen-form></zen-form>

    <script>
        const f = document.querySelector('zen-form');
        f.values = {
            "email": "notbruce@batman.com"
        },
        f.fields = [
            {
                name: 'text',
                type: 'email',
                placeholder: 'Email',
                icon: 'mail'
            },
            {
                name: 'terms',
                type: 'checkbox',
                label: 'Do you agree to our terms and conditions?'
            }
        ];
    </script>
</body>
</html>
