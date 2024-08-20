import { ReactNode } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { Text, IconButton, AddIcon } from "@pancakeswap/uikit";
import { StyledActionContainer, ActionContent, ActionTitles, IconButtonWrapper } from "./styles";

interface StakedActionComponentProps {
  lpSymbol: string;
  children?: ReactNode;
  disabledPlusButton?: boolean;
  onPresentDeposit: () => void;
}

const StakedActionComponent: React.FunctionComponent<React.PropsWithChildren<StakedActionComponentProps>> = ({
  lpSymbol,
  children,
  disabledPlusButton,
  onPresentDeposit,
}) => {
  const { t } = useTranslation();

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold color="secondary" fontSize="12px" pr="4px">
          {lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Staked")}
        </Text>
      </ActionTitles>
      <ActionContent>
        {children}
        <IconButtonWrapper>
          <IconButton variant="secondary" disabled={disabledPlusButton} onClick={onPresentDeposit}>
            <AddIcon color="primary" width="14px" />
          </IconButton>
        </IconButtonWrapper>
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakedActionComponent;
