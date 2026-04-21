import React, { useState, useMemo } from 'react'
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Chip,
  Box,
  Typography,
  Skeleton,
  Alert,
} from '@mui/material'
import {
  MoreVert,
  Search,
  FilterList,
  GetApp,

} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// Column definition interface
export interface TableColumn {
  id: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  format?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

// Row action interface
export interface RowAction {
  icon: React.ReactNode
  label: string
  onClick: (row: Record<string, unknown>) => void
  disabled?: (row: Record<string, unknown>) => boolean
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
}

// Table props interface
export interface TableProps {
  columns: TableColumn[]
  data: Record<string, unknown>[]
  loading?: boolean
  error?: string
  selectable?: boolean
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  pagination?: boolean
  pageSize?: number
  actions?: RowAction[]
  onRowClick?: (row: Record<string, unknown>) => void
  onSelectionChange?: (selectedRows: Record<string, unknown>[]) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onFilter?: (filters: Record<string, unknown>) => void
  onExport?: () => void
  emptyMessage?: string
  stickyHeader?: boolean
  dense?: boolean
}

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: theme.palette.text.primary,
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main + '20',
    '&:hover': {
      backgroundColor: theme.palette.primary.main + '30',
    },
  },
}))

const SearchBar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}))

// Loading skeleton component
const TableSkeleton: React.FC<{ columns: number; rows?: number }> = ({ columns, rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <Skeleton variant="text" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)

// Empty state component
const EmptyState: React.FC<{ message: string; columns: number }> = ({ message, columns }) => (
  <TableRow>
    <TableCell colSpan={columns} align="center" sx={{ py: 8 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        לא נמצאו נתונים להצגה
      </Typography>
    </TableCell>
  </TableRow>
)

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  error,
  selectable = false,
  searchable = false,
  filterable = false,
  exportable = false,
  pagination = true,
  pageSize = 10,
  actions = [],
  onRowClick,
  onSelectionChange,
  onSort,

  onExport,
  emptyMessage = 'אין נתונים להצגה',
  stickyHeader = false,
  dense = false,
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)
  const [orderBy, setOrderBy] = useState<string>('')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [activeRow, setActiveRow] = useState<any>(null)

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (searchTerm && searchable) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply sorting
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[orderBy]
        const bValue = b[orderBy]
        
        if ((aValue as string | number) < (bValue as string | number)) {
          return order === 'asc' ? -1 : 1
        }
        if ((aValue as string | number) > (bValue as string | number)) {
          return order === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [data, searchTerm, orderBy, order, searchable])

  // Paginated data
  const paginatedData = pagination
    ? processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : processedData

  // Handle sort
  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    setOrder(newOrder)
    setOrderBy(columnId)
    onSort?.(columnId, newOrder)
  }

  // Handle selection
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(processedData)
      onSelectionChange?.(processedData)
    } else {
      setSelected([])
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (row: Record<string, unknown>) => {
    const selectedIndex = selected.indexOf(row)
          let newSelected: Record<string, unknown>[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
    onSelectionChange?.(newSelected)
  }

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle actions menu
  const handleActionsClick = (event: React.MouseEvent<HTMLElement>, row: Record<string, unknown>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setActiveRow(row)
  }

  const handleActionsClose = () => {
    setAnchorEl(null)
    setActiveRow(null)
  }

  const handleActionClick = (action: RowAction) => {
    if (activeRow) {
      action.onClick(activeRow)
    }
    handleActionsClose()
  }

  // Calculate selection state
  const numSelected = selected.length
  const numRows = processedData.length
  const isSelected = (row: Record<string, unknown>) => selected.indexOf(row) !== -1

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Paper>
      {/* Search and filters bar */}
      {(searchable || filterable || exportable) && (
        <SearchBar>
          {searchable && (
            <TextField
              placeholder="חיפוש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ minWidth: 250 }}
            />
          )}
          
          {filterable && (
            <IconButton>
              <FilterList />
            </IconButton>
          )}
          
          {exportable && (
            <IconButton onClick={onExport}>
              <GetApp />
            </IconButton>
          )}
          
          {numSelected > 0 && (
            <Chip
              label={`${numSelected} נבחרו`}
              color="primary"
              size="small"
            />
          )}
        </SearchBar>
      )}

      {/* Table */}
      <StyledTableContainer>
        <MuiTable stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
          <StyledTableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < numRows}
                    checked={numRows > 0 && numSelected === numRows}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              
              {actions.length > 0 && (
                <TableCell align="center">פעולות</TableCell>
              )}
            </TableRow>
          </StyledTableHead>
          
          <TableBody>
            {loading ? (
              <TableSkeleton
                columns={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
              />
            ) : paginatedData.length === 0 ? (
              <EmptyState
                message={emptyMessage}
                columns={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
              />
            ) : (
              paginatedData.map((row, index) => (
                <StyledTableRow
                  key={index}
                  selected={isSelected(row)}
                  onClick={() => {
                    if (selectable) {
                      handleSelectRow(row)
                    }
                    onRowClick?.(row)
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected(row)} />
                    </TableCell>
                  )}
                  
                  {columns.map((column) => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render
                          ? column.render(value, row)
                          : column.format
                          ? column.format(value, row)
                          : String(value)}
                      </TableCell>
                    )
                  })}
                  
                  {actions.length > 0 && (
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => handleActionsClick(e, row)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  )}
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </StyledTableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={processedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="שורות בעמוד:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} מתוך ${count !== -1 ? count : `יותר מ ${to}`}`
          }
        />
      )}

      {/* Actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionsClose}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled?.(activeRow)}
          >
            {action.icon}
            <Box sx={{ ml: 1 }}>{action.label}</Box>
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  )
}

// Predefined table variants for common use cases
export const SimpleTable: React.FC<Omit<TableProps, 'selectable' | 'searchable'>> = (props) => (
  <Table selectable={false} searchable={false} {...props} />
)

export const DataTable: React.FC<TableProps> = (props) => (
  <Table selectable searchable filterable exportable {...props} />
)

export const SelectableTable: React.FC<TableProps> = (props) => (
  <Table selectable {...props} />
)

export default Table
