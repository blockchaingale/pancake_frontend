import React, { useState } from "react";
import styled from "styled-components";
import { ButtonMenu, ButtonMenuItem, Flex } from "@pancakeswap/uikit";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface GameTabButtonsProps {
  tabs: string[];
  onChangePan: (v: number) => void;
}

export const GameTabButton: React.FC<React.PropsWithChildren<GameTabButtonsProps>> = ({ tabs, onChangePan }) => {
  const [pan, setPan] = useState(0);

  const handleChange = (v: number) => {
    setPan(v);
    onChangePan(v);
  }

  return (
    <Wrapper>
      <Flex width="max-content" flexDirection="column" mt="20px">
        <ButtonMenu activeIndex={pan} onItemClick={handleChange} scale="sm" variant="subtle">
          {tabs.map((tab) => {
            return <ButtonMenuItem key={tab}>{tab}</ButtonMenuItem>
          })}
        </ButtonMenu>
      </Flex>
    </Wrapper>
  );
};
