import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';

interface Transaction {
  id: number;
  sl_no: number;
  district_name: string;
  market_name: string;
  commodity: string;
  variety: string;
  grade: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_date: string;
}

interface RawTransaction {
  'Sl no.': number; // or string, based on your data
  'District Name': string;
  'Market Name': string;
  'Commodity': string;
  'Variety': string;
  'Grade': string;
  'Min Price (Rs./Quintal)': number;
  'Max Price (Rs./Quintal)': number;
  'Modal Price (Rs./Quintal)': number;
  'Price Date': string; // You can use Date if you plan to parse it
}

interface TransactionHistoryTableProps {
  selectedCrop: string;
}

const columns: GridColDef<Transaction>[] = [
  { field: 'sl_no', headerName: 'S No.', flex: 1, minWidth: 80 },
  { field: 'district_name', headerName: 'District Name', flex: 2, minWidth: 150 },
  { field: 'market_name', headerName: 'Market Name', flex: 2, minWidth: 150 },
  { field: 'commodity', headerName: 'Commodity', flex: 2, minWidth: 120 },
  { field: 'variety', headerName: 'Variety', flex: 2, minWidth: 120 },
  { field: 'grade', headerName: 'Grade', flex: 1, minWidth: 100 },
  { field: 'min_price', headerName: 'Min Price (Rs./Quintal)', flex: 2, minWidth: 170 },
  { field: 'max_price', headerName: 'Max Price (Rs./Quintal)', flex: 1, minWidth: 170 },
  { field: 'modal_price', headerName: 'Modal Price (Rs./Quintal)', flex: 1, minWidth: 170 },
  { field: 'price_date', headerName: 'Price Date', flex: 2, minWidth: 170 },
];

const convertExcelDateToJSDate = (excelSerialDate: number): string => {
  const date = new Date((excelSerialDate - 25569) * 86400 * 1000); // Convert Excel serial date to JavaScript Date
  const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  return formattedDate;
};

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ selectedCrop }) => {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchData = async (crop: string) => {
      try {
        // Map selectedCrop to the corresponding Excel file
        const cropFileMap: { [key: string]: string } = {
          Cumin: 'cumin_data.xlsx',
          Turmeric: 'turmeric_data.xlsx',
          Chillies: 'chilli_data.xlsx',
          Pepper: 'pepper_data.xlsx'
        };

        const fileName = cropFileMap[crop];

        if (!fileName) {
          console.error('No file found for the selected crop:', crop);
          return;
        }

        const response = await fetch(`venus/src/data/${fileName}`); // Adjust the path based on your folder structure
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: RawTransaction[] = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel data to match DataGrid structure
        const mappedData: Transaction[] = jsonData.map((row: RawTransaction, index: number) => {
          let priceDate = row['Price Date'];

          // Check if the priceDate is a number (Excel serial date)
          if (typeof priceDate === 'number') {
            priceDate = convertExcelDateToJSDate(priceDate);
          }

          return {
            id: index + 1,
            sl_no: row['Sl no.'],
            district_name: row['District Name'],
            market_name: row['Market Name'],
            commodity: row['Commodity'],
            variety: row['Variety'],
            grade: row['Grade'],
            min_price: row['Min Price (Rs./Quintal)'],
            max_price: row['Max Price (Rs./Quintal)'],
            modal_price: row['Modal Price (Rs./Quintal)'],
            price_date: priceDate, // Use formatted date
          };
        });

        setRows(mappedData);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    // Load data whenever the selectedCrop changes
    if (selectedCrop) {
      fetchData(selectedCrop);
    }
  }, [selectedCrop]);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
      />
    </div>
  );
};

export default TransactionHistoryTable;
