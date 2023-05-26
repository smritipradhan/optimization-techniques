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
