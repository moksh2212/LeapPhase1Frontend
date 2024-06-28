// src/AssignmentUser.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Badge,
  Chip,
} from '@mui/material';
import {
  CloudDownload,
  CloudUpload,
  CheckCircleOutline,
  ErrorOutline,
} from '@mui/icons-material';
import FileBase from 'react-file-base64';
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table';

const assignments = [
  {
    id: 1,
    title: 'Assignment 1',
    dueDate: '2024-06-30',
    status: 'Checked',
    downloadLink: '#',
  },
  {
    id: 2,
    title: 'Assignment 2',
    dueDate: '2024-07-10',
    status: 'Not Checked',
    downloadLink: '#',
  },
];

const AssignmentUser = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileChange = (file, id) => {
    setSelectedFiles((prevState) => ({
      ...prevState,
      [id]: file.base64,
    }));
  };

  const handleFileUpload = (id) => {
    if (selectedFiles[id]) {
      setUploadedFiles((prevState) => ({
        ...prevState,
        [id]: selectedFiles[id],
      }));
      alert('File uploaded successfully!');
    } else {
      alert('Please select a file first.');
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('download', {
      header: 'Download',
      cell: (info) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudDownload />}
          href={info.row.original.downloadLink}
        >
          Download
        </Button>
      ),
    }),
    columnHelper.accessor('upload', {
      header: 'Upload',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FileBase
            type="file"
            multiple={false}
            onDone={(file) => handleFileChange(file, info.row.original.id)}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUpload />}
            onClick={() => handleFileUpload(info.row.original.id)}
            sx={{ ml: 2 }}
          >
            Upload
          </Button>
        </Box>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Chip
          label={info.getValue()}
          color={info.getValue() === 'Checked' ? 'success' : 'error'}
          icon={info.getValue() === 'Checked' ? <CheckCircleOutline /> : <ErrorOutline />}
        />
      ),
    }),
    columnHelper.accessor('uploadStatus', {
      header: 'Upload Status',
      cell: (info) => (
        <Typography variant="body2" color="textSecondary">
          {uploadedFiles[info.row.original.id] ? 'File Uploaded' : 'No file uploaded'}
        </Typography>
      ),
    }),
  ];

  const table = useReactTable({
    data: assignments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Total Assignments: <Badge badgeContent={assignments.length} color="primary" />
      </Typography>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ borderBottom: '1px solid #ddd', padding: '8px' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ borderBottom: '1px solid #ddd', padding: '8px' }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default AssignmentUser;
