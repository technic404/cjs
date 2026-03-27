## CJS Web Development Library
CJS is a tool that helps faster build your website.<br>
It also provides the organized files structure, so even big projects will be easy to manage.

### Files structure
```
lib
|
└───...
src
│
└───assets
│   └───css
│   └───fonts
│
└───layouts
│   └───root
│   │   └───_styles
│   │   │   │   Container.css
│   │   │
│   │   │   Container.ts
│   │   │   RootLayout.ts
index.html
```

#### Legend
- `/lib` - CJS library file
- `/index.html` - root html file
- `/src/` - main project source directory
- `/src/assets` - assets directory, where images, videos, fonts and other resources can be stored
- `/src/layouts` - contains the layouts of the project
- `/src/layouts/{Layout name}` - includes root layout, components and styles
- `/src/layouts/{Layout name}/_styles` - styles of the components

### Base concept (components)
Components are simple classes prototypes that return string templates (or more - described later).<br>
Let's take a look at example component.

```ts
export class Form extends CjsComponent {
    _template() {
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

    _cssStyle = './src/components/_styles/Form.css';
};
```

If we would like to simplify this, and remove the duplicated `<label>` tags, we could create a `Label` component.

```ts
type Data = {
    type: "email" | "password"
    placeholder: string
}

export class Label extends CjsComponent<Data> {
    _template() {
        const { type, placeholder } = this.data;
    
        return `
            <label>
                <input type="${type}" placeholder="${placeholder}">
            </label>
        `;
    }

    _cssStyle = './src/components/_styles/Label.css';
};
```

Now in `Form` component we can render the `Label` component.

```ts
import { Label } from "./Label";

export class Form extends CjsComponent {
    _template() {
        return `
            <form>
                ${Label.render({ type: "email", placeholder: "ex. example@cloud.com" })}
                ${Label.render({ type: "password", placeholder: "ex. zaq1@WSX" })}
            </form>
        `;
    }

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
1. The main component file `{Component name}.ts` (and also include basic component creation structure).
2. Style file under the `_styles/${Component name}.css`.

### Layouts
Layouts are containing components in specific scheme, that interferes with rendering.<br>
Let's look at example layout.
```ts
import {Header} from "./Header";
import {Nav} from "./Nav";
import {Container} from "./Container";
import {Footer} from "./Footer";

import {WelcomeLayout} from "../welcome/WelcomeLayout";
import {NewsLayout} from "../news/NewsLayout";
import {ProjectsLayout} from "../projects/ProjectsLayout";
import {CompaniesLayout} from "../companies/CompaniesLayout";

export const RootLayout = new CjsLayout(() => [
    [Header],
    [Nav],
    [Container, [
        [WelcomeLayout],
        [NewsLayout],
        [ProjectsLayout],
        [CompaniesLayout]
    ]],
    [Footer]
]);
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

```ts
export class Form extends CjsComponent {
    _template() {
        return `
            <form></form>
        `;
    }

    _cssStyle = './src/components/_styles/Form.css';
};
```

Next we recreate our Label components.

```ts
type Data = {
    type: "email"|"password"
    name: string
    placeholder: string
}

export class Label extends CjsComponent<Data> {

    _template() {
        const { type, name, placeholder } = this.data;
    
        return `
            <label>
                <input type="${type}" name="${name}" placeholder="${placeholder}">
            </label>
        `;
    }

    _cssStyle = './src/components/_styles/Label.css';
};
```

And for the last component let's create a Button component that will submit the Form.

```ts
type Data = {
    text: string
    click: () => any
}

export class Button extends CjsComponent<Data> {
    _defaultData = {
        text: "Example default text",
        click: () => console.log("Clicked!")
    };

    _template() {
        const { text, click } = this.data;
    
        return `
            <button ${onClick(click)}>
                ${text}
            </button>
        `;
    }

    _cssStyle = './src/components/_styles/Button.css';
};
```

And let's combine them inside Layout.

```ts
import {Form} from "./Form";
import {Label} from "./Label";
import {Button} from "./Button";

export const RootLayout = new CjsLayout(() => [
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
]);
```

Like this you can create multiple pages just by defining the components flow.