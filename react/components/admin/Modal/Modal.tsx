import React from 'react';
import { ModalDialog } from 'vtex.styleguide'
import { useModal } from './ModalContext'
import { useMutation } from 'react-apollo';
import APPROVE_AFFILIATION from '../../../graphql/custom/approveOrDenyAffiliate.graphql';

const ModalDialogExample = () => {
  const { isModalOpen, closeModal, affiliateId } = useModal();
  const [approveAffiliation, { }] = useMutation(APPROVE_AFFILIATION, {
    onCompleted: (data) => {
      console.log('resultData', data)
    },
    onError: (error) => {
      console.log('error', error)
    }
  });

  const handleCloseModal = () => {
    closeModal()
  };

  const handleConfirm = async () => {
    console.log('affiliateId', affiliateId)
    await approveAffiliation({
      variables: { input: { affiliateId: affiliateId, approve: false } }});
    closeModal()
  };

  return (
    <div>
      {isModalOpen && (
        <ModalDialog
          centered
          confirmation={{
            onClick: handleConfirm,
            label: 'SIM',
          }}
          cancelation={{
            onClick: handleCloseModal,
            label: 'NÃO',
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        >
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 w-50-ns">
              <p className="f3 f1-ns fw3 gray">
                DESEJA APROVAR/REPROVAR A AFILIAÇÃO?
              </p>
            </div>

          </div>
        </ModalDialog>
      )}
    </div>
  );
};

export default ModalDialogExample;
