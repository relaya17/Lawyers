import React from 'react'
import { MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@shared/store'
import { setLanguage } from '@shared/store/slices/themeSlice'
import { setLanguage as setI18nLanguage } from '@/app/i18n'
import { Language } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export const LanguageSwitcher: React.FC = () => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const language = useSelector((s: RootState) => s.theme.language)
	
	const languages = [
		{ code: 'he', name: 'עברית', flag: '🇮🇱' },
		{ code: 'en', name: 'English', flag: '🇺🇸' },
		{ code: 'ar', name: 'العربية', flag: '🇸🇦' }
	]
	
	return (
		<FormControl size="small" sx={{ minWidth: 120 }}>
			<InputLabel id="language-select-label">
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<Language fontSize="small" />
					{t('settings.language')}
				</Box>
			</InputLabel>
			<Select
				labelId="language-select-label"
				value={language}
				label={
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<Language fontSize="small" />
						{t('settings.language')}
					</Box>
				}
				onChange={async (e) => {
					const lng = e.target.value as 'he'|'en'|'ar'
					dispatch(setLanguage(lng))
					await setI18nLanguage(lng)
				}}
				sx={{
					'& .MuiSelect-select': {
						display: 'flex',
						alignItems: 'center',
						gap: 1
					}
				}}
			>
				{languages.map((lang) => (
					<MenuItem key={lang.code} value={lang.code}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Typography variant="body2">{lang.flag}</Typography>
							<Typography variant="body2">{lang.name}</Typography>
						</Box>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}
