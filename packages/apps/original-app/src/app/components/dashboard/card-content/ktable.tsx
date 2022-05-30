import { KDashboardCard } from '@air/shared-api-spec';
import React from 'react';
import { useTable } from 'react-table';
import { KoivelDashboard } from '../../../contexts/koivel-dashboard-context';
import { MetricQueryService } from '../../../services/metric-query-service';

export function KTable(props) {
  const card: KDashboardCard = props.cardConfig;

  const headers = card.options['headers'].map((h, index) => {
    return {
      Header: h,
      accessor: '' + index,
    };
  });

  const columns = React.useMemo(() => headers, []);
  const [data, setData] = React.useState([]);

  const { searchResults } = React.useContext(KoivelDashboard);

  React.useEffect(() => {
    const extractedSeries = MetricQueryService.extractSeries2(
      searchResults,
      props.cardConfig.series[0],
      (series) => {
        return [
          series.name,
          ...series.data.flat().map((v) => v?.toLocaleString('en-US')),
        ];
      }
    );
    if (extractedSeries) {
      setData(extractedSeries);
    }
  }, [searchResults, props.cardConfig.series]);

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table {...getTableProps()} className="min-w-full">
      <thead className="border-b">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="text-sm font-medium text-white px-6 py-4 text-left"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="border-b last:border-0">
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    className="text-sm text-white font-light px-6 py-4 whitespace-nowrap"
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default KTable;
function setChartConfig(arg0: any) {
  throw new Error('Function not implemented.');
}
