import React from 'react'
import { Box, Container, Typography, Grid, Card, CardContent, Switch, FormControlLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@shared/store'
import { setMode } from '@shared/store/slices/themeSlice'

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.theme)

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('settings.title')}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  הגדרות תצוגה
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={(e) => dispatch(setMode(e.target.checked ? 'dark' : 'light'))}
                    />
                  }
                  label="מצב כהה"
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  החלף בין ערכת נושא בהירה לכהה
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  הגדרות התראות
                </Typography>
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="התראות דוא״ל"
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="התראות דחופות"
                />
                
                <FormControlLabel
                  control={<Switch />}
                  label="דוחות שבועיים"
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  הגדרות פרטיות
                </Typography>
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="אנליטיקה אנונימית"
                />
                
                <FormControlLabel
                  control={<Switch />}
                  label="שיתוף נתונים לשיפור השירות"
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  אנו מכבדים את פרטיותך. הנתונים נאספים באופן אנונימי ומשמשים לשיפור השירות בלבד.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
