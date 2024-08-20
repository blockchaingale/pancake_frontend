import styled from "styled-components";
import { Skeleton } from "@pancakeswap/uikit"

interface PricePropsWithLoading {
  price: string;
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`;

const Price: React.FunctionComponent<React.PropsWithChildren<PricePropsWithLoading>> = ({
  price,
}) => {
  return <Amount earned={Number(price)}>{price.toLocaleString()}</Amount>;
};

export default Price;
