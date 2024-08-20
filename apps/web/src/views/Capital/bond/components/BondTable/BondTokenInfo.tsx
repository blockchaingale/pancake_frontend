import { ReactNode } from "react";
import styled from "styled-components";
import { Text } from "@pancakeswap/uikit";
import { SerializedBond } from '@pancakeswap/capital'

interface BondTableFarmTokenInfoProps {
  bond?: SerializedBond
  children?: ReactNode
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`;

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`;

const BondTokenInfo: React.FunctionComponent<React.PropsWithChildren<BondTableFarmTokenInfoProps>> = ({
  bond,
  children
}) => {
  const pairContainer = (
    <Container>
      <TokenWrapper>{children}</TokenWrapper>
      <Text bold textTransform="uppercase" color="secondary" pr="4px">
        {bond.displayName}
      </Text>
      <Text bold> BOND</Text>
    </Container>
  );

  return pairContainer
};

export default BondTokenInfo;
