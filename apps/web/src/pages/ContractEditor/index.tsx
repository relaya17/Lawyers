// Advanced Contract Editor
// עורך חוזים מתקדם עם יכולות עריכה מתקדמות ושיתוף פעולה

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  LinearProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Save,
  Download,
  Print,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  InsertLink,
  TableChart,
  Image,
  Spellcheck,
  Translate,
  Delete,
  Add,
  Undo,
  Redo,
  FindInPage,
  ZoomIn,
  ZoomOut,
  Fullscreen,
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'

interface ContractSection {
  id: string
  title: string
  content: string
  type: 'text' | 'table' | 'image' | 'signature'
  required: boolean
  editable: boolean
  order: number
}

interface ContractTemplate {
  id: string
  name: string
  category: string
  description: string
  sections: ContractSection[]
  variables: string[]
  tags: string[]
}



interface ContractCollaborator {
  id: string
  name: string
  email: string
  role: 'viewer' | 'editor' | 'admin'
  avatar: string
  lastActive: string
}





export const ContractEditorPage: React.FC = () => {

  const { contractId } = useParams<{ contractId: string }>()
  

  const [contractTitle, setContractTitle] = useState('חוזה שכירות דירה')
  const [contractContent, setContractContent] = useState('')

  const [sections, setSections] = useState<ContractSection[]>([])
  const [collaborators, setCollaborators] = useState<ContractCollaborator[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const zoomLevel = 100
  
  const editorRef = useRef<HTMLDivElement>(null)

  // Mock data
  const mockTemplates: ContractTemplate[] = [
    {
      id: '1',
      name: 'חוזה שכירות דירה',
      category: 'נדל״ן',
      description: 'תבנית לחוזה שכירות דירה עם כל הסעיפים הנדרשים',
      sections: [
        { id: '1', title: 'פרטי הצדדים', content: '', type: 'text', required: true, editable: true, order: 1 },
        { id: '2', title: 'פרטי הנכס', content: '', type: 'text', required: true, editable: true, order: 2 },
        { id: '3', title: 'תנאי השכירות', content: '', type: 'table', required: true, editable: true, order: 3 },
        { id: '4', title: 'חתימות', content: '', type: 'signature', required: true, editable: false, order: 4 },
      ],
      variables: ['שם השוכר', 'שם המשכיר', 'כתובת הנכס', 'סכום השכירות'],
      tags: ['שכירות', 'דירה', 'נדל״ן'],
    },
    {
      id: '2',
      name: 'חוזה עבודה',
      category: 'עבודה',
      description: 'תבנית לחוזה עבודה עם כל הזכויות והחובות',
      sections: [
        { id: '1', title: 'פרטי העובד והמעביד', content: '', type: 'text', required: true, editable: true, order: 1 },
        { id: '2', title: 'תנאי העבודה', content: '', type: 'text', required: true, editable: true, order: 2 },
        { id: '3', title: 'שכר ותנאים סוציאליים', content: '', type: 'table', required: true, editable: true, order: 3 },
        { id: '4', title: 'חתימות', content: '', type: 'signature', required: true, editable: false, order: 4 },
      ],
      variables: ['שם העובד', 'שם המעביד', 'תפקיד', 'שכר'],
      tags: ['עבודה', 'תעסוקה', 'שכר'],
    },
  ]

  const mockCollaborators: ContractCollaborator[] = [
    {
      id: '1',
      name: 'עו״ד דוד לוי',
      email: 'david@lawfirm.com',
      role: 'admin',
      avatar: 'DL',
      lastActive: 'לפני 5 דקות',
    },
    {
      id: '2',
      name: 'שרה כהן',
      email: 'sarah@client.com',
      role: 'viewer',
      avatar: 'SC',
      lastActive: 'לפני שעה',
    },
  ]

  useEffect(() => {
    loadContract()
  }, [contractId])

  const loadContract = async () => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Set mock data
      setSections(mockTemplates[0].sections)
      setCollaborators(mockCollaborators)
      setContractContent(`
        <h2>חוזה שכירות דירה</h2>
        <p>בין:</p>
        <p><strong>המשכיר:</strong> [שם המשכיר]</p>
        <p><strong>השוכר:</strong> [שם השוכר]</p>
        <p>נקבע בזה:</p>
        <h3>1. פרטי הנכס</h3>
        <p>הנכס: [כתובת הנכס]</p>
        <h3>2. תנאי השכירות</h3>
        <p>סכום השכירות: [סכום השכירות] ₪ לחודש</p>
        <p>תקופת השכירות: [תקופה] חודשים</p>
      `)
    } catch (err) {
      setError('שגיאה בטעינת החוזה')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Contract saved successfully')
    } catch (err) {
      setError('שגיאה בשמירת החוזה')
    } finally {
      setLoading(false)
    }
  }



  const handleAddSection = () => {
    const newSection: ContractSection = {
      id: Date.now().toString(),
      title: 'סעיף חדש',
      content: '',
      type: 'text',
      required: false,
      editable: true,
      order: sections.length + 1,
    }
    setSections([...sections, newSection])
  }

  

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId))
  }

  const handleAddCollaborator = () => {
    // Mock add collaborator
    const newCollaborator: ContractCollaborator = {
      id: Date.now().toString(),
      name: 'משתמש חדש',
      email: 'new@user.com',
      role: 'viewer',
      avatar: 'NU',
      lastActive: 'עכשיו',
    }
    setCollaborators([...collaborators, newCollaborator])
  }



  const handleExport = (format: 'pdf' | 'docx' | 'html') => {
    console.log(`Exporting contract as ${format}`)
    // Mock export
  }

  const handlePrint = () => {
    window.print()
  }



  const handleUndo = () => {
    console.log('Undo')
  }

  const handleRedo = () => {
    console.log('Redo')
  }



  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <LinearProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper sx={{ position: 'sticky', top: 0, zIndex: 1000, mb: 2 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                variant="standard"
                sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Undo />}
                  onClick={handleUndo}
                  size="small"
                >
                  בטל
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Redo />}
                  onClick={handleRedo}
                  size="small"
                >
                  חזור
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  שמור
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExport('pdf')}
                >
                  ייצא
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={handlePrint}
                >
                  הדפס
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Toolbar */}
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Text Formatting */}
            <IconButton size="small" title="מודגש">
              <FormatBold />
            </IconButton>
            <IconButton size="small" title="נטוי">
              <FormatItalic />
            </IconButton>
                         <IconButton size="small" title="קו תחתון">
               <FormatUnderlined />
             </IconButton>
            
            <Divider orientation="vertical" flexItem />
            
            {/* Lists */}
            <IconButton size="small" title="רשימה עם נקודות">
              <FormatListBulleted />
            </IconButton>
            <IconButton size="small" title="רשימה ממוספרת">
              <FormatListNumbered />
            </IconButton>
            
            <Divider orientation="vertical" flexItem />
            
            {/* Alignment */}
            <IconButton size="small" title="יישור לשמאל">
              <FormatAlignLeft />
            </IconButton>
            <IconButton size="small" title="יישור למרכז">
              <FormatAlignCenter />
            </IconButton>
            <IconButton size="small" title="יישור לימין">
              <FormatAlignRight />
            </IconButton>
            
            <Divider orientation="vertical" flexItem />
            
            {/* Insert */}
            <IconButton size="small" title="הוסף קישור">
              <InsertLink />
            </IconButton>
                         <IconButton size="small" title="הוסף טבלה">
               <TableChart />
             </IconButton>
             <IconButton size="small" title="הוסף תמונה">
               <Image />
             </IconButton>
            
            <Divider orientation="vertical" flexItem />
            
            {/* Tools */}
            <IconButton size="small" title="בדיקת איות">
              <Spellcheck />
            </IconButton>
            <IconButton size="small" title="תרגום">
              <Translate />
            </IconButton>
            <IconButton size="small" title="מצא והחלף">
              <FindInPage />
            </IconButton>
            
            <Divider orientation="vertical" flexItem />
            
            {/* View */}
            <IconButton size="small" title="הקטן">
              <ZoomOut />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
              {zoomLevel}%
            </Typography>
            <IconButton size="small" title="הגדל">
              <ZoomIn />
            </IconButton>
            <IconButton size="small" title="מסך מלא">
              <Fullscreen />
            </IconButton>
            
            <Divider orientation="vertical" flexItem />
            

          </Box>
        </Box>
      </Paper>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Left Sidebar - Templates & Sections */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  תבניות וסעיפים
                </Typography>
                


                <List dense>
                  {sections.map((section) => (
                    <ListItem key={section.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={section.title}
                        secondary={`סוג: ${section.type}`}
                      />
                      <IconButton size="small" onClick={() => handleDeleteSection(section.id)}>
                        <Delete />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant="text"
                  startIcon={<Add />}
                  onClick={handleAddSection}
                  sx={{ mt: 1 }}
                >
                  הוסף סעיף
                </Button>
              </CardContent>
            </Card>

            {/* Collaboration Panel */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  שיתוף פעולה
                </Typography>
                
                <List dense>
                  {collaborators.map((collaborator) => (
                    <ListItem key={collaborator.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>{collaborator.avatar}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={collaborator.name}
                        secondary={`${collaborator.role} • ${collaborator.lastActive}`}
                      />
                      <Chip label={collaborator.role} size="small" />
                    </ListItem>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant="text"
                  startIcon={<Add />}
                  onClick={handleAddCollaborator}
                  sx={{ mt: 1 }}
                >
                  הוסף משתמש
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Editor */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                                 <Box
                   ref={editorRef}
                   contentEditable={true}
                   dangerouslySetInnerHTML={{ __html: contractContent }}
                  sx={{
                    minHeight: 600,
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:focus': {
                      outline: 'none',
                      borderColor: 'primary.main',
                    },
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top left',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Sidebar - Properties & History */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  מאפיינים
                </Typography>
                
                <TextField
                  fullWidth
                  label="קטגוריה"
                  value="נדל״ן"
                  margin="normal"
                  size="small"
                />
                
                <TextField
                  fullWidth
                  label="תגיות"
                  value="שכירות, דירה, נדל״ן"
                  margin="normal"
                  size="small"
                />
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>סטטוס</InputLabel>
                  <Select value="טיוטה" label="סטטוס">
                    <MenuItem value="טיוטה">טיוטה</MenuItem>
                    <MenuItem value="בבדיקה">בבדיקה</MenuItem>
                    <MenuItem value="מאושר">מאושר</MenuItem>
                    <MenuItem value="חתום">חתום</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="תאריך יעד"
                  type="date"
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </CardContent>
            </Card>

            {/* Version History */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  היסטוריית גרסאות
                </Typography>
                
                                 <List dense>
                   <ListItem sx={{ px: 0 }}>
                     <ListItemText
                       primary="גרסה 1.0"
                       secondary="מערכת • לפני שעה"
                     />
                   </ListItem>
                 </List>


              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>


    </Box>
  )
}

export default ContractEditorPage
