/**
 * TransactionRow.js
 * A single transaction row inside an expanded customer section.
 */

import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import { formatDate } from '../../utils/dateUtils';

const TransactionRow = ({ transaction }) => {
  const { transactionId, amount = 0, date, points = 0 } = transaction || {};

  return (
    <TableRow hover>
      <TableCell sx={{ pl: 4, fontSize: 13 }}>{transactionId}</TableCell>
      <TableCell sx={{ fontSize: 13 }}>{formatDate(date)}</TableCell>
      <TableCell sx={{ fontSize: 13 }}>${amount?.toFixed(2)}</TableCell>
      <TableCell>
        <Chip
          label={`${points} pts`}
          size="small"
          color={points > 100 ? 'success' : points > 0 ? 'primary' : 'default'}
          variant="outlined"
        />
      </TableCell>
    </TableRow>
  );
};

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    transactionId: PropTypes.string.isRequired,
    amount:        PropTypes.number.isRequired,
    date:          PropTypes.string.isRequired,
    points:        PropTypes.number.isRequired,
  }).isRequired,
};

export default TransactionRow;
