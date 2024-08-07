## CJS Web Development Library
CJS is a tool that helps faster build your website.<br>
It also provides the organized files structure, so even big projects will be easy to manage.

### Files structure
```
src
│
└───assets
│   └───css
│   └───images
│
└───layouts
│   └───main
│   │   └───styles
│   │   │   │   Container.css
│   │   │
│   │   │   Container.mjs
│   │   │   MainLayout.mjs
c.js
index.html
```

#### Legend
- `/c.js` - CJS library file
- `/index.html` - root html file
- `/src/` - main project source directory
- `/src/assets` - assets directory, when images, videos, fonts and other resources can be stored
- `/src/layouts` - contains the layouts of the project
- `/src/layouts/{Layout name}` - includes root layout, components and styles
- `/src/layouts/{Layout name}/styles` - styles of the components

### Components
Components are simple functions that return string.<br>
Let's take a look at example component.

```js
export const Form = new CjsComponent((data) => {
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
});

Form.importStyle('./shoppinglist/layouts/main/styles/Form.css');
```

If we would like to simplify this, and remove the duplicated `<label>` tags, we could create a `Label` component.

```js
export const Label = new CjsComponent((data) => {
    return `
        <label>
            <input type="${data.type}" placeholder="${data.placeholder}">
        </label>
    `;
});

Label.importStyle('./shoppinglist/layouts/main/styles/Label.css');
```

Now in `Form` component we can render the `Label` component.

```js
import { Label } from "./Label.mjs";

export const Form = new CjsComponent((data) => {
    return `
        <form>
            ${Label.render({ type: "email", placeholder: "ex. example@cloud.com" })}
            ${Label.render({ type: "password", placeholder: "ex. zaq1@WSX" })}
        </form>
    `;
});

Form.importStyle('./shoppinglist/layouts/main/styles/Form.css');
```

In that way we can simplify our code and remove the duplicates.<br>
For creating components there is a special command that makes everything for you.

```shell
$ node c.js component {Component name} --layout={Layout name}
```

Mentioned command will create:
1. The main component file `{Component name}.mjs` (and also include basic component creation structure).
2. Style file under the `styles/${Component name}.css`.