<p align="center" style="color: #343a40">
  <h1 align="center">destyle</h1>
</p>
<p align="center" style="font-size: 1.2rem;">Decouple your styling from your components</p>

#### Why

Styling in react is fragmented, because the focus is on the wrong problem. How many times have you tried to include a component in your project only to be annoyed by having to work with their styling system? Having to work through the frictions of extending/overriding styles? Having to rely on limited styling logic included in the component?

The problem is that components and styling are too coupled. **destyle** is a style namespace manager, like an upgrade to vanilla css, that allows you to decouple your styling and _styling logic_ from your components and component logic. It allows the creation of purely style-less components, that are easily themeable and overridable, and is css library agnostic (_with exception to highly coupled libs like styled components_).

Vanilla CSS - _(basic decoupling)_

|  CSS   |    Component     |
| :----: | :--------------: |
| Styles | Component Markup |
|        | Component Logic  |
|        |   Style Logic    |

Styled Components - _(heavily coupled)_

| CSS |    Component     |
| :-: | :--------------: |
|     | Component Markup |
|     | Component Logic  |
|     |   Style Logic    |
|     |      Styles      |

destyle - _(complete decoupling)_

|     CSS     |    Component     |
| :---------: | :--------------: |
|   Styles    | Component Markup |
| Style Logic | Component Logic  |

---

#### Getting Started

```bash
npm install destyle --save
```

#### Demo

[![Edit w2x0260z75](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/w2x0260z75)

#### Building Components

destyle is a HOC, that you wrap around your component and provide a namespace. It injects a `styles` property into your component which you provide semantic keys to your markup. For example:

```javascript
import React from 'react'
import { destyle } from 'destyle'

const UserCard = ({ styles }) => (
  <div className={styles.container}>
    <img className={styles.avatar} src="https://..." />
    <div className={styles.content}>
      <div className={styles.name}>Disco Biscuit</div>
      <div className={styles.details}>
        I enjoy being a cat.
      </div>
    </div>
  </div>
)

// give your component a namespace
export default destyle(UserCard, 'UserCardStyles')
```

#### Writing styles

Then **_anywhere_** in your application, you can use these two functions to set styles on namespace keys:

`setStyles(namespace, stylesObjectOrFunction)` or `addStyles(namespace, stylesObjOrFunction)`

The difference between these two functions is that `addStyles` pushes the object to an array that is concatenated in order, while `setStyles` performs a complete overwrite. Styles can be both static, or a **function** that receives props of the consumer. For example (_using emotion, however any styling lib including traditional css is fine_):

```javascript
import { addStyles } from 'destyle'
import { css } from 'emotion'

addStyles('UserCardStyles', (props, state) => ({
  container: css`
    font-family: 'Arial';
    background-color: #f5f5f5;
    height: 96px;
    width: 100%;
  `,
  avatar: css`
    float: left;
    height: 96px;
    width: 96px;
    border-right-style: solid;
    border-right-width: 4px;
    border-right-color: ${props.active ? #D05E5E : #111};
  `
  // Rest of your styles
}))
```

Notice how you can easily use props to determine your styling, and those props don't even need to be mentioned inside your component. They are pure styling logic props. You can also provide `state` as a second argument which will allow you to use your wrapped components local state to determine styling.

#### Concatenation

To control how namespaces get concatenated, you can override the default string concatenation with:

`setConcatenator(concatenatorFunction)`

For example, if you use say `emotion` with destyle, you can set the concatentor to `cx` with `setConcatenator(cx)`

#### Extending namespaces & Merging styles from elsewhere

In the event that you really don't want to use a prop to determine the styling, you can pass extra namespaces into the `destyleNames` prop when using your component. This will apply the original namespace first, and then the order of the added namespaces.

You can also use the `destyleMerge` prop to pass in preprocessed styles directly (not namespaced). This can be useful for passing parent styles directly down to children.

---

#### But I really like putting styles in the same file as my components

Well do that then. Ideally you would put your styles in a separate file to avoid forced inclusion of your code in another project, but the beauty of using destyle, is that `setStyles()` can completely void your coupled styles anyway.

#### Goals

To separate both styling and styling logic from component markup and component logic. This will allow the community to build functional style-less components which are easily themable, and overridable. To try and be as style syntax agnostic as possible (obviously any lib that couples by design will not work). This makes the community less fragmented, as each style lib simply becomes a stylistic choice. To keep the lib as simple as possible, and potentially allow for plugins that can use the namespace for more advanced meta ideas.

#### Discussion & The Future

While this module could be used in production (and we are), it is the beginning of a new idea, and so we expect the api to likely change. Because using this provides a fully accessible namespace, we can imagine a future where plugins are added that can do things like document the namespace, report style coverage, and other interesting ideas. Ideally this could be used to create a style-less full component library, that can be themed in different ways. Imagine if say material components and ant design were just themes over the same set of components. Imagine if everyone built style-less components with destyle.

We are happy to discuss any new ideas in the issues.

---

Made by [Syntropy](https://www.syntropy.xyz)
