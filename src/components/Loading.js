import React from "react";
import styled from "styled-components";
const Div = styled.div`
 
  position: fixed;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.shown ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background-color: rgba(55, 146, 203, 0.88);
  top: 0;
  left: 0;
  font-size: 30px;
  font-weight: bold;
  color: white;
`;

export default function Loading({ shown }) {
  return <Div shown={shown}>Loading</Div>;
}
