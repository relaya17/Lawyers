import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Badge,
  Avatar
} from '@mui/material'
import {
  Lightbulb,
  TrendingUp,
  Psychology,
  School,
  Work,
  Code,
  Description,
  Search,
  Add,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  Share,
  ContentCopy,
  Refresh,
  AutoFixHigh,
  SmartToy,
  EmojiEmotions,
  Gavel,
  Assessment,
  Business,
  Science,
  Palette,
  Sports,
  MusicNote,
  Movie,
  Restaurant,
  Flight,
  Hotel,
  ShoppingCart,
  LocalHospital,
  School as Education,
  Work as Career,
  Home,
  Pets,
  Nature,
  Computer,
  AccountBalance,
  LocalHospital as HealthIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Suggestion {
  id: string
  text: string
  category: string
  tags: string[]
  usage: number
  isFavorite: boolean
  isPopular: boolean
  type: 'prompt' | 'template' | 'example'
  description?: string
  examples?: string[]
}

interface SuggestionPanelProps {
  suggestions: Suggestion[]
  onSelectSuggestion: (suggestion: Suggestion) => void
  onFavorite: (suggestionId: string) => void
  onShare: (suggestionId: string) => void
  onCopy: (suggestionId: string) => void
  onRefresh: () => void
  onSearch: (query: string) => void
  onAddCustom: (text: string, category: string) => void
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
  suggestions,
  onSelectSuggestion,
  onFavorite,
  onShare,
  onCopy,
  onRefresh,
  onSearch,
  onAddCustom
}) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [customSuggestion, setCustomSuggestion] = useState('')
  const [customCategory, setCustomCategory] = useState('general')

  const categories = [
    { key: 'all', label: 'כל הקטגוריות', icon: <Lightbulb /> },
    { key: 'legal', label: 'משפטי', icon: <Gavel /> },
    { key: 'business', label: 'עסקי', icon: <Business /> },
    { key: 'education', label: 'חינוכי', icon: <Education /> },
    { key: 'technology', label: 'טכנולוגיה', icon: <Computer /> },
    { key: 'health', label: 'בריאות', icon: <HealthIcon /> },
    { key: 'finance', label: 'פיננסי', icon: <AccountBalance /> },
    { key: 'creative', label: 'יצירתי', icon: <Palette /> },
    { key: 'analysis', label: 'ניתוח', icon: <Assessment /> },
    { key: 'writing', label: 'כתיבה', icon: <Description /> },
    { key: 'coding', label: 'תכנות', icon: <Code /> },
    { key: 'personal', label: 'אישי', icon: <EmojiEmotions /> }
  ]

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         suggestion.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         suggestion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory
    const matchesFavorites = !showFavorites || suggestion.isFavorite
    
    return matchesSearch && matchesCategory && matchesFavorites
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleAddCustom = () => {
    if (customSuggestion.trim()) {
      onAddCustom(customSuggestion.trim(), customCategory)
      setCustomSuggestion('')
      setCustomCategory('general')
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.key === category)
    return categoryData?.icon || <Lightbulb />
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      legal: 'error',
      business: 'primary',
      education: 'info',
      technology: 'secondary',
      health: 'success',
      finance: 'warning',
      creative: 'error',
      analysis: 'info',
      writing: 'primary',
      coding: 'secondary',
      personal: 'success'
    }
    return colors[category] || 'default'
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lightbulb sx={{ color: 'primary.main' }} />
            <Typography variant="h6">
              {t('ai.suggestions.title')}
            </Typography>
            <Badge badgeContent={suggestions.filter(s => s.isFavorite).length} color="primary">
              <Favorite />
            </Badge>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={t('ai.refreshSuggestions')}>
              <IconButton size="small" onClick={onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              size="small"
              variant={showFavorites ? 'contained' : 'outlined'}
              startIcon={<Favorite />}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {t('ai.favorites')}
            </Button>
          </Box>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder={t('ai.searchSuggestions')}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Categories */}
      <Paper elevation={1} sx={{ p: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {categories.map(category => (
            <Chip
              key={category.key}
              icon={category.icon}
              label={category.label}
              color={selectedCategory === category.key ? 'primary' : 'default'}
              variant={selectedCategory === category.key ? 'filled' : 'outlined'}
              onClick={() => setSelectedCategory(category.key)}
              clickable
              size="small"
            />
          ))}
        </Box>
      </Paper>

      {/* Custom Suggestion */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('ai.addCustomSuggestion')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('ai.customSuggestionPlaceholder')}
            value={customSuggestion}
            onChange={(e) => setCustomSuggestion(e.target.value)}
          />
          <Button
            size="small"
            variant="contained"
            onClick={handleAddCustom}
            disabled={!customSuggestion.trim()}
            startIcon={<Add />}
          >
            {t('common.add')}
          </Button>
        </Box>
      </Paper>

      {/* Suggestions List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {filteredSuggestions.map((suggestion, index) => (
            <React.Fragment key={suggestion.id}>
              <ListItem sx={{ p: 0 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: `${getCategoryColor(suggestion.category)}.main`, width: 32, height: 32 }}>
                      {getCategoryIcon(suggestion.category)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {suggestion.text}
                        </Typography>
                        {suggestion.isPopular && (
                          <Chip
                            icon={<TrendingUp />}
                            label={t('ai.popular')}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        {suggestion.type === 'template' && (
                          <Chip
                            icon={<Description />}
                            label={t('ai.template')}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        {suggestion.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {suggestion.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          {suggestion.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={suggestion.isFavorite ? t('ai.removeFromFavorites') : t('ai.addToFavorites')}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onFavorite(suggestion.id)
                        }}
                        color={suggestion.isFavorite ? 'primary' : 'default'}
                      >
                        {suggestion.isFavorite ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.copy')}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onCopy(suggestion.id)
                        }}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.share')}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onShare(suggestion.id)
                        }}
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItemButton>
              </ListItem>
              {index < filteredSuggestions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {filteredSuggestions.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Lightbulb sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('ai.noSuggestions')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('ai.noSuggestionsDescription')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Quick Actions */}
      <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('ai.quickActions')}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<AutoFixHigh />}
              onClick={() => onSelectSuggestion({
                id: 'quick-improve',
                text: t('ai.quickActions.improve'),
                category: 'writing',
                tags: ['writing', 'improvement'],
                usage: 0,
                isFavorite: false,
                isPopular: false,
                type: 'prompt'
              })}
            >
              {t('ai.quickActions.improve')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<Psychology />}
              onClick={() => onSelectSuggestion({
                id: 'quick-explain',
                text: t('ai.quickActions.explain'),
                category: 'education',
                tags: ['explanation', 'learning'],
                usage: 0,
                isFavorite: false,
                isPopular: false,
                type: 'prompt'
              })}
            >
              {t('ai.quickActions.explain')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => onSelectSuggestion({
                id: 'quick-analyze',
                text: t('ai.quickActions.analyze'),
                category: 'analysis',
                tags: ['analysis', 'review'],
                usage: 0,
                isFavorite: false,
                isPopular: false,
                type: 'prompt'
              })}
            >
              {t('ai.quickActions.analyze')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<Code />}
              onClick={() => onSelectSuggestion({
                id: 'quick-code',
                text: t('ai.quickActions.code'),
                category: 'coding',
                tags: ['code', 'programming'],
                usage: 0,
                isFavorite: false,
                isPopular: false,
                type: 'prompt'
              })}
            >
              {t('ai.quickActions.code')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default SuggestionPanel
