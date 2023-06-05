import React, { useState } from 'react';
import { Checkbox } from 'vtex.styleguide';
import { useModal } from './ModalContext';
import { useQuery } from 'react-apollo';
import GET_AFFILIATE_ID from '../../../graphql/custom/getaffiliateById.graphql';

interface CheckboxWithModalProps {
  affiliateId: string;
  refetch: () => void;
}

const CheckboxWithModal = ({ affiliateId, refetch }: CheckboxWithModalProps) => {
  const { openModal } = useModal();
  const[isApproved, setIsapproved] = useState(false)

  const { data: resultData, error } = useQuery(GET_AFFILIATE_ID, {
    variables: {
        affiliateId: affiliateId
    },
    onCompleted: () => {
      if(resultData.getAffiliateById.status === 'APPROVED'){
        setIsapproved(true)
      }else {
        setIsapproved(false)
      }
    },
    onError: () => {
      console.log('error', error)
    }

  })

  const handleCheckboxChange = () => {
    openModal(affiliateId, refetch);
  };

  return (
    <Checkbox onChange={handleCheckboxChange} checked={isApproved} />
  );
};

export default CheckboxWithModal;
