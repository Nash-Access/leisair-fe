
export const jsonToCSV = (jsonData: any[]): string => {
    if (jsonData.length === 0) return '';
  
    const headers = Object.keys(jsonData[0]).join(',');
    const rows = jsonData.map(row =>
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
  
    return [headers, ...rows].join('\n');
  }