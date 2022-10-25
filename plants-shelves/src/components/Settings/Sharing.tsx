import React, { useState } from 'react';
import { DELETE_SHARED_WITH, GET_USERS_SHARING_WITH } from '../User/queries';
import { useMutation, useQuery } from '@apollo/client';
import LoadingScreen from '../Plants/LoadingScreen';
import ErrorHandler from '../Plants/ErrorHandler';

interface SharingProps {
    action: () => any
  }

interface BorrowerDataType {
    borrower: {
        email: string,
        id: string
    }
}

interface SharingWithDataType {
    sharingWith: BorrowerDataType[]
}

function Sharing({ action }: SharingProps) {
    const [borrowers, setBorrowers] = useState<BorrowerDataType[]>([]);


    const { loading, error } = useQuery<SharingWithDataType>(
        GET_USERS_SHARING_WITH,
        {
          onCompleted: (data) => {
            setBorrowers(data.sharingWith);
          },
          onError: (e: Error) => console.error('Error getting user settings:', e),
          fetchPolicy: 'network-only'
        }
      );

    const [deleteBorrower, deletingStatus] = useMutation(DELETE_SHARED_WITH, {
      onCompleted: (data: any) => {
        console.log(deletingStatus, data);
      },
      onError: (e) => console.error('Error deleting plant:', e)
    });


    const onBorrowerDelete = async (email: string, index: number) => {
        await deleteBorrower({variables: { email } });
        setBorrowers(borrowers.filter((borrower, borrower_index) => borrower_index === index ));
    }

    return (
      <>
        <div>
            <ul>
            {
              borrowers.map((entry, index) =>
                <li key={index}>
                    {entry.borrower.email}
                    <button className='btn btn-danger' onClick={() => onBorrowerDelete(entry.borrower.email, index)}> Remove </button>
                </li>
              )
            }
            </ul>
        </div>
        <LoadingScreen isLoading={loading} isFullScreen={true}/>
        <ErrorHandler error={error} />
      </>
    )

}

export default Sharing;