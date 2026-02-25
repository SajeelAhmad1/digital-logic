'use client';

import React, { useMemo, useState } from 'react';
import Layout, { FormattedMessage } from '../Layout';
import { gql, useMutation, useQuery } from 'urql';
import Table, { Td, Th, Tr } from '../../../components/Elements/Table';
import ModalComponent from '../../../components/Elements/Modal';
import toast from 'react-hot-toast';

const DELETE_USER = gql`
  mutation Mutation($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export interface IUser {
  chatId?: number;
  cover?: string;
  citizenship?: string;
  dob?: string;
  experience?: number;
  gender?: string;
  group?: string;
  hp?: string;
  id?: string;
  isAdmin?: boolean;
  isStaff?: boolean;
  locationPreference?: string;
  name?: string;
  phone?: string;
  qualification?: string;
  race?: string;
  typePreference?: string[];
  categoryPreference?: string[];
  username?: string;
  email?: string;
  prompt?: string;
  systemPrompt?: string;
  requestCount?: number;
  isDisabled: boolean;
  isEmailVerified: boolean;
}

export const GET_USERS = gql`
  query Users {
    users {
      id
      name
      email
    }
  }
`;

const UPDATE_ADMIN_STATUS = gql`
  mutation Mutation($userId: String!, $status: Boolean) {
    updateAdminStatus(userId: $userId, status: $status) {
      id
      isAdmin
    }
  }
`;

const UPDATE_STAFF_STATUS = gql`
  mutation Mutation($userId: String!, $status: Boolean) {
    updateStaffStatus(userId: $userId, status: $status) {
      id
      isAdmin
    }
  }
`;

function AdminBadge() {
  return (
    <span className="mx-0.5 bg-zinc-600 text-white p-1 px-2 text-xs font-medium rounded-lg cursor-default">
      A
    </span>
  );
}

function Users() {
  const [variables, setVariables] = useState<{ isAdmin?: boolean }>({});
  const [{ fetching, data }] = useQuery({ query: GET_USERS, variables });
  const [{ fetching: updatingAdminStatus }, updateAdminStatus] =
    useMutation(UPDATE_ADMIN_STATUS);
  const [{ fetching: updatingStaffStatus }, updateStaffStatus] =
    useMutation(UPDATE_STAFF_STATUS);
  const [{ fetching: deleting }, deleteUser] = useMutation(DELETE_USER);

  const [userDetailsId, setUserDetailsId] = useState('');
  const [showUpdatePromptModal, setShowUpdatePromptModal] =
    useState<any>(false);

  const userDetails = useMemo(() => {
    return data?.users?.find((u: IUser) => u.id === userDetailsId);
  }, [userDetailsId, data]);

  return (
    <>
      <Layout heading="Users">
        <div className="my-4 flex">
          <div>
            <select
              className="p-2"
              onChange={(e) => {
                if (e.target.value === 'all') {
                  delete variables.isAdmin;
                  setVariables({ ...variables });
                } else if (e.target.value === 'true') {
                  setVariables({ ...variables, isAdmin: true });
                } else {
                  setVariables({ ...variables, isAdmin: false });
                }
              }}
            >
              <option value="all">
                <FormattedMessage defaultMessage="All" id="users.all" />
              </option>
              <option value="true">
                <FormattedMessage defaultMessage="Admin" id="users.admin" />
              </option>
              <option value="false">
                <FormattedMessage
                  defaultMessage="Non-admin"
                  id="users.non-admin"
                />
              </option>
            </select>
          </div>
        </div>
        {fetching ? (
          <div className="flex justify-center items-center min-h-screen">
            Loading...
          </div>
        ) : (
          <div>
            <Table className="!text-sm">
              <Tr>
                <Th>
                  <FormattedMessage defaultMessage="Name" id="users.name" />
                </Th>
                <Th>
                  <FormattedMessage defaultMessage="Email" id="users.email" />
                </Th>
                <Th>
                  <FormattedMessage defaultMessage="Phone" id="users.phone" />
                </Th>
                <Th>{null}</Th>
              </Tr>
              {data?.users?.map((user: IUser) => {
                return (
                  <Tr key={user.id}>
                    <Td>
                      {user?.isAdmin && <AdminBadge />}
                      {user.name}
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>{user.phone}</Td>
                    <Td>{null}</Td>
                  </Tr>
                );
              })}
            </Table>
          </div>
        )}
      </Layout>
    </>
  );
}

export default Users;
