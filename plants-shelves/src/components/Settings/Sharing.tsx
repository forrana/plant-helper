import React, { useState } from 'react';
import { DELETE_SHARED_WITH, GET_USERS_SHARING_WITH, SHARE_WITH_NEW_USER } from '../User/queries';
import { useMutation, useQuery } from '@apollo/client';
import LoadingScreen from '../Plants/LoadingScreen';
import ErrorHandler from '../Plants/ErrorHandler';
import { Input, InputGroup } from 'reactstrap';

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
    const [newBorrowerEmail, setNewBorrowerEmail] = useState<string>("");


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

      },
      onError: (e) => console.error('Error deleting plant:', e)
    });

    const [addBorrower, addingStatus] = useMutation(SHARE_WITH_NEW_USER, {
      onCompleted: (data: any) => {
        const newBorrower = { borrower: data.shareWithNewUser.sharedWith.borrower };

        setBorrowers([...borrowers, newBorrower]);
      },
      onError: (e) => console.error('Error deleting plant:', e)
    });

    const onBorrowerDelete = async (email: string, index: number) => {
      await deleteBorrower({variables: { email } });
      setBorrowers(borrowers.filter((borrower, borrower_index) => borrower_index !== index ));
    }

    const onBorrowerAdd = async () => {
      await addBorrower({variables: { email: newBorrowerEmail }});
    }

    const handleNewBorrowerEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewBorrowerEmail(event.target.value);
    }

    return (
      <>
        <section>
            <InputGroup className='input-group'>
              <Input
                type="email" name="newBorrowerEmail" id="newBorrowerEmail" placeholder="Friend's email"
                data-testid="new-borrower-email-input"
                value={newBorrowerEmail}
                onChange={handleNewBorrowerEmailInputChange}
              />
              <button className='btn btn-success' onClick={() => onBorrowerAdd()}>
                Share
              </button>
            </InputGroup>
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
        </section>
        <LoadingScreen isLoading={loading} isFullScreen={true}/>
        <ErrorHandler error={error} />
      </>
    )

}

export default Sharing;