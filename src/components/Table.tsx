

interface TableProps {
    headers: string[];
    rows: string[][];
}

const TableComponent = ({ headers, rows }: TableProps) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-2 px-4 border-b border-gray-200 text-sm">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableComponent;