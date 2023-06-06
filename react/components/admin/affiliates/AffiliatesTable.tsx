import type { TableColumn, UseSortReturn } from '@vtex/admin-ui'
import {
  experimental_I18nProvider as I18nProvider,
  // Flex,
  Tag,
  IconGear,
  Skeleton,
  // useSearchState,
  // Search,
  Table,
  DataViewControls,
  FlexSpacer,
  Pagination,
  useTableState,
  useDataViewState,
  usePaginationState,
  DataView,
  // Dropdown,
  // useDropdownState,
  Stack,
} from '@vtex/admin-ui'
import { useRuntime } from 'vtex.render-runtime'
import type { FC } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from 'react-apollo'

import { PAGE_SIZE } from '../../../utils/constants'
import { messages } from '../../../utils/messages'
import GET_AFFILIATES from '../../../graphql/custom/getAffiliateCustom.graphql'
// import { setSortOrder } from '../../../utils/shared'
import TableActions from '../shared/TableActions'
import { VIEW_DETAILS_ICON } from '../../../utils/icons'
import { ModalProvider } from '../Modal/ModalContext'
import ModalDialogExample from '../Modal/Modal'
import CheckboxWithModal from '../Modal/CheckboxWithModal'


type TableColumns = {
  affiliateId: string
  name: string
  storeName: string
  email: string
  phone: string
  isApproved: boolean
}

// interface IsApprovedItemType {
//   value: string
//   label: string
// }

const AffiliatesTable: FC = () => {
  const intl = useIntl()
  const {
    culture: { locale },
  } = useRuntime()

  // We need to do this because of a circular dependency
  const [sortState, setSortState] = useState<UseSortReturn>()
  const { navigate } = useRuntime()

  const view = useDataViewState()

  // const initialValues = {
  //   value: 'any',
  //   label: intl.formatMessage(messages.affiliatesTableIsApprovedTextAny),
  // }

  const pagination = usePaginationState({
    pageSize: PAGE_SIZE,
  })

  // const { value, onChange, onClear } = useSearchState({
  //   timeout: 500,
  // })

  const tableActions = useCallback(
    (item: TableColumns) => {
      return [
        {
          label: intl.formatMessage(messages.detailsLabel),
          icon: VIEW_DETAILS_ICON,
          handleOnClick: () => {
            navigate({
              page: 'admin.app.affiliates.affiliate-detail',
              params: {
                affiliateId: item.affiliateId,
              },
            })
          },
        },
        // {
        //   label: intl.formatMessage(messages.editLabel),
        //   icon: EDIT_ICON,
        //   handleOnClick: () => {
        //     navigate({
        //       page: 'admin.app.affiliates.affiliate-edit',
        //       params: {
        //         affiliateId: item.affiliateId,
        //       },
        //     })
        //   },
        // },
      ]
    },
    [intl, navigate]
  )
  const columns: Array<TableColumn<TableColumns>> = [
    {
      id: 'affiliateId',
      header: intl.formatMessage(
        messages.affiliatesTableAffiliateIdColumnLabel
      ),
    },
    {
      id: 'name',
      header: intl.formatMessage(messages.affiliatesTableNameColumnLabel),
    },
    // {
    //   id: 'storeName',
    //   header: intl.formatMessage(messages.affiliatesTableStoreNameColumnLabel),
    // },
    {
      id: 'email',
      header: intl.formatMessage(messages.affiliatesTableEmailColumnLabel),
    },
    // {
    //   id: 'phone',
    //   header: intl.formatMessage(messages.affiliatesTablePhoneColumnLabel),
    // },
    {
      id: 'status',
      header: intl.formatMessage(messages.affiliatesTableIsApprovedColumnLabel),
      resolver: {
        type: 'plain',
        render: ({ data, item }) =>
          data ? (
            <Stack csx={{ justifyContent: 'center', height: 64 }}>
              <CheckboxWithModal affiliateId={item.affiliateId}  status={(item as any).status as string}/>
            </Stack>
          ) : (
            <Stack csx={{ justifyContent: 'center', height: 64 }}>
              <Tag
                label={intl.formatMessage(
                  messages.affiliatesTableIsApprovedTextFalse
                )}
                variant="gray"
              />
            </Stack>
          ),
      },
      sortable: true,
    },
    {
      id: 'actions',
      header: () => <div style={{marginLeft: '8px'}}><IconGear /></div>,
      width: 120,
      resolver: {
        type: 'root',
        render: function percentageRender({ item, context }) {
          if (context.status === 'loading') {
            return <Skeleton csx={{ height: 24 }} />
          }

          return (
            <I18nProvider locale={locale}>
              <TableActions  actions={tableActions(item)} />
            </I18nProvider>
          )
        },
      },
    },
  ]

  // const isApprovedItems: IsApprovedItemType[] = [
  //   {
  //     value: 'any',
  //     label: intl.formatMessage(messages.affiliatesTableIsApprovedTextAny),
  //   },
  //   {
  //     value: 'true',
  //     label: intl.formatMessage(messages.affiliatesTableIsApprovedTextTrue),
  //   },
  //   {
  //     value: 'false',
  //     label: intl.formatMessage(messages.affiliatesTableIsApprovedTextFalse),
  //   },
  // ]


  const { data, loading, refetch } = useQuery(GET_AFFILIATES, {
    variables: {
      input: {
        page: pagination.currentPage,
        pageSize: PAGE_SIZE,
      }
    },
    onCompleted: (resultData) => {
      if (pagination.total !== resultData.getAffiliates.pagination.total) {
        pagination.paginate({
          type: 'setTotal',
          total: resultData ? resultData.getAffiliates.pagination.total : 0,
        })
      }

      if (resultData.getAffiliates.data.length > 0) {
        view.setStatus({
          type: 'ready',
        })
      } else {
        view.setStatus({
          type: 'empty',
          message: intl.formatMessage(messages.tableNoResults),
        })
      }
    },
    onError: () => {
      view.setStatus({
        type: 'error',
        message: intl.formatMessage(messages.tableDataError),
      })
    },
  })

  const dataGridState = useTableState<TableColumns>({
    columns,
    length: 6,
    items: data ? data.getAffiliates.data : [],
    view,
  })

  // Controls the loading state of the table
  useEffect(() => {
    if (loading && view.status !== 'loading') {
      view.setStatus({
        type: 'loading',
      })
    }
  }, [loading, view, pagination])

  // Controls the sorting state of the table
  useEffect(() => {
    if (
      sortState?.by !== dataGridState.sortState.by ||
      sortState?.order !== dataGridState.sortState.order
    ) {
      setSortState(dataGridState.sortState)
    }
  }, [setSortState, dataGridState.sortState, sortState])

  return (
    <I18nProvider locale={locale}>
      <ModalProvider>

        <DataView state={view}>
          <DataViewControls>
            <FlexSpacer />
            <Pagination
              state={pagination}
              preposition={intl.formatMessage(messages.paginationPreposition)}
              subject={intl.formatMessage(messages.paginationSubject)}
              prevLabel={intl.formatMessage(messages.paginationPrevLabel)}
              nextLabel={intl.formatMessage(messages.paginationNextLabel)}
            />
          </DataViewControls>
          <Table state={dataGridState} />
        </DataView>
        <ModalDialogExample refetch={refetch}/>

      </ModalProvider>

    </I18nProvider>
  )
}

export default AffiliatesTable
