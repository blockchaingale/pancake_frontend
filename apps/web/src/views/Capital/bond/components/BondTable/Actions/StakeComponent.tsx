import { useTranslation } from "@pancakeswap/localization";
import { Text, Button } from "@pancakeswap/uikit";
import { StyledActionContainer, ActionContent, ActionTitles } from "./styles";

interface StakeComponentProps {
  lpSymbol: string;
  onPresentDeposit: () => void;
  isTokenOnly: boolean;
}

const StakeComponent: React.FunctionComponent<React.PropsWithChildren<StakeComponentProps>> = ({
  lpSymbol,
  onPresentDeposit,
  isTokenOnly
}) => {
  const { t } = useTranslation();

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
          {t("Mint")}
        </Text>
        <Text bold color="secondary" fontSize="12px">
          {lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pl="4px">
          {t("Bond")}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" onClick={onPresentDeposit} variant="secondary">
            {
              isTokenOnly ? t('Mint %symbol% Bond', {symbol: lpSymbol}) : t('Mint LP Bond')
            }
        </Button>
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakeComponent;
