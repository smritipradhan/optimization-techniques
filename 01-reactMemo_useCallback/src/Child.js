import React from "react";

const Child = ({ isVisible }) => {
  console.log("Child RUNNNING !!");
  return isVisible && <div>Child</div>;
};

export default React.memo(Child);
