/**
 * TransactionRow.jsx
 * A small row component to show individual transaction details.
 */

import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import { formatDate } from '../../utils/dateUtils';

const TransactionRow = ({ transaction }) => {
  const { transactionId, date, amount = 0, points = 0 } = transaction || {};

  return (
    <TableRow hover>
      <TableCell sx={{ pl: 4, fontSize: 13 }}>{transactionId}</TableCell>
      <TableCell sx={{ fontSize: 13 }}>{formatDate(date)}</TableCell>
      <TableCell sx={{ fontSize: 13 }}>${amount.toFixed(2)}</TableCell>
      <TableCell>
        <Chip label={`${points} pts`} size="small" />
      </TableCell>
    </TableRow>
  );
};

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    transactionId: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
  }).isRequired,
};

export default TransactionRow;
