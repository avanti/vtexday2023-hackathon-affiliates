import React from 'react';
import { ModalDialog } from 'vtex.styleguide'
import { useModal } from './ModalContext'
import { useMutation, useQuery } from 'react-apollo';
import APPROVE_AFFILIATION from '../../../graphql/custom/approveOrDenyAffiliate.graphql';
import { ApolloQueryResult } from 'apollo-client';
import GET_AFFILIATE_ID from '../../../graphql/custom/getaffiliateById.graphql';

interface Props{
  refetch: (variables?: {
    input: {
        page: number;
        pageSize: number;
    };
} | undefined) => Promise<ApolloQueryResult<any>>}

const ModalDialogExample = ({refetch}: Props) => {
  const { isModalOpen, closeModal, affiliateId } = useModal();
  // const [isApproved, setIsApproved] = useState()


  const { data: resultData } = useQuery(GET_AFFILIATE_ID, {
    variables: {
        affiliateId: affiliateId
    },
    fetchPolicy: 'no-cache'

  })

  const [approveAffiliation, {  }] = useMutation(APPROVE_AFFILIATION, {
      onError: (error) => {
      console.log('error', error)
    }
  });

  const handleCloseModal = () => {
    closeModal()
  };

  const handleConfirm = async () => {
    console.log('resultData', resultData.getAffiliateById.status)
    const param = resultData.getAffiliateById.status === 'APPROVED' ? false : true
    console.log('param', param)
    await approveAffiliation({
      variables: { input: { affiliateId: affiliateId, approve: param } }});
    await refetch()

    closeModal()
  };


  return (
    <div>
      {isModalOpen && (
        <ModalDialog
          centered
          confirmation={{
            onClick: handleConfirm,
            label: 'CONFIRMAR',
          }}
          cancelation={{
            onClick: handleCloseModal,
            label: 'CANCELAR',
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        >
                <p style={{fontSize: '1.5rem', fontWeight: 300, color: 'black'}}>
                DESEJA APROVAR/REPROVAR A AFILIAÇÃO?
              </p>
              <p style={{marginTop: '10px'}}>
                Você pode reverter esta ação a qualquer momento.
              </p>
        </ModalDialog>
      )}
    </div>
  );
};

export default ModalDialogExample;
