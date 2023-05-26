# Optimization Techniques

1. How React works behind the scenes ?
2. Understanding the Virtual DOM and DOM Updates
3. Understanding State and State Updates.

How React works?
A JavaScript Library for building User Interfaces.

Real DOM - What users sees.
Context - Component wide state.

React determines how the component tree currently looks like and what it should look like.
React DOM determines the differences and then manipulates the Real DOM.

## Re-Evalutating Components !== Re-Rendering the DOM

Components are re-evalutated whenever prop,context or state changes,

## Changes in Real DOM are only made for differences between evaluations. (THE PROBLEM)

When a state changes in React and there are different component in the component then the components inside the parent component gets re-evaluated

```
import React, { useState } from "react";
import "./App.css";
import Child from "./Child";

function App() {
  const [state, setState] = useState(false);
  console.log("PARENT RUNNING");
  const handleClick = () => {
    setState((prev) => !prev);
  };

  return (
    <div className="app">
      <h1 onClick={handleClick}>Hi there!</h1>
      <Child />
    </div>
  );
}
export default App;

```

```
import React from "react";

const Child = () => {
  console.log("Child RUNNNING !!");
  return <div>Child</div>;
};

export default Child;

```

OUTPUT:
Initial
PARENT RUNNING
Child RUNNNING !!

//whenever the button is clicked

PARENT RUNNING
Child RUNNNING !!

PARENT RUNNING
Child RUNNNING !!

So , even though the state didn'nt change in the Child component the component was reevealuated as it is inside its parent component.

Re-evaluation does not mean the DOM gets rerendered. The DOM will only get rerendered whenever there is any UI changes..

This re-evaluation continues down the coponent tree and this brings a question isn't it bad? This is a lot of function rexecution and virtual comparisions that certainly costs some performance .

## Preventing Unneccassary Re-Evaluation with --- React.memo()

We got ongoing function execution.We got virtual comparisions.Its needless to say that React is highly optimized for those executions and comparisions . In small application it does not matter.React should only re-execute the (Child Component) component under certain circumstances.And those circumstances must be when the prop changed in the component.

How we will tell React to behave like this ?

We can tell React to behave like this using React.memo().We can wrap the component in React.This is for functional componennt.So,React.memo() allows us to optimize functional components._React should look at the prop which the component gets and check he new value this props gets and compare to it.And only if the prop changes , the component should be re-executed and re-evaluated._

And if the parent component changed but the props value for the component did not change ,component execution will be skipped.

```
import React from "react";

const Child = () => {
  console.log("Child RUNNNING !!");
  return <div>Child</div>;
};

export default React.memo(Child);
```

OUTPUT:
PARENT RUNNING
Child.js:4 Child RUNNNING !!
(After the button click)
App.js:8 PARENT RUNNING

So this is now an optimization in place here that avoids this unnecessary re-rendering.

## Why we are not using it in all our components if it allows us to optimize ?

Because this optimization comes at a cost.The memo method here tells React that whenever the App component changed,it should go the Child component and compare the current prop value to the previous prop value , and it needs to make this compoarision and that ofcourse comes with a performance cost .And it, therefore, greatly depends on the component you're applying this to whether it's worth it or not because you're trading the performance cost of re-evaluating the component for the performance cost of comparing props.

--- (trading the performance cost of re-evaluating the component ) ---

And its impossible to say which cost is higher because it depends on the number of prop and the complexity of the component and number of child component you have .If you, on the other hand, have a component where you know it's going to change or its props values are going to change with pretty much every re-evaluation of the parent component anyways then React.memo doesn't make a lot of sense because if the result is that the component should re-render anyways, well, then you can also save that extra comparison of the prop values. That's then just some overhead cost, which is not worth it.

You just don't wanna wrap every component with React.memo.Instead, you wanna pick some key parts in your component tree which allows you to cut off an entire branch of child components.That's way more effective than doing this on every child component.

## Twist

We wrap the Button Component inside React.memo()

```
import React from "react";

import classes from "./Button.module.css";

const Button = (props) => {
  console.log("Button RUNNING !!");
  return (
    <button
     ...........................
    </button>
  );
};

export default React.memo(Button);
```

Well still we see Button RUNNING!! again and again because its prop value did change but its strange as it only got props.onClick as prop and its name .But both the props never change.We have the same text and same function .
Note: App component is just a JavaScript function at the end.The only magic thing here is that the function's going to be called by React and not by you.But then, it still executes like a normal function,which means all that code executes again, and that has one important implication.Of course, this function which you pass to the Button is re-created. This is now a brand new function for every render or every execution cycle of the App function because in the end it's just a normal constant which we recreate.

Here below in line <Child isVisible={false} /> the value false is also brand new.If boolean value is new false then both the component should be re-evaluated.Why does React.memo() work for boolean values and not for the functions.

