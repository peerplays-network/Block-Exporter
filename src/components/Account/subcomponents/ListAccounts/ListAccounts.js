import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

import AccountDetail from './AccountDetail';

const ListAccounts = props => {

  const foundAccounts = props.data;
  let accountList = foundAccounts.map(account =>
    <AccountDetail detail={ account } key={ account.id }/>
  );

  return(
    <Table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Balances</th>
            <th>Proposals</th>
            <th>Votes</th>
            <th>Referrer</th>
          </tr>
        </thead>
        <tbody>
          {accountList}
        </tbody>
    </Table>
  );
}
export default ListAccounts;
