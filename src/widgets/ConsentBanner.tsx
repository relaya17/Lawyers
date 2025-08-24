import React from 'react'
import { Alert, Button, Stack, Link } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@shared/store'
import { setConsentBannerShown } from '@shared/store/slices/uiSlice'
import { useTranslation } from 'react-i18next'
import { Cookie, PrivacyTip } from '@mui/icons-material'

export const ConsentBanner: React.FC = () => {
	const dispatch = useDispatch()
	// const { t } = useTranslation()
	const shown = useSelector((s: RootState) => s.ui.consentBannerShown)
	
	if (shown) return null
	
	return (
		<Alert 
			severity="info" 
			icon={<Cookie />}
			sx={{ 
				position: 'fixed', 
				bottom: 16, 
				left: 16, 
				right: 16, 
				zIndex: 1300,
				maxWidth: 'none',
				'& .MuiAlert-message': {
					flex: 1
				}
			}}
			action={
				<Stack direction="row" spacing={1} alignItems="center">
					<Button 
						color="inherit" 
						size="small" 
						onClick={() => dispatch(setConsentBannerShown(true))}
						variant="outlined"
						sx={{ borderColor: 'currentColor' }}
					>
						אני מסכים
					</Button>
					<Button 
						color="inherit" 
						size="small"
						startIcon={<PrivacyTip />}
						component={Link}
						href="/privacy"
						sx={{ textDecoration: 'none' }}
					>
						למידע נוסף
					</Button>
				</Stack>
			}
		>
			אנו משתמשים בעוגיות (cookies) כדי לשפר את חוויית השימוש שלך ב-ContractLab Pro. 
			המשך השימוש באתר מהווה הסכמה לשימוש בעוגיות.
		</Alert>
	)
}
