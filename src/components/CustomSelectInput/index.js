import React from "react";
import { components } from "react-select";

const CustomSelectInput = props => {
  const customProps = Object.assign({}, props);
  delete customProps.autoCorrect;
  delete customProps.autoCapitalize;
  return <components.Input {...customProps} />;
};

export default CustomSelectInput
