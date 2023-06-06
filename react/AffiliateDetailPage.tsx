import type { FC } from 'react'
import React from 'react'
import {
  Page,
  PageHeader,
  PageHeaderTitle,
  PageHeaderTop,
  PageContent,
  ThemeProvider,
  ToastProvider,
  PageHeaderActions,
} from '@vtex/admin-ui'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'

import { messages } from './utils/messages'
import AffiliateContent from './components/admin/affiliates/AffiliateContent'

const AffiliateDetailPage: FC = () => {
  const {
    route: {
      params: { affiliateId },
    },
    navigate,
  } = useRuntime()

  // const onEditClick = useCallback(() => {
  //   navigate({
  //     page: 'admin.app.affiliates.affiliate-edit',
  //     params: {
  //       affiliateId,
  //     },
  //   })
  // }, [navigate, affiliateId])

  // const onAffiliateOrdersClick = useCallback(() => {
  //   navigate({
  //     page: 'admin.app.affiliates.dashboard',
  //     query: `search=${affiliateId}`,
  //   })
  // }, [navigate, affiliateId])

  const intl = useIntl()

  return (
    <ThemeProvider>
      <ToastProvider>
        <Page>
          <PageHeader
            onPopNavigation={() =>
              navigate({
                page: 'admin.app.affiliates.affiliate-management',
              })
            }
          >
            <PageHeaderTop>
              <PageHeaderTitle>{`${intl.formatMessage(
                messages.affiliateLabel
              )}: ${affiliateId}`}</PageHeaderTitle>
              <PageHeaderActions>

              </PageHeaderActions>
            </PageHeaderTop>
          </PageHeader>
          <PageContent>
            <AffiliateContent />
          </PageContent>
        </Page>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default AffiliateDetailPage
