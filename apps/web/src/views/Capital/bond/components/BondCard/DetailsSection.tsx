import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";
import { Flex, LinkExternal, Skeleton, Text } from "@pancakeswap/uikit";
import { SerializedBond } from "@pancakeswap/capital";
import { BASE_ADD_LIQUIDITY_URL } from "config";

export interface ExpandableSectionProps {
  bond?: SerializedBond
  scanAddressLink?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`;

export const DetailsSection: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  bond,
  scanAddressLink,
}) => {
  const { t } = useTranslation();

  // const addLiquidityUrl = bond.lpBond ? `${BASE_ADD_LIQUIDITY_URL}/${bond.token0.address}/${bond.token1.address}` : `/swap?outputCurrency=${bond.bondToken.address}`

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{t("Total Purchased")}:</Text>
        {bond?.purchased ? <Text>{bond?.purchased}</Text> : <Skeleton width={75} height={25} />}
      </Flex>
      <StyledLinkExternal href={`/swap?outputCurrency=${bond.bondToken.address}`}>{t("Get %symbol%", { symbol: bond?.displayName })}</StyledLinkExternal>
      {scanAddressLink && (
        <StyledLinkExternal isBscScan href={scanAddressLink}>
          {t("View Contract")}
        </StyledLinkExternal>
      )}
    </Wrapper>
  );
};
