import "../css/Table.css";

const Table = ({ columns, data }) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.slice(0, 5).map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.accessor}>
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
