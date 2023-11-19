export type TableRow = Record<string, any>;


interface TableProps {
    headers: string[];
    rows: TableRow[];
    onClick?: () => void;
}

const TableComponent = ({ headers, rows, onClick }: TableProps) => {
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
                {rows?.length > 0 ? rows.map((row, rowIndex) => (
                    <tr key={rowIndex} onClick={onClick} className="hover:bg-gray-100 hover:cursor-pointer"> 
                        {headers.map((header, cellIndex) => (
                            <td key={cellIndex} className="py-2 px-4 border-b border-gray-200 text-sm">
                                {row[header]}
                            </td>
                        ))}
                    </tr>
                )) : (
                    <tr>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-center" colSpan={headers.length}>
                            No data
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableComponent;