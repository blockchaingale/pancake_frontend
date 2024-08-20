import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Text, Box, TextArea, Button, Input, Flex, LanguageIcon, PictureIcon, FacebookIcon, TwitterIcon, GithubIcon, TelegramIcon, InstagramIcon, DiscordIcon, RedditIcon, YoutubeIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import ProgressSteps from 'views/Swap/components/ProgressSteps'
import { useAccount, useChainId } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { DeFi, LaunchpadFormView, Socials, TokenData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

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

export function SocialsForm({
  setModalView,
  tokenData,
  deFiData,
  socials,
  setSocials
}: {
  setModalView: Dispatch<SetStateAction<LaunchpadFormView>>
  tokenData: TokenData
  deFiData: DeFi
  socials: Socials
  setSocials: Dispatch<SetStateAction<Socials>>
}) {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const [logoUrl, setLogoUrl] = useState<string>(socials.logoUrl)
  const [website, setWebsite] = useState<string>(socials.website)
  const [facebook, setFaceBook] = useState<string>(socials.facebook)
  const [twitter, setTwitter] = useState<string>(socials.twitter)
  const [github, setGithub] = useState<string>(socials.github)
  const [telegram, setTelegram] = useState<string>(socials.telegram)
  const [instagram, setInstagram] = useState<string>(socials.instagram)
  const [discord, setDiscord] = useState<string>(socials.discord)
  const [reddit, setReddit] = useState<string>(socials.reddit)
  const [youtube, setYoutube] = useState<string>(socials.youtube)
  const [whitelist, setWhitelist] = useState<string>(socials.whitelist)
  const [description, setDescription] = useState<string>(socials.description)

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

  const handleNext = async () => {
    setSocials({
      logoUrl,
      website,
      facebook,
      twitter,
      github,
      telegram,
      instagram,
      discord,
      reddit,
      youtube,
      whitelist,
      description
    })
    setModalView(LaunchpadFormView.Review)
  }

  const handlePrev = async () => {
    setSocials({
      logoUrl,
      website,
      facebook,
      twitter,
      github,
      telegram,
      instagram,
      discord,
      reddit,
      youtube,
      whitelist,
      description
    })
    setModalView(LaunchpadFormView.DeFiInfo)
  }

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
    (deFiData.whitelist ? whitelistError === "" : true) &&
    descriptionError === ""

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Create Launchpad')} subTitle={t('')} />
      <FormContainer>
        <ProgressSteps steps={[true, true, false]} />
        <Box>
          <Text fontSize="16px" bold color="primary">{t("3. Add Additional Info")}</Text>
          <Text fontSize="12px">{t("Let people know who you are")}</Text>
        </Box>
        <Box>
          <Box mb="20px">
            <Flex flexDirection={["column", "column", "column", "row"]}>
              <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
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
              <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
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
            </Flex>
          </Box>
          <Box mb="20px">
            <Flex flexDirection={["column", "column", "column", "row"]}>
              <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
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
              <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
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
            </Flex>
          </Box>
          <Box mb="20px">
            <Flex flexDirection={["column", "column", "column", "row"]}>
              <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
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
              <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
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
            </Flex>
          </Box>
          <Box mb="20px">
            <Flex flexDirection={["column", "column", "column", "row"]}>
              <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
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
              <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
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
            </Flex>
          </Box>
          <Box mb="20px">
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
          <Box mb="20px">
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
          {deFiData.whitelist && <Box mb="20px">
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
          </Box>}
          <Box mb="20px">
            <Text fontSize="12px" ml="4px" color="primary">
              {t("Description")}
            </Text>
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
        </Box>
        {!account ? <ConnectWalletButton /> : <Flex width="100%">
          <Button
            width="100%"
            mr="15px"
            onClick={handlePrev}
          >{t("Prev")}</Button>
          <Button
            width="100%"
            onClick={handleNext}
            disabled={!enabled}
          >{t("Next")}</Button>
        </Flex>}
      </FormContainer>
    </Box>
  )
}
