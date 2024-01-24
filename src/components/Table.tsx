import clsx from "clsx";

export type TableRow = Record<string, any>;

export type TableHeader = {
    key: string;
    label: string;
    className?: string;
    render?: (row: TableRow) => JSX.Element | string;
};

interface TableProps {
    headers: TableHeader[];
    rows: TableRow[];
    onRowClick?: (row: TableRow, index:number) => void;
    selectedRow?: number;
}

const TableComponent = ({ headers, rows, onRowClick, selectedRow }: TableProps) => {
    return (
        <div className="flex flex-col h-full w-full" >
            <table className="min-w-full leading-normal font-body">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className={`py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider ${header.className ?? ''}`}>
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
            <div className="flex-1 overflow-y-auto">
                <table className="min-w-full">
                    <tbody>
                        {rows?.length > 0 ? rows.map((row, rowIndex) => (
                            <tr key={rowIndex} onClick={() => onRowClick?.(row, rowIndex)} className={clsx("hover:bg-gray-100 hover:cursor-pointer", selectedRow===rowIndex && "bg-blue-100")}>
                                {headers.map((header, cellIndex) => (
                                    <td key={cellIndex} className="py-2 px-4 border-b border-gray-200 text-sm">
                                        {header.render ? header.render(row) : row[header.key]}
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
            </div>
        </div>
    );
};

export default TableComponent;



// import clsx from "clsx";

// export type TableRow = Record<string, any>;

// export type TableHeader = {
//     key: string;
//     label: string;
//     className?: string;
//     render?: (row: TableRow) => JSX.Element | string;
// };

// interface TableProps {
//     headers: TableHeader[];
//     rows: TableRow[];
//     onRowClick?: (row: TableRow, index:number) => void;
//     selectedRow?: number;
// }


// const TableComponent = ({ headers, rows, onRowClick, selectedRow }: TableProps) => {
//     return (
//         <div className="inline-block min-w-full rounded-lg shadow px-1 overflow-x-auto grow relative">
//         <table className="min-w-full leading-normal font-body absolute inset-0">
//             <thead className="sticky">
//                 <tr className="sticky top-0 z-0">
//                     {headers.map((header, index) => (
//                         <th key={index} className={`py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider ${header.className || ''}`}>
//                             {header.label}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody className="overflow-y-auto">
//                 {rows?.length > 0 ? rows.map((row, rowIndex) => (
//                     <tr key={rowIndex} onClick={() => onRowClick?.(row, rowIndex)} className={clsx("hover:bg-gray-100 hover:cursor-pointer", selectedRow===rowIndex && "bg-blue-100")}>
//                         {headers.map((header, cellIndex) => (
//                             <td key={cellIndex} className="py-2 px-4 border-b border-gray-200 text-sm">
//                                 {header.render ? header.render(row) : row[header.key]}
//                             </td>
//                         ))}
//                     </tr>
//                 )) : (
//                     <tr>
//                         <td className="py-2 px-4 border-b border-gray-200 text-sm text-center" colSpan={headers.length}>
//                             No data
//                         </td>
//                     </tr>
//                 )}
//             </tbody>
//         </table>
//         </div>
//     );
// };

// export default TableComponent;

