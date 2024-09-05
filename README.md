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

#### Component properties
`🟪` `constructor(data : object, layoutData : object)` `▶` `CjsComponent`
`🟦` `forms` `▶` `CjsForm[]` - Provides forms existing in component
`🟦` `components` `▶` `CjsComponentsCollection` - Provides all components existing in DOM
`🟨` `toElement(ignoreReadyState : boolean)` `▶` `HTMLElement` - Provides component element as HTMLElement
`🟨` `render(data : object)` `▶` `string` - Renders the html string from provided data
`🟨` `visualise(data : object)` `▶` `HTMLElement` - Visualises component as HTMLElement
`🟨` `setData(data : object)` `▶` `CjsComponent` - Sets data for component and reload the old component occurrence
`🟨` `loadLayout(layout : CjsLayout)` `▶` `void` - Loads layout inside the selected component
`🟨` `rerenderOnSearch(data : object)` `▶` `CjsComponent` - Redenders all components this type when search changed
`🟨` `rerenderComponents(data : object, options : object)` `▶` `CjsComponent` - Redenders all components this type
`🟨` `onLoad(callback : function)` `▶` `void` - Set function that will be executed when element is loaded on website
`🟨` `importStyle(path : string, options : object)` `▶` `void` - Imports style to element from specified file
`🟨` `setDefaultData(data : object)` `▶` `CjsComponent` - Sets default data, so if there is no values in original data, the missing values will be replaced with defaults
`🟨` `querySelector(selectors : string)` `▶` `HTMLElement|Element|null` - Returns the first element that is a descendant of node that matches selectors.
`🟨` `querySelectorAll(selectors : string)` `▶` `HTMLElement[]|Element[]` - Returns all element descendants of node that match selectors.

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