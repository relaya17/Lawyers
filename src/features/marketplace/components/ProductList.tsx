import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'
import {
  MoreVert,
  ShoppingCart,
  Visibility,
  Share,
  Favorite,
  FavoriteBorder,
  Download,
  Star,
  Language as LanguageIcon,
  Person,
  AccessTime
} from '@mui/icons-material'
import type { Product } from '../types/marketplaceTypes'

interface ProductListProps {
  products: Product[]
  loading?: boolean
  onAddToCart: (productId: string) => void
  onProductClick?: (product: Product) => void
  showActions?: boolean
  variant?: 'grid' | 'list'
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading = false,
  onAddToCart,
  onProductClick,
  showActions = true,
  variant = 'grid'
}) => {
  const { t } = useTranslation()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProduct(null)
  }

  const handlePreview = () => {
    setPreviewDialogOpen(true)
    handleMenuClose()
  }

  const handleShare = async () => {
    if (selectedProduct && navigator.share) {
      await navigator.share({
        title: selectedProduct.title,
        text: selectedProduct.description,
        url: window.location.href
      })
    }
    handleMenuClose()
  }

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (variant === 'list') {
    return (
      <Box>
        {products.map((product) => (
          <Card 
            key={product.id} 
            sx={{ mb: 2, cursor: onProductClick ? 'pointer' : 'default' }}
            onClick={() => onProductClick?.(product)}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={2}>
                  <CardMedia
                    component="img"
                    height={120}
                    image={product.images[0] || '/placeholder-image.jpg'}
                    alt={product.title}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          {getLanguageIcon(product.language)}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={t(`marketplace.${product.type}`)} 
                          color="primary" 
                          variant="outlined" 
                        />
                        {product.isPremium && (
                          <Chip 
                            size="small" 
                            label={t('marketplace.premium')} 
                            color="warning" 
                            icon={<Star />}
                          />
                        )}
                      </Box>

                      <Typography variant="h6" gutterBottom>
                        {product.title}
                      </Typography>

                      <Typography variant="body2" color="textSecondary" paragraph>
                        {product.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={product.rating} readOnly size="small" />
                          <Typography variant="caption" color="textSecondary">
                            ({product.reviewCount})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Download fontSize="small" />
                          <Typography variant="caption">
                            {product.downloadCount}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person fontSize="small" />
                          <Typography variant="caption">
                            {product.sellerName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" />
                          <Typography variant="caption">
                            {formatDate(product.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(product.price, product.currency)}
                      </Typography>
                    </Box>

                    {showActions && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(product.id)
                          }}
                          color={favorites.has(product.id) ? 'error' : 'default'}
                        >
                          {favorites.has(product.id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <IconButton onClick={(e) => handleMenuClick(e, product)}>
                          <MoreVert />
                        </IconButton>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            onAddToCart(product.id)
                          }}
                          startIcon={<ShoppingCart />}
                        >
                          {t('marketplace.addToCart')}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    )
  }

  // Grid variant (default)
  return (
    <>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: onProductClick ? 'pointer' : 'default'
              }}
              onClick={() => onProductClick?.(product)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={product.images[0] || '/placeholder-image.jpg'}
                  alt={product.title}
                />
                {showActions && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(product.id)
                      }}
                      color={favorites.has(product.id) ? 'error' : 'default'}
                    >
                      {favorites.has(product.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                      onClick={(e) => handleMenuClick(e, product)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    {getLanguageIcon(product.language)}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={t(`marketplace.${product.type}`)} 
                    color="primary" 
                    variant="outlined" 
                  />
                  {product.isPremium && (
                    <Chip 
                      size="small" 
                      label={t('marketplace.premium')} 
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
                  <Typography variant="caption" color="textSecondary">
                    {product.sellerName}
                  </Typography>
                </Box>

                {showActions && (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToCart(product.id)
                    }}
                    startIcon={<ShoppingCart />}
                  >
                    {t('marketplace.addToCart')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePreview}>
          <Visibility sx={{ mr: 1 }} />
          {t('common.preview')}
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <Share sx={{ mr: 1 }} />
          {t('common.share')}
        </MenuItem>
      </Menu>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedProduct?.title}</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedProduct.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                {t('marketplace.features')}
              </Typography>
              <List dense>
                {selectedProduct.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedProduct.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            {t('common.close')}
          </Button>
          {selectedProduct && (
            <Button 
              variant="contained" 
              onClick={() => {
                onAddToCart(selectedProduct.id)
                setPreviewDialogOpen(false)
              }}
              startIcon={<ShoppingCart />}
            >
              {t('marketplace.addToCart')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductList
