import React, { useState, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertTitle, 
  Box, 
  Typography, 
  IconButton, 
  Badge,
  Menu,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import { 
  Notifications, 
  NotificationsActive, 
  Close,
  CheckCircle,
  Warning,
  Info,
  Error
} from '@mui/icons-material';
import { notificationService } from '@shared/services/notifications';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'system' | 'contract' | 'reminder';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const RealtimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  // קבלת התראות מ-IPIN
  useEffect(() => {
    // הרשמה לאירועי התראות

    // הרשמה לאירועי התראות
    notificationService.on('notification_created', () => {
      // Refresh notifications when new one is created
      const existingNotifications = notificationService.getNotifications({ read: false });
      const mappedNotifications: Notification[] = existingNotifications.slice(0, 10).map(n => ({
        id: n.id,
        type: n.type === 'security' ? 'error' : n.type,
        title: n.title,
        message: n.message,
        timestamp: n.timestamp.getTime(),
        read: n.read,
        action: n.actionUrl ? {
          label: n.actionText || 'צפה',
          onClick: () => window.open(n.actionUrl, '_blank')
        } : undefined
      }));
      setNotifications(mappedNotifications);
    });
    
    notificationService.on('show_notification', () => {
      // Refresh notifications when one is shown
      const existingNotifications = notificationService.getNotifications({ read: false });
      const mappedNotifications: Notification[] = existingNotifications.slice(0, 10).map(n => ({
        id: n.id,
        type: n.type === 'security' ? 'error' : n.type,
        title: n.title,
        message: n.message,
        timestamp: n.timestamp.getTime(),
        read: n.read,
        action: n.actionUrl ? {
          label: n.actionText || 'צפה',
          onClick: () => window.open(n.actionUrl, '_blank')
        } : undefined
      }));
      setNotifications(mappedNotifications);
    });

    // טעינת התראות קיימות
    const existingNotifications = notificationService.getNotifications({ read: false });
    const mappedNotifications: Notification[] = existingNotifications.slice(0, 10).map(n => ({
      id: n.id,
      type: n.type === 'security' ? 'error' : n.type,
      title: n.title,
      message: n.message,
      timestamp: n.timestamp.getTime(),
      read: n.read,
      action: n.actionUrl ? {
        label: n.actionText || 'צפה',
        onClick: () => window.open(n.actionUrl, '_blank')
      } : undefined
    }));

    setNotifications(mappedNotifications);

    return () => {
      notificationService.off('notification_created', () => {});
      notificationService.off('show_notification', () => {});
    };
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setOpen(false);
    setCurrentNotification(null);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
    handleMenuClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': {
        return <CheckCircle color="success" />;
      }
      case 'warning': {
        return <Warning color="warning" />;
      }
      case 'error': {
        return <Error color="error" />;
      }
      default: {
        return <Info color="info" />;
      }
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': {
        return 'success';
      }
      case 'warning': {
        return 'warning';
      }
      case 'error': {
        return 'error';
      }
      default: {
        return 'info';
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* כפתור התראות */}
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsActive />
        </Badge>
      </IconButton>

      {/* תפריט התראות */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">התראות</Typography>
            <Box>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead} sx={{ mr: 1 }}>
                  סמן כנקרא
                </Button>
              )}
              <Button size="small" onClick={clearAll} color="error">
                נקה הכל
              </Button>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            מחובר • {notifications.length} התראות
          </Typography>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              אין התראות חדשות
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  sx={{ 
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected'
                    }
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleString('he-IL')}
                        </Typography>
                        {notification.action && (
                          <Button
                            size="small"
                            variant="text"
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action?.onClick();
                            }}
                            sx={{ mt: 0.5 }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>

      {/* התראה צפה */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {currentNotification ? (
          <Alert
            onClose={handleNotificationClose}
            severity={getNotificationColor(currentNotification.type) as 'success' | 'warning' | 'error' | 'info'}
            sx={{ width: '100%' }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={handleNotificationClose}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>{currentNotification.title}</AlertTitle>
            {currentNotification.message}
            {currentNotification.action && (
              <Button
                size="small"
                variant="text"
                onClick={() => {
                  currentNotification.action?.onClick();
                  handleNotificationClose();
                }}
                sx={{ mt: 1 }}
              >
                {currentNotification.action.label}
              </Button>
            )}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
};

export default RealtimeNotifications;
