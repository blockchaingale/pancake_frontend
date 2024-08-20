import React from "react";
import styled from "styled-components";
import { Position } from "@pancakeswap/uikit/src/components/Dropdown/types";
import { Text, Dropdown, Button, ButtonScale, Colors, Flex } from "@pancakeswap/uikit";


const MenuButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  padding: 0 8px;
  border-radius: 8px;
`;
MenuButton.defaultProps = {
  variant: "text",
  size: "sm",
};

interface Props {
  currentType: string;
  types: string[];
  setType: (type: string) => void;
  dropdownPosition?: Position;
  buttonScale?: ButtonScale;
}

const TokenTypeSelector: React.FC<React.PropsWithChildren<Props>> = ({
  currentType,
  types,
  setType,
  dropdownPosition = "bottom",
  buttonScale = "md",
}) => (
  <Flex border="1px solid" borderRadius="8px">
    <Dropdown
      position={dropdownPosition}
      target={
        <Button scale={buttonScale} variant="text" width="100%">
          <Text>{currentType?.toUpperCase()}</Text>
        </Button>
      }
    >
      {types.map((type) => (
        <MenuButton
          key={type}
          fullWidth
          onClick={() => setType(type)}
          // Safari fix
          style={{ minHeight: "32px", height: "auto" }}
        >
          {type}
        </MenuButton>
      ))}
    </Dropdown>
  </Flex>
);

export default React.memo(TokenTypeSelector, (prev, next) => prev.currentType === next.currentType);