If a new false is created and a new function is created, shouldn't then both components be re-evaluated?
Well we need to keep in mind that values like booleans, String, Numbers are primitive values in JavaScript.So, React.memo() does in the end it that it compares props.onClick and the props.previous.onClick and finds it not similar.(Not exactly internally).

```
....

  return (
    <div className="app">
      <h1>Hi there!</h1>
      <Button onClick={handleClick}> CLICK </Button>
      <Child isVisible={false} />
    </div>
  );
}
..
```

Arrays = [1,2,3] === [1,2,3] //false
true === true //true
"Smriti" === "Smriti"

Functions are just objects in JavaScript.Now, two objects, even if they have the same content, are never equal in JavaScript when compared like this.

Component that receives
https://academind.com/tutorials/reference-vs-primitive-values/

## Preventing Function Recreation using useCallbacks() .

We can make React.memo() work for objects as well.There is a React hook provided by React which can help us with that.Use Callback is a hook that allows us to basically store a function across component executions.So it allows us to tell React that we wanna save a function and that this function should not be recreated with every execution.

let obj1= {}
let obj2 = {}

obj1===obj2 //false
obj1 = obj2
obj1===obj2 //true  
object

And that's in the end what Use Callback does for us, it will save a function of our choice basically somewhere in React's internal storage and we'll always reuse that same function object then when this component function executes. And using it is simple.

```
import React, { useCallback, useState } from "react";

import "./App.css";
import Child from "./Child";
import Button from "./components/UI/Button/Button";

function App() {
  const [state, setState] = useState(false);
  console.log("PARENT RUNNING");

  const handleClick = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  return (
    <div className="app">
      <h1>Hi there!</h1>
      <Button onClick={handleClick}> CLICK </Button>
      <Child isVisible={false} />
    </div>
  );
}

export default App;
```

OUTPUT:
PARENT RUNNING
Button.js:6 Button RUNNING !!
Child.js:4 Child RUNNNING !!
3App.js:9 PARENT RUNNING

## useCallback() and its dependencies

```
import React, { useCallback, useState } from "react";

import "./App.css";
import Child from "./Child";
import Button from "./components/UI/Button/Button";

function App() {
  const [state, setState] = useState(false);
  const [show, setShow] = useState(false);
  console.log("PARENT RUNNING");

  const handleClick = useCallback(() => {
    if (show) {
      setState((prev) => !prev);
    }
  }, []); //the state is dependent on show

  const handleToggle = () => {
    setShow(true);
  };

  return (
    <div className="app">
      <h1>Hi there!</h1>
      <Button onClick={handleClick}> CLICK </Button>
      <Button onClick={handleToggle}>Enable Toggling</Button>
      <Child isVisible={state} />
    </div>
  );
}

export default App;
```

Here the state is dependent on show so if we dont put show as dependency nothings changes and the state does not update .So we add show as dependency

```
  const handleClick = useCallback(() => {
    if (show) {
      setState((prev) => !prev);
    }
  }, [show]);

```

## useMemo() to memoize

```
import React, { useState, useCallback } from "react";

import "./App.css";
import DemoList from "./components/Demo/DemoList";
import Button from "./components/UI/Button/Button";

function App() {
  const [listTitle, setListTitle] = useState("My List");

  const changeTitleHandler = useCallback(() => {
    setListTitle("New Title");
  }, []);

  return (
    <div className="app">
      <DemoList title={listTitle} items={[5, 3, 1, 10, 9]} />
      <Button onClick={changeTitleHandler}>Change List Title</Button>
    </div>
  );
}

export default App;
```

```
import React, { useMemo } from "react";
import classes from "./DemoList.module.css";

const DemoList = (props) => {
  const sortedList = useMemo(() => {
    console.log("Sorting running again");
    return props.items.sort((a, b) => a - b);
  }, [props.items]);

  return (
    <div className={classes.list}>
      <h2>{props.title}</h2>
      <ul>
        {sortedList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default DemoList;

```

OUTPUT:
Sorting running again
Button.js:6 Button RUNNING
DemoList.js:6 Sorting running again

But why did it happen ? Because the array we are sending as prop changes as they are not primitive values so everytime a new array is created. we can memoize it too .

```

import "./App.css";
import DemoList from "./components/Demo/DemoList";
import Button from "./components/UI/Button/Button";

function App() {
  const [listTitle, setListTitle] = useState("My List");

  const changeTitleHandler = useCallback(() => {
    setListTitle("New Title");
  }, []);

  const itemList = useMemo(() => [5, 3, 1, 10, 9], []);
  return (
    <div className="app">
      <DemoList title={listTitle} items={itemList} />
      <Button onClick={changeTitleHandler}>Change List Title</Button>
    </div>
  );
}

export default App;
```

Closures = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#lexical_scoping
Resource = https://github.com/academind/react-complete-guide-code/tree/12-a-look-behind-the-scenes
