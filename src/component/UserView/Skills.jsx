import React, { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MRT_EditActionButtons,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';;

const skillsData = [
  {
    id: 'INC02760',
    name: 'Moksh Thakran',
    experience: '0 yrs 5 months',
    primarySkills: ['Java', 'JavaScript', 'MySQL'],
    secondarySkills: ['ReactJS', 'NodeJS'],
    knowledgeIn: ['Springboot'],
  },
];

const SkillsTable = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Employee ID-Name',
        enableSorting: false,
        enableEditing: false,
        Cell: ({ cell }) => `${cell.row.original.id} - ${cell.row.original.name}`,
        size: 200,
      },
      {
        accessorKey: 'experience',
        header: 'Years Of Experience',
        enableEditing: false,
        enableSorting: false,
      },
      {
        accessorKey: 'primarySkills',
        header: 'Primary Skill Details',
        enableSorting: false,
        enableEditing: true,
        Cell: ({ cell }) => cell.row.original.primarySkills.join(', '),
      },
      {
        accessorKey: 'secondarySkills',
        header: 'Secondary Skill Details',
        enableSorting: false,
        enableEditing: true,
        Cell: ({ cell }) => cell.row.original.secondarySkills.join(', '),
      },
      {
        accessorKey: 'knowledgeIn',
        header: 'Knowledge In',
        enableSorting: false,
        enableEditing: true,
        Cell: ({ cell }) => cell.row.original.knowledgeIn.join(', '),
      },
      {
        accessorKey: 'additionalSkills',
        header: 'Additional Skills',
        enableEditing: true,
        Cell: () => '',
      },
    ],
    [validationErrors],
  );

  const table = useMaterialReactTable({
    columns,
    data: skillsData,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    state: {
      showAlertBanner: false,
      showProgressBars: false,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const Skills = () => (
  <QueryClientProvider client={queryClient}>
    <SkillsTable />
  </QueryClientProvider>
);

export default Skills;
