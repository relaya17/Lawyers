// Rich Text Editor Component
// רכיב עורך טקסט עשיר

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Undo,
  Redo,
  Link,
  Image,
  TableChart,
  Code,
  MoreVert,
} from '@mui/icons-material'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  minHeight?: number
  maxHeight?: number
  label?: string
  error?: boolean
  helperText?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'התחל לכתוב...',
  readOnly = false,
  minHeight = 200,
  maxHeight = 600,
  label,
  error = false,
  helperText,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertLink = () => {
    const url = prompt('הכנס כתובת URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('הכנס כתובת תמונה:')
    if (url) {
      execCommand('insertImage', url)
    }
  }

  const insertTable = () => {
    const rows = prompt('מספר שורות:', '3')
    const cols = prompt('מספר עמודות:', '3')
    if (rows && cols) {
      const table = document.createElement('table')
      table.style.borderCollapse = 'collapse'
      table.style.width = '100%'
      
      for (let i = 0; i < parseInt(rows); i++) {
        const row = table.insertRow()
        for (let j = 0; j < parseInt(cols); j++) {
          const cell = row.insertCell()
          cell.style.border = '1px solid #ccc'
          cell.style.padding = '8px'
          cell.textContent = `תא ${i + 1}-${j + 1}`
        }
      }
      
      const range = window.getSelection()?.getRangeAt(0)
      if (range) {
        range.deleteContents()
        range.insertNode(table)
        handleInput()
      }
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      {label && (
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {label}
        </Typography>
      )}
      
      <Paper
        elevation={isFocused ? 2 : 1}
        sx={{
          border: error ? '2px solid #d32f2f' : isFocused ? '2px solid #1976d2' : '1px solid #e0e0e0',
          borderRadius: 1,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
          }}
        >
          <Tooltip title="חזור">
            <IconButton size="small" onClick={() => execCommand('undo')} disabled={readOnly}>
              <Undo />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="חזור על">
            <IconButton size="small" onClick={() => execCommand('redo')} disabled={readOnly}>
              <Redo />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Tooltip title="מודגש">
            <IconButton size="small" onClick={() => execCommand('bold')} disabled={readOnly}>
              <FormatBold />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="נטוי">
            <IconButton size="small" onClick={() => execCommand('italic')} disabled={readOnly}>
              <FormatItalic />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="קו תחתון">
            <IconButton size="small" onClick={() => execCommand('underline')} disabled={readOnly}>
                              <FormatUnderlined />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="קו חוצה">
            <IconButton size="small" onClick={() => execCommand('strikeThrough')} disabled={readOnly}>
              <FormatStrikethrough />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Tooltip title="רשימה עם נקודות">
            <IconButton size="small" onClick={() => execCommand('insertUnorderedList')} disabled={readOnly}>
              <FormatListBulleted />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="רשימה ממוספרת">
            <IconButton size="small" onClick={() => execCommand('insertOrderedList')} disabled={readOnly}>
              <FormatListNumbered />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="ציטוט">
            <IconButton size="small" onClick={() => execCommand('formatBlock', '<blockquote>')} disabled={readOnly}>
              <FormatQuote />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Tooltip title="יישור לשמאל">
            <IconButton size="small" onClick={() => execCommand('justifyLeft')} disabled={readOnly}>
              <FormatAlignLeft />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="יישור למרכז">
            <IconButton size="small" onClick={() => execCommand('justifyCenter')} disabled={readOnly}>
              <FormatAlignCenter />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="יישור לימין">
            <IconButton size="small" onClick={() => execCommand('justifyRight')} disabled={readOnly}>
              <FormatAlignRight />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="יישור לשתי הצדדים">
            <IconButton size="small" onClick={() => execCommand('justifyFull')} disabled={readOnly}>
              <FormatAlignJustify />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Tooltip title="קישור">
            <IconButton size="small" onClick={insertLink} disabled={readOnly}>
              <Link />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="תמונה">
            <IconButton size="small" onClick={insertImage} disabled={readOnly}>
              <Image />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="טבלה">
            <IconButton size="small" onClick={insertTable} disabled={readOnly}>
              <TableChart />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="קוד">
            <IconButton size="small" onClick={() => execCommand('formatBlock', '<pre>')} disabled={readOnly}>
              <Code />
            </IconButton>
          </Tooltip>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton size="small" onClick={handleMenuOpen} disabled={readOnly}>
            <MoreVert />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { execCommand('formatBlock', '<h1>'); handleMenuClose(); }}>
              <ListItemIcon><Typography variant="h6">H1</Typography></ListItemIcon>
              <ListItemText>כותרת 1</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { execCommand('formatBlock', '<h2>'); handleMenuClose(); }}>
              <ListItemIcon><Typography variant="h6">H2</Typography></ListItemIcon>
              <ListItemText>כותרת 2</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { execCommand('formatBlock', '<h3>'); handleMenuClose(); }}>
              <ListItemIcon><Typography variant="h6">H3</Typography></ListItemIcon>
              <ListItemText>כותרת 3</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { execCommand('formatBlock', '<p>'); handleMenuClose(); }}>
              <ListItemIcon><Typography>P</Typography></ListItemIcon>
              <ListItemText>פסקה</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
        
        <Box
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            minHeight,
            maxHeight,
            overflowY: 'auto',
            padding: 2,
            outline: 'none',
            '&:empty:before': {
              content: `"${placeholder}"`,
              color: '#999',
              fontStyle: 'italic',
            },
            '&:focus': {
              outline: 'none',
            },
            '& p': {
              margin: '0.5em 0',
            },
            '& blockquote': {
              borderLeft: '4px solid #1976d2',
              margin: '1em 0',
              padding: '0.5em 1em',
              backgroundColor: '#f5f5f5',
            },
            '& pre': {
              backgroundColor: '#f5f5f5',
              padding: '1em',
              borderRadius: '4px',
              overflow: 'auto',
              fontFamily: 'monospace',
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              margin: '1em 0',
            },
            '& td, & th': {
              border: '1px solid #ddd',
              padding: '8px',
              textAlign: 'right',
            },
            '& th': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
          }}
        />
      </Paper>
      
      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'textSecondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}
