import { useState, useEffect, useCallback } from 'react'
import { siriService } from '../services/siriService'
import {
    SiriShortcut,
    SiriConfiguration,
    SiriVoiceSettings,
    SiriAccessibilitySettings,
    SiriUsageAnalytics,
    SiriSuggestion,
    SiriResponse,
    SiriCategory
} from '../types/siriTypes'

export const useSiriConfiguration = () => {
    const [configuration, setConfiguration] = useState<SiriConfiguration>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const config = siriService.getConfiguration()
        setConfiguration(config)
    }, [])

    const updateVoiceSettings = useCallback(async (settings: Partial<SiriVoiceSettings>) => {
        setIsLoading(true)
        try {
            await siriService.updateVoiceSettings(settings)
            const updatedConfig = siriService.getConfiguration()
            setConfiguration(updatedConfig)
            return true
        } catch (error) {
            console.error('Failed to update voice settings:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateAccessibilitySettings = useCallback(async (settings: Partial<SiriAccessibilitySettings>) => {
        setIsLoading(true)
        try {
            await siriService.updateAccessibilitySettings(settings)
            const updatedConfig = siriService.getConfiguration()
            setConfiguration(updatedConfig)
            return true
        } catch (error) {
            console.error('Failed to update accessibility settings:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        configuration,
        isLoading,
        updateVoiceSettings,
        updateAccessibilitySettings,
        isEnabled: siriService.isEnabled()
    }
}

export const useSiriShortcuts = () => {
    const [shortcuts, setShortcuts] = useState<SiriShortcut[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadShortcuts()
    }, [])

    const loadShortcuts = useCallback(() => {
        const allShortcuts = siriService.getShortcuts()
        setShortcuts(allShortcuts)
    }, [])

    const createShortcut = useCallback(async (shortcut: Omit<SiriShortcut, 'id' | 'usageCount' | 'lastUsed' | 'createdAt'>) => {
        setIsLoading(true)
        try {
            const newShortcut = await siriService.createShortcut(shortcut)
            loadShortcuts()
            return newShortcut
        } catch (error) {
            console.error('Failed to create shortcut:', error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [loadShortcuts])

    const updateShortcut = useCallback(async (id: string, updates: Partial<SiriShortcut>) => {
        setIsLoading(true)
        try {
            const updatedShortcut = await siriService.updateShortcut(id, updates)
            loadShortcuts()
            return updatedShortcut
        } catch (error) {
            console.error('Failed to update shortcut:', error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [loadShortcuts])

    const deleteShortcut = useCallback(async (id: string) => {
        setIsLoading(true)
        try {
            await siriService.deleteShortcut(id)
            loadShortcuts()
            return true
        } catch (error) {
            console.error('Failed to delete shortcut:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [loadShortcuts])

    const getShortcutsByCategory = useCallback((category: SiriCategory) => {
        return siriService.getShortcutsByCategory(category)
    }, [])

    return {
        shortcuts,
        isLoading,
        createShortcut,
        updateShortcut,
        deleteShortcut,
        getShortcutsByCategory,
        refresh: loadShortcuts
    }
}

export const useSiriVoiceInteraction = () => {
    const [isListening, setIsListening] = useState(false)
    const [lastResponse, setLastResponse] = useState<SiriResponse | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Update listening state when service state changes
        const updateListeningState = () => {
            setIsListening(siriService.isCurrentlyListening())
        }

        // Poll for state changes (in real app, this would be event-driven)
        const interval = setInterval(updateListeningState, 500)

        return () => clearInterval(interval)
    }, [])

    const startListening = useCallback(async () => {
        try {
            setError(null)
            await siriService.startListening()
            setIsListening(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to start listening')
            setIsListening(false)
        }
    }, [])

    const stopListening = useCallback(() => {
        siriService.stopListening()
        setIsListening(false)
    }, [])

    const processTextInput = useCallback(async (text: string) => {
        setIsProcessing(true)
        setError(null)

        try {
            const response = await siriService.processIntent(text)
            setLastResponse(response)

            // Speak the response if voice is enabled
            await siriService.speakResponse(response.text)

            return response
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process input'
            setError(errorMessage)
            return null
        } finally {
            setIsProcessing(false)
        }
    }, [])

    const speakText = useCallback(async (text: string) => {
        try {
            await siriService.speakResponse(text)
        } catch (error) {
            console.error('Failed to speak text:', error)
        }
    }, [])

    return {
        isListening,
        isProcessing,
        lastResponse,
        error,
        startListening,
        stopListening,
        processTextInput,
        speakText,
        isEnabled: siriService.isEnabled()
    }
}

export const useSiriAnalytics = () => {
    const [analytics, setAnalytics] = useState<SiriUsageAnalytics>()

    useEffect(() => {
        const currentAnalytics = siriService.getAnalytics()
        setAnalytics(currentAnalytics)
    }, [])

    const refreshAnalytics = useCallback(() => {
        const currentAnalytics = siriService.getAnalytics()
        setAnalytics(currentAnalytics)
    }, [])

    return {
        analytics,
        refresh: refreshAnalytics
    }
}

export const useSiriSuggestions = () => {
    const [suggestions, setSuggestions] = useState<SiriSuggestion[]>([])

    useEffect(() => {
        const currentSuggestions = siriService.getSuggestions()
        setSuggestions(currentSuggestions)
    }, [])

    const refreshSuggestions = useCallback(() => {
        const currentSuggestions = siriService.getSuggestions()
        setSuggestions(currentSuggestions)
    }, [])

    return {
        suggestions,
        refresh: refreshSuggestions
    }
}

export const useSiri = () => {
    const configuration = useSiriConfiguration()
    const shortcuts = useSiriShortcuts()
    const voiceInteraction = useSiriVoiceInteraction()
    const analytics = useSiriAnalytics()
    const suggestions = useSiriSuggestions()

    return {
        configuration,
        shortcuts,
        voiceInteraction,
        analytics,
        suggestions,
        isSupported: siriService.isEnabled()
    }
}
