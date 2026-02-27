## CJS Web Development Library
CJS is a tool that helps faster build your website.<br>
It also provides the organized files structure, so even big projects will be easy to manage.

### Files structure
```
src
│
└───assets
│   └───css
│   └───fonts
│
└───layouts
│   └───root
│   │   └───styles
│   │   │   │   Container.css
│   │   │
│   │   │   Container.mjs
│   │   │   RootLayout.mjs
c.js
index.html
```

#### Legend
- `/c.js` - CJS library file
- `/index.html` - root html file
- `/src/` - main project source directory
- `/src/assets` - assets directory, where images, videos, fonts and other resources can be stored
- `/src/layouts` - contains the layouts of the project
- `/src/layouts/{Layout name}` - includes root layout, components and styles
- `/src/layouts/{Layout name}/_styles` - styles of the components

### Base concept (components)
Components are simple functions that return string.<br>
Let's take a look at example component.

```js
/** @typedef {{  }} Data */

/** @type {CjsComponent<Data>} */
export const Form = new class CjsComponent {
    data = {};

    _() {
        const {  } = this._renderData;
    
        return `
            <form>
                <label>
                    <input type="email" placeholder="ex. example@cloud.com">
                </label>
                <label>
                    <input type="password" placeholder="ex. zaq1@WSX">
                </label>
            </form>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/components/_styles/Form.css';
};
```

If we would like to simplify this, and remove the duplicated `<label>` tags, we could create a `Label` component.

```js
/** @typedef {{ type: "email"|"password", placeholder: string }} Data */

/** @type {CjsComponent<Data>} */
export const Label = new class CjsComponent {
    data = {};

    _() {
        const { type, placeholder } = this._renderData;
    
        return `
            <label>
                <input type="${type}" placeholder="${placeholder}">
            </label>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/components/_styles/Label.css';
};
```

Now in `Form` component we can render the `Label` component.

```js
import { Label } from "./Label.mjs";

/** @typedef {{  }} Data */

/** @type {CjsComponent<Data>} */
export const Form = new class CjsComponent {
    data = {};

    _() {
        const {  } = this._renderData;
    
        return `
            <form>
                ${Label.render({ type: "email", placeholder: "ex. example@cloud.com" })}
                ${Label.render({ type: "password", placeholder: "ex. zaq1@WSX" })}
            </form>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/components/_styles/Form.css';
};
```

In that way we can simplify our code and remove the duplicates.<br>
For creating components there is a special command that makes everything for you.

```shell
$ node c.js component {Component name} --layout={Layout name}
$ node c.js c {Component name} --l={Layout name}
```

Mentioned command will create:
1. The main component file `{Component name}.mjs` (and also include basic component creation structure).
2. Style file under the `_styles/${Component name}.css`.

### Layouts
Layouts are containing components in specific scheme, that interferes with rendering.<br>
Let's look at example layout.
```js
import {Header} from "./Header.mjs";
import {Nav} from "./Nav.mjs";
import {Container} from "./Container.mjs";
import {Footer} from "./Container.mjs";

import {WelcomeLayout} from "../welcome/WelcomeLayout.mjs";
import {NewsLayout} from "../news/NewsLayout.mjs";
import {ProjectsLayout} from "../projects/ProjectsLayout.mjs";
import {CompaniesLayout} from "../companies/CompaniesLayout.mjs";

export const RootLayout = new CjsLayout(
    [
        [Header],
        [Nav],
        [Container, [
            [WelcomeLayout],
            [NewsLayout],
            [ProjectsLayout],
            [CompaniesLayout]
        ]],
        [Footer]
    ]
);
```

The provided scheme will render following html scheme.
*In this example assuming that every layout is a div and has class related to layout name.*
```html
<header> ... </header> <!-- Header Component -->
<nav> ... </nav> <!-- Nav Component -->

<div class="container"> <!-- Container Component -->
    <div class="welcome"> ... </div> <!-- Welcome Layout -->
    <div class="news"> ... </div> <!-- News Layout -->
    <div class="projects"> ... </div> <!-- Projects Layout -->
    <div class="companies"> ... </div> <!-- Companies Layout -->
</div>

<footer> ... </footer> <!-- Nav Component -->
```

### Inserting flexible components

Let's replicate the first Form component example.
For large applications you don't have to always define a component with other components inside rendering that way.
If you already have many templates for Forms, Labels, etc. you can define them as components and then use it only in the layout.
Take a look at this example.

First we create a simple empty Form component.

```js
/** @typedef {{  }} Data */

/** @type {CjsComponent<Data>} */
export const Form = new class Form extends CjsComponent {
    data = {};

    _() {
        const {  } = this._renderData;
    
        return `
            <form></form>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/components/_styles/Form.css';
};
```

Next we recreate our Label components.

```js
/** @typedef {{ type: "email"|"password", name: string, placeholder: string }} Data */

/** @type {CjsComponent<Data>} */
export const Label = new class CjsComponent {
    data = {};

    _() {
        const { type, name, placeholder } = this._renderData;
    
        return `
            <label>
                <input type="${type}" name="${name}" placeholder="${placeholder}">
            </label>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/components/_styles/Label.css';
};
```

And for the last component let's create a Button component that will submit the Form.

```js
/** @typedef {{ text: string, click: function }} Data */

/** @type {CjsComponent<Data>} */
export const Button = new class CjsComponent {
    data = {
        text: "Example default text",
        click: () => console.log("Clicked!")
    };

    _() {
        const { text, click } = this._renderData;
    
        return `
            <button ${onClick(click)}>
                ${text}
            </button>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/components/_styles/Button.css';
};
```

And let's combine them inside Layout.

```js
import {Form} from "./Form.mjs";
import {Label} from "./Label.mjs";
import {Button} from "./Button.mjs";

export const RootLayout = new CjsLayout(
    [
        [Form, [
            [Label.withData({
                type: "email", 
                name: "email",
                placeholder: "ex. example@cloud.com"
            })],
            [Label.withData({
                type: "password", 
                name: "password",
                placeholder: "ex. zaq1@WSX"
            })],
            [Button.withData({
                text: "Submit",
                click: async () => {
                    const { name, password } = Form.forms[0].serialize();

                    await App.users.login(name, password);
                }
            })]
        ]],
    ]
);
```

Like this you can create multiple pages just by defining the components flow.