import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Skeleton,
  Alert
} from '@mui/material'
import {
  Search,
  FilterList,
  ShoppingCart,
  Star,
  Download,
  Verified,
  Language
} from '@mui/icons-material'
import { AppDispatch, RootState } from '@shared/store'
import { 
  fetchProducts, 
  searchProducts, 
  fetchCategories,
  addToCart,
  setFilters 
} from '../store/marketplaceSlice'
import type { Product, ProductFilters, ProductCategory } from '../types/marketplaceTypes'

const ITEMS_PER_PAGE = 12

const Marketplace: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>()
  
  const { 
    products, 
    categories, 
    cart,
    filters,
    loading, 
    error 
  } = useSelector((state: RootState) => state.marketplace)

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchProducts({ query: searchQuery, filters }))
    } else {
      dispatch(fetchProducts(filters))
    }
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    dispatch(setFilters(updatedFilters))
    dispatch(fetchProducts(updatedFilters))
    setCurrentPage(1)
  }

  const handleAddToCart = (productId: string) => {
    dispatch(addToCart({ productId, quantity: 1 }))
  }

  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return products.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(products.length / ITEMS_PER_PAGE)
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: currency === 'ILS' ? 'ILS' : currency
    }).format(price)
  }

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'he': return '🇮🇱'
      case 'en': return '🇺🇸'
      case 'ar': return '🇸🇦'
      default: return '🌐'
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          שוק תבניות
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          גלה תבניות חוזים, שירותים וקורסים מקצועיים
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="חפש תבניות, שירותים או קורסים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
              >
                חפש
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterList />}
              >
                סננים
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart />
                <Typography variant="body2">
                  עגלת קניות ({cart.length})
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          {showFilters && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>קטגוריה</InputLabel>
                    <Select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                    >
                      <MenuItem value="">כל הקטגוריות</MenuItem>
                      {categories.map((category: ProductCategory) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>סוג</InputLabel>
                    <Select
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange({ type: e.target.value as Product['type'] || undefined })}
                    >
                              <MenuItem value="">כל הסוגים</MenuItem>
        <MenuItem value="template">תבנית</MenuItem>
        <MenuItem value="service">שירות</MenuItem>
        <MenuItem value="course">קורס</MenuItem>
        <MenuItem value="consultation">ייעוץ</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>שפה</InputLabel>
                    <Select
                      value={filters.language || ''}
                      onChange={(e) => handleFilterChange({ language: e.target.value as Product['language'] || undefined })}
                    >
                      <MenuItem value="">כל השפות</MenuItem>
                      <MenuItem value="he">עברית</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="ar">العربية</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>מיין לפי</InputLabel>
                    <Select
                      value={filters.sortBy || 'newest'}
                      onChange={(e) => handleFilterChange({ sortBy: e.target.value as ProductFilters['sortBy'] })}
                    >
                              <MenuItem value="newest">חדש ביותר</MenuItem>
        <MenuItem value="popular">פופולרי</MenuItem>
        <MenuItem value="rating">דירוג גבוה</MenuItem>
        <MenuItem value="price_asc">מחיר: נמוך לגבוה</MenuItem>
        <MenuItem value="price_desc">מחיר: גבוה לנמוך</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          // Products
          getPaginatedProducts().map((product: Product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={product.images[0] || '/placeholder-image.jpg'}
                  alt={product.title}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      {getLanguageIcon(product.language)}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={product.type === 'template' ? 'תבנית' : product.type === 'service' ? 'שירות' : product.type === 'course' ? 'קורס' : 'ייעוץ'} 
                      color="primary" 
                      variant="outlined" 
                    />
                    {product.isPremium && (
                      <Chip 
                        size="small" 
                        label="פרימיום" 
                        color="warning" 
                        icon={<Star />}
                      />
                    )}
                  </Box>

                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {product.title}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...`
                      : product.description
                    }
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={product.rating} readOnly size="small" />
                    <Typography variant="caption" color="textSecondary">
                      ({product.reviewCount})
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Download fontSize="small" />
                      <Typography variant="caption">
                        {product.downloadCount}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(product.price, product.currency)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" color="textSecondary">
                        {product.sellerName}
                      </Typography>
                      {product.sellerId && <Verified fontSize="small" color="primary" />}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(product.id)}
                      startIcon={<ShoppingCart />}
                    >
                      הוסף לעגלה
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {!loading && products.length > ITEMS_PER_PAGE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={getTotalPages()}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {!loading && products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            לא נמצאו מוצרים
          </Typography>
          <Typography variant="body2" color="textSecondary">
            נסה חיפוש אחר או שנה את הסננים
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default Marketplace
