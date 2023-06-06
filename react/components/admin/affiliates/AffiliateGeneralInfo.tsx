import {
  Card,
  CardContent,
  Stack,
  Heading,
  FlexSpacer,
  Columns,
  Column,
  Box,
  Text,
} from '@vtex/admin-ui'
import type { FC } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import type { Affiliate } from 'vtexdayhackathon3.vtexday2023-hackathon-affiliates'

import { messages } from '../../../utils/messages'
import LoadingBox from '../shared/LoadingBox'

type AffiliateGeneralInfoProps = {
  loading: boolean
  affiliate?: Affiliate
}

const AffiliateGeneralInfo: FC<AffiliateGeneralInfoProps> = ({
  affiliate,
  loading,
}) => {
  const intl = useIntl()

  if (loading) {
    return (
      <LoadingBox csx={{ width: 'full', height: 146, marginBottom: '16px' }} />
    )
  }

  return (
    <Box as="div" csx={{ marginTop: '16px' }}>
      <Heading>{intl.formatMessage(messages.generalInfoLabel)}</Heading>
      <Card>
        <CardContent>
          <Stack space="$xs" fluid>
            <Columns space="1">
              <Column units={6}>
                <Text variant="title1">{`${intl.formatMessage(
                  messages.nameLabel
                )}: `}</Text>
                <Text variant="action2" tone="info">
                  {affiliate?.name}
                </Text>
                <FlexSpacer />
                <Text variant="title1">Código do afiliado:</Text>
                <Text variant="action2" tone="info">
                  {affiliate?.affiliateCode}
                </Text>
                <FlexSpacer />
                <Text variant="title1">{`${intl.formatMessage(
                  messages.phoneLabel
                )}: `}</Text>
                <Text variant="action2" tone="info">
                  {formatPhoneNumber(affiliate?.phone)}
                </Text>
                <FlexSpacer />
                {/* <Text variant="title1">{`${intl.formatMessage(
                  messages.slugLabel
                )}: `}</Text>
                <Text variant="action2" tone="info">
                  {affiliate?.slug}
                </Text>
                <FlexSpacer /> */}
                <Text variant="title1">{`${intl.formatMessage(
                  messages.emailLabel
                )}: `}</Text>
                <Text variant="action2" tone="info">
                  {affiliate?.email}
                </Text>
              </Column>
              <Column units={6}>

                <Text variant="title1">{`${intl.formatMessage(
                  messages.refIdLabel
                )}: `}</Text>
                <Text variant="action2" tone="info">
                  {affiliate?.affiliateId}
                </Text>
                <FlexSpacer />
                <Text variant="title1">{`${intl.formatMessage(
                  messages.documentTypeLabel
                )}: `}</Text>
                <Text variant="action2" tone="info">
                  CPF
                </Text>
                <FlexSpacer />
                <Text variant="title1">{`${intl.formatMessage(
                  messages.documentLabel
                )}: `}</Text>
                <Text variant="action2" tone="info">
                  {formatCPF(affiliate?.cpf)}
                </Text>
              </Column>
            </Columns>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AffiliateGeneralInfo

function formatPhoneNumber(value: string): string {
  const ddd = value.slice(0, 2);
  const firstPart = value.slice(2, 7);
  const secondPart = value.slice(7);

  return `(${ddd}) ${firstPart}-${secondPart}`;
}
function formatCPF(value: string): string {
  const firstPart = value.slice(0, 3);
  const secondPart = value.slice(3, 6);
  const thirdPart = value.slice(6, 9);
  const verificationDigits = value.slice(9);

  return `${firstPart}.${secondPart}.${thirdPart}-${verificationDigits}`;
}
