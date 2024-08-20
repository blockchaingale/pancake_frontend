import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import _toNumber from "lodash/toNumber";
import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { 
  Modal, 
  ModalBody, 
  ModalActions, 
  Button,
  AutoRenewIcon,
  useToast,
  Box,
  Text,
  Flex,
  Checkbox,
  Input,
  ModalForLaunchpad,
  TextArea,
  YoutubeIcon,
  PictureIcon,
  LanguageIcon,
  FacebookIcon,
  TwitterIcon,
  GithubIcon,
  TelegramIcon,
  RedditIcon,
  DiscordIcon,
  InstagramIcon,
} from "@pancakeswap/uikit";
import useCatchTxError from "hooks/useCatchTxError";
import { ToastDescriptionWithTx } from "components/Toast";
import { useAppDispatch } from "state";
import { fetchLaunchpadPublicDataAsync } from "state/launchpad";
import { isAddress } from "utils";
import usePool from "../hooks/usePool";

interface DepositModalProps {
  chainId: number
  pool: string
  whitelisted: boolean
  onDismiss?: () => void
}

function validURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.@~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

const StyledTextArea = styled(TextArea)`
  max-width: 100%;
  min-width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`

const InfoModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  pool,
  whitelisted,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const [logoUrl, setLogoUrl] = useState<string>("")
  const [website, setWebsite] = useState<string>("")
  const [facebook, setFaceBook] = useState<string>("")
  const [twitter, setTwitter] = useState<string>("")
  const [github, setGithub] = useState<string>("")
  const [telegram, setTelegram] = useState<string>("")
  const [instagram, setInstagram] = useState<string>("")
  const [discord, setDiscord] = useState<string>("")
  const [reddit, setReddit] = useState<string>("")
  const [youtube, setYoutube] = useState<string>("")
  const [whitelist, setWhitelist] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const [logoUrlError, setLogoUrlError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [facebookError, setFacebookError] = useState("");
  const [twitterError, setTwitterError] = useState("");
  const [githubError, setGithubError] = useState("");
  const [telegramError, setTelegramError] = useState("");
  const [instagramError, setInstagramError] = useState("");
  const [discordError, setDiscordError] = useState("");
  const [redditError, setRedditError] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [whitelistError, setWhitelistError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    setLogoUrlError("")
    if (!validURL(logoUrl)) setLogoUrlError("Invalid URL")
    if (logoUrl === "") setLogoUrlError("Logo url cannot be blank")
    
    setWebsiteError("")
    if (!validURL(website)) setWebsiteError("Invalid URL")
    if (website === "") setWebsiteError("Website cannot be blank")

    setFacebookError("")
    if (facebook !== "" && !validURL(facebook)) setFacebookError("Invalid URL")

    setTwitterError("")
    if (twitter !== "" && !validURL(twitter)) setTwitterError("Invalid URL")

    setGithubError("")
    if (github !== "" && !validURL(github)) setGithubError("Invalid URL")

    setTelegramError("")
    if (telegram !== "" && !validURL(telegram)) setTelegramError("Invalid URL")

    setInstagramError("")
    if (instagram !== "" && !validURL(instagram)) setInstagramError("Invalid URL")

    setDiscordError("")
    if (discord !== "" && !validURL(discord)) setDiscordError("Invalid URL")

    setRedditError("")
    if (reddit !== "" && !validURL(reddit)) setRedditError("Invalid URL")

    setYoutubeError("")
    if (youtube !== "" && !validURL(youtube)) setYoutubeError("Invalid URL")

    setWhitelistError("")
    if (whitelist !== "" && !validURL(whitelist)) setWhitelistError("Invalid URL")

    setDescriptionError("")
    if (description !== "" && description.length < 128) setDescriptionError("Description must be 128 characters or more.")

  }, [logoUrl, website, facebook, twitter, github, telegram, instagram, discord, reddit, youtube, whitelist, description])

  const enabled = 
    logoUrl !== "" &&
    logoUrlError === "" &&
    website !== "" &&
    websiteError === "" &&
    facebookError === "" &&
    twitterError === "" &&
    githubError === "" &&
    telegramError === "" &&
    instagramError === "" &&
    discordError === "" &&
    redditError === "" &&
    youtubeError === "" &&
    (whitelisted ? whitelistError === "" : true) &&
    descriptionError === ""

  const { onUpdateInfo } = usePool(pool, false)
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => {
      dispatch(fetchLaunchpadPublicDataAsync({ address: pool, chainId }))
    },
    [pool, chainId, dispatch],
  )

  const onConfirm = async (val: string[]) => {
    const receipt = await fetchWithCatchTxError(() => onUpdateInfo(val))

    if (receipt?.status) {
      toastSuccess(
        `${t('Pool Information updated')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have updated pool information.')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  return (
    <ModalForLaunchpad title={t("Update Information")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Box mb="15px">
          <Flex>
            <PictureIcon width="14px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Logo URL*")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://...')}
            scale="md"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
          {logoUrlError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {logoUrlError}
          </Text>}
          <Text color="text" fontSize="14px">{t("URL must end with a supported image extension png, jpg, jpeg or gif.")}</Text>
        </Box>
        <Box mb="15px">
          <Flex>
            <LanguageIcon width="16px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Website*")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://...')}
            scale="md"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          {websiteError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {websiteError}
          </Text>}
        </Box>
        <Box mb="15px">
          <Flex>
            <FacebookIcon width="14px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Facebook")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://facebook.com/...')}
            scale="md"
            value={facebook}
            onChange={(e) => setFaceBook(e.target.value)}
          />
          {facebookError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {facebookError}
          </Text>}
        </Box>
        <Box mb="15px">
          <Flex>
            <TwitterIcon width="12px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Twitter")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://x.com/...')}
            scale="md"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
          {twitterError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {twitterError}
          </Text>}
        </Box>
        <Box mb="15px">
          <Flex>
            <GithubIcon width="14px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Github")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://github.com/...')}
            scale="md"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          {githubError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {githubError}
          </Text>}
        </Box>
        <Box mb="15px">
          <Flex>
            <TelegramIcon width="14px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Telegram")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://t.me/...')}
            scale="md"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
          {telegramError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {telegramError}
          </Text>}
        </Box>
        <Box mb="15px">
          <Flex>
            <InstagramIcon width="14px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Instagram")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://instagram.com/...')}
            scale="md"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          {instagramError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {instagramError}
          </Text>}
        </Box>
        <Box mb="15px">
          <Flex>
            <DiscordIcon width="14px" color="primary" />
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Discord")}
            </Text>
          </Flex>
          <Input
            type="text"
            placeholder={t('Ex: https://discord.gg/...')}
            scale="md"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
          {discordError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {discordError}
          </Text>}
        </Box>
        <Box mb="15px">
          <Box width="100%">
            <Flex>
              <RedditIcon width="14px" color="primary" />
              <Text fontSize="12px" ml="4px" color="primary">
                {t("Reddit")}
              </Text>
            </Flex>
            <Input
              type="text"
              placeholder={t('Ex: https://reddit.com/...')}
              scale="md"
              value={reddit}
              onChange={(e) => setReddit(e.target.value)}
            />
            {redditError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {redditError}
            </Text>}
          </Box>
        </Box>
        <Box mb="15px">
          <Box width="100%">
            <Flex>
              <YoutubeIcon width="16px" color="primary" />
              <Text fontSize="12px" ml="4px" color="primary">
                {t("Youtube Video")}
              </Text>
            </Flex>
            <Input
              type="text"
              placeholder={t('Ex: https://youtube.com/watch?v=xxxxxx')}
              scale="md"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
            />
            {youtubeError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {youtubeError}
            </Text>}
            <Text color="text" fontSize="14px">{t("Input your youtube URL, or youtube video ID.")}</Text>
          </Box>
        </Box>
        <Box mb="15px">
          <Box width="100%">
            <Text fontSize="12px" color="primary">
              {t("Whitelist approbation link")}
            </Text>
            <Input
              type="text"
              placeholder={t('Ex: https://...')}
              scale="md"
              value={whitelist}
              onChange={(e) => setWhitelist(e.target.value)}
            />
            {whitelistError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {whitelistError}
            </Text>}
            <Text color="text" fontSize="14px">{t("Input your Google form or link that users can apply for whitelist.")}</Text>
            <Text color="text" fontSize="14px">{t("Supported links from: gleam.io, docs.google.com, forms.gle, sweepwidget.com, crew3.xyz, pinksale.finance, docs.pinksale.finance, zealy.io")}</Text>
          </Box>
        </Box>
        <Box mb="15px">
          <Text fontSize="12px" color="primary">{t("Description*")}</Text>
          <StyledTextArea
            rows={12}
            placeholder={t("Ex: This is the best project...")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {descriptionError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {descriptionError}
          </Text>}
        </Box>
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
            {t("Cancel")}
          </Button>
          {pendingTx ? (
            <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
              {t("Confirming")}
            </Button>
          ) : (
            <Button
              width="100%"
              disabled={!enabled}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm([description, logoUrl, website, facebook, twitter, github, telegram, instagram, discord, reddit, youtube, whitelist]);
                onDismiss?.();
                setPendingTx(false);
              }}
            >
              {t("Confirm")}
            </Button>
          )}
        </ModalActions>
      </Box>
    </ModalForLaunchpad>
  );
};

export default InfoModal;
