import React from "react";
import './TransationTable.scss';
import { Row, usePagination, useSortBy, useTable } from 'react-table';
import useStaking from "../../hooks/useStaking";
import BaseButton from "../ui/BaseButton/BaseButton";

export const TransationTable = () => {
  const { transactions } = useStaking();
  const columns = React.useMemo(
    () => [
      {
        Header: '№',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Block',
        accessor: 'blockHash',
      },
      {
        Header: 'Date',
        accessor: 'time',
      },
      {
        Header: 'Event',
        accessor: 'event',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Asset',
        accessor: 'asset',
      },
    ],
    []
  );
  // @ts-ignore
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // @ts-ignore
    page,
    // @ts-ignore
    canPreviousPage,
    // @ts-ignore
    canNextPage,
    // @ts-ignore
    pageOptions,
    // @ts-ignore
    pageCount,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    nextPage,
    // @ts-ignore
    previousPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: transactions,
      // @ts-ignore
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );
  const colSpan = columns.length;
  return (
    <section className="transactions">
      <div className="transactions__anchor" id="transactions"/>
      <h2 className="transactions__subtitle">Transactions:</h2>
      <table className="transactions__table table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                className="table__cell"
                  // @ts-ignore
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                  {column.render('Header')}
                </th>
            ))}
            </tr>
        ))}
        </thead>
        {page.length
          ? <tbody {...getTableBodyProps()}>
            {page.map((row: Row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td className="table__cell" {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
          </tbody>
          : <tbody>
            <tr>
              <td colSpan={colSpan} className="table__empty">Table is empty</td>
            </tr>
          </tbody>
        }
      </table>
      <div className="table__pagination">
        <BaseButton className="table__button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </BaseButton>{' '}
        <BaseButton className="table__button" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </BaseButton>{' '}
        <BaseButton className="table__button" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </BaseButton>{' '}
        <BaseButton className="table__button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </BaseButton>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default TransationTable;
