import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber"
import { useTranslation } from "@pancakeswap/localization"
import { 
  Box,
  // Card,
  DiceSlider,
  Flex,
  ModalInput,
  // Slider,
  Text,
  useMatchBreakpoints
} from "@pancakeswap/uikit"

import addresses from 'config/constants/contracts'

import useTheme from 'hooks/useTheme'
import Page from "views/Page"
import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import { AppBody } from "components/App"
import { GameTabButton } from "views/Flip/components/GameTabButtons"
import { StyledAppBody } from "views/Flip/StyledAppBody"
import GameCommitButton from "views/Flip/components/GameCommitButton"
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback"
// import tryParseAmount from "@pancakeswap/utils/tryParseAmount"
// import { useToken } from "hooks/Tokens"
import { MMTOKEN } from "@pancakeswap/tokens"
import { useGameInfo } from "views/Flip/hooks/useGameInfo"
// import { Currency, CurrencyAmount } from "@pancakeswap/sdk";
// import { maxAmountSpend } from "utils/maxAmountSpend";
import { trimTrailZero } from "@pancakeswap/utils/trimTrailZero";

const Dice = () => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { theme } = useTheme()

  // const [betPercent, setBetPercent] = useState(1)
  const [prediction, setPrediction] = useState(1)
  const [pan, setPan] = useState(0)
  const [value, setValue] = useState("")
  const [valUSDPrice, setValUSDPrice] = useState(BIG_ZERO);

  const {
    currencyBalance,
    parsedAmount,
    inputError
  } = useGameInfo(value, MMTOKEN[chainId])

  const [approval, approveCallback] = useApproveCallback(parsedAmount, addresses.flip[148])

  const currencyBalanceNumber = useMemo(() => currencyBalance ? new BigNumber(currencyBalance.toFixed(18)) : BIG_ZERO, [currencyBalance]);

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  // const handleChangePercent = (v: number) => {
  //   setBetPercent(Math.floor(v));
  // }

  const handleChangePrediction = (v: number) => {
    setPrediction(Math.floor(v));
  }

  const handleChangePan = (v: number) => {
    setPan(v);
    setPrediction(100 - prediction);
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        const inputVal = e.currentTarget.value.replace(/,/g, ".");
        setValue(inputVal);

        const USDPrice = inputVal === "" ? BIG_ZERO : new BigNumber(inputVal).times(1);
        setValUSDPrice(USDPrice);
      }
    },
    [setValue, setValUSDPrice]
  );

  const handleSelectMax = useCallback(() => {
    setValue(currencyBalanceNumber.toFixed(18));

    const USDPrice = new BigNumber(currencyBalanceNumber.toFixed(18)).times(1);
    setValUSDPrice(USDPrice);
  }, [currencyBalanceNumber, setValue, setValUSDPrice]);

  const handlePercentInput = useCallback(
    (percent: number) => {
      const totalAmount = currencyBalanceNumber.dividedBy(100).multipliedBy(percent);
      const amount = trimTrailZero(totalAmount.toNumber().toFixed(18));
      setValue(amount as string);

      const USDPrice = totalAmount.times(1);
      setValUSDPrice(USDPrice);
    },
    [currencyBalanceNumber]
  );

  return (
    <Page
      removePadding
      noMinHeight
    >
      <Flex
        width={isTablet || isMobile? "100%" : "80%"}
        height="100%"
        justifyContent="center"
        flexDirection={isTablet || isMobile? "column" : "row"}
        position="relative"
        my="30px"
      >
        <Flex width={isTablet || isMobile? "100%" : "60%"} height="100%" flexDirection="column" alignItems="center" mr="30px" mb="20px">
          <StyledAppBody background={theme.card.background} maxWidth={isTablet || isMobile? "400px" : "800px"} height="400px">
            <GameTabButton tabs={["Roll Under", "Roll Over"]} onChangePan={handleChangePan} />
            <Flex flexDirection="column" margin="auto" width="90%" maxWidth="500px">
              <Flex justifyContent="center">
                <Flex flexDirection="column" mr="20px">
                  <Text textAlign="center" fontSize="70px" bold>?</Text>
                  <Text textAlign="center">Lucky Number</Text>
                </Flex>
                <Flex flexDirection="column" mr="20px">
                  <Text textAlign="center" fontSize="70px" bold>{pan === 0 ? "<" : ">"}</Text>
                </Flex>
                <Flex flexDirection="column">
                  <Text textAlign="center" fontSize="70px" bold>{prediction}</Text>
                  <Text textAlign="center">Prediction</Text>
                </Flex>
              </Flex>
              <Flex flexDirection="column" justifyContent="center" alignItems="center" width="100%" position="relative" mb="50px">
                <DiceSlider
                  name="lp-amount"
                  min={pan === 0 ? 1 : 5}
                  max={pan === 0 ? 95 : 99}
                  value={prediction}
                  onValueChanged={handleChangePrediction}
                  width="100%"
                  pan={pan}
                />
                <Flex justifyContent="space-between" width="100%" px="5px" position="absolute" top="35px">
                  <Text>{pan === 0 ? 1 : 5}</Text>
                  <Text>{pan === 0 ? 23 : 27}</Text>
                  <Text>{pan === 0 ? 47 : 51}</Text>
                  <Text>{pan === 0 ? 72 : 76}</Text>
                  <Text>{pan === 0 ? 95 : 99}</Text>
                </Flex>
              </Flex>
            </Flex>
          </StyledAppBody>
        </Flex>
        <Flex width={isTablet || isMobile? "100%" : "40%"} height="100%" flexDirection="column" alignItems="center">
          <StyledAppBody background={theme.card.background} maxWidth="400px" height="400px" p="20px">
            <Flex flexDirection="column" justifyContent="space-between" height="100%">
              <Flex flexDirection="column">
                <ModalInput
                  value={value}
                  valueUSDPrice={valUSDPrice}
                  onSelectMax={handleSelectMax}
                  onPercentInput={handlePercentInput}
                  onChange={handleChange}
                  max={currencyBalanceNumber.toFixed(18)}
                  maxAmount={currencyBalanceNumber}
                  symbol="MM"
                  addLiquidityUrl=""
                  inputTitle={t("Bet")}
                  decimals={18}
                />
                {/* <Flex mt="20px">
                  <Flex alignItems="center">
                    <Text>Leverage</Text>
                  </Flex>
                  <Flex alignItems="center" width="100%">
                    <Slider
                      name="lp-amount"
                      min={1}
                      max={100}
                      value={betPercent}
                      onValueChanged={handleChangePercent}
                      width="100%"
                    />
                  </Flex>
                  <Flex
                    background={theme.colors.backgroundAlt2}
                    borderRadius="8px"
                    alignItems="center"
                    p="10px"
                  >
                    x{betPercent}
                  </Flex>
                </Flex> */}
              </Flex>
              <Flex flexDirection="column">
                <Flex justifyContent="space-between" mb="5px">
                  <Text>Input bet :</Text>
                  <Text>{(Number(value)).toFixed(2)} MM</Text>
                </Flex>
                <Flex justifyContent="space-between" mb="5px" pt="5px" borderTop={`1px solid ${theme.colors.text99}`}>
                  <Text>Maximum profit :</Text>
                  <Text>{value ? "+" : ""}{(Number(value) * 98/(100 - (pan === 0 ? 100 - prediction : prediction)) - Number(value)).toFixed(2)} MM</Text>
                </Flex>
                <Flex justifyContent="space-between" mb="5px" pt="5px" borderTop={`1px solid ${theme.colors.text99}`}>
                  <Text>Multiplier :</Text>
                  <Text>{value ? "x" : ""}{(98/(100 - (pan === 0 ? 100 - prediction : prediction))).toFixed(2)}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb="20px" pt="5px" borderTop={`1px solid ${theme.colors.text99}`}>
                  <Text>Win Chance :</Text>
                  <Text>{((pan === 0 ? prediction : 100 - prediction)).toFixed(2)}%</Text>
                </Flex>
                <GameCommitButton
                  account={account}
                  approval={approval}
                  approveCallback={approveCallback}
                  approvalSubmitted={approvalSubmitted}
                  // setApprovalSubmitted={setApprovalSubmitted}
                  currency={MMTOKEN[chainId]}
                  swapInputError={inputError}
                  // parsedAmount={parsedAmount}
                  onStake={(v: string) => {console.log(v);}}
                />
              </Flex>
            </Flex>
          </StyledAppBody>
        </Flex>
      </Flex>
    </Page>
  )
}

export default Dice