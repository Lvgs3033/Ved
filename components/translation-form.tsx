"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  translateText,
  getAISuggestions,
  saveTranslation,
  getTranslationHistory,
  deleteTranslation,
  getSavedWords,
  saveWord,
  deleteSavedWord,
} from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowRightLeft,
  Loader2,
  AlertCircle,
  Volume2,
  Copy,
  Check,
  Save,
  History,
  X,
  Keyboard,
  Mic,
  FileText,
  Star,
  Trash2,
  Download,
  ImageIcon,
  BookOpen,
  Plus,
  Lightbulb,
} from "lucide-react"

const languages = [
  // Major World Languages
  { code: "en", name: "English" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },

  // Indian Languages
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "as", name: "Assamese (অসমীয়া)" },
  { code: "ne", name: "Nepali (नेपाली)" },
  { code: "si", name: "Sinhala (සිංහල)" },

  // European Languages
  { code: "it", name: "Italian (Italiano)" },
  { code: "nl", name: "Dutch (Nederlands)" },
  { code: "pl", name: "Polish (Polski)" },
  { code: "tr", name: "Turkish (Türkçe)" },
  { code: "sv", name: "Swedish (Svenska)" },
  { code: "da", name: "Danish (Dansk)" },
  { code: "no", name: "Norwegian (Norsk)" },
  { code: "fi", name: "Finnish (Suomi)" },
  { code: "el", name: "Greek (Ελληνικά)" },
  { code: "hu", name: "Hungarian (Magyar)" },
  { code: "cs", name: "Czech (Čeština)" },
  { code: "sk", name: "Slovak (Slovenčina)" },
  { code: "ro", name: "Romanian (Română)" },
  { code: "bg", name: "Bulgarian (Български)" },
  { code: "hr", name: "Croatian (Hrvatski)" },
  { code: "sl", name: "Slovenian (Slovenščina)" },
  { code: "et", name: "Estonian (Eesti)" },
  { code: "lv", name: "Latvian (Latviešu)" },
  { code: "lt", name: "Lithuanian (Lietuvių)" },
  { code: "mk", name: "Macedonian (Македонски)" },
  { code: "sq", name: "Albanian (Shqip)" },
  { code: "be", name: "Belarusian (Беларуская)" },
  { code: "uk", name: "Ukrainian (Українська)" },
  { code: "ga", name: "Irish (Gaeilge)" },
  { code: "cy", name: "Welsh (Cymraeg)" },
  { code: "is", name: "Icelandic (Íslenska)" },
  { code: "mt", name: "Maltese (Malti)" },
  { code: "eu", name: "Basque (Euskera)" },
  { code: "ca", name: "Catalan (Català)" },
  { code: "gl", name: "Galician (Galego)" },

  // Asian Languages
  { code: "ko", name: "Korean (한국어)" },
  { code: "th", name: "Thai (ไทย)" },
  { code: "vi", name: "Vietnamese (Tiếng Việt)" },
  { code: "id", name: "Indonesian (Bahasa Indonesia)" },
  { code: "ms", name: "Malay (Bahasa Melayu)" },
  { code: "tl", name: "Filipino (Tagalog)" },
  { code: "my", name: "Myanmar (မြန်မာ)" },
  { code: "ka", name: "Georgian (ქართული)" },
  { code: "az", name: "Azerbaijani (Azərbaycan)" },
  { code: "uz", name: "Uzbek (O'zbek)" },
  { code: "mn", name: "Mongolian (Монгол)" },
  { code: "ug", name: "Uyghur (ئۇيغۇرچە)" },

  // Middle Eastern & African Languages
  { code: "he", name: "Hebrew (עברית)" },
  { code: "fa", name: "Persian (فارسی)" },
  { code: "ps", name: "Pashto (پښتو)" },
  { code: "sd", name: "Sindhi (سنڌي)" },
  { code: "sw", name: "Swahili (Kiswahili)" },
  { code: "am", name: "Amharic (አማርኛ)" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "ha", name: "Hausa" },
  { code: "zu", name: "Zulu" },
  { code: "af", name: "Afrikaans" },
  { code: "xh", name: "Xhosa" },
  { code: "sn", name: "Shona" },
  { code: "ny", name: "Chichewa" },
  { code: "st", name: "Sesotho" },
  { code: "mg", name: "Malagasy" },

  // Pacific & Other Languages
  { code: "sm", name: "Samoan" },
  { code: "haw", name: "Hawaiian" },
  { code: "mi", name: "Māori" },
  { code: "gd", name: "Scottish Gaelic" },
  { code: "fy", name: "Frisian" },
  { code: "co", name: "Corsican" },
  { code: "lb", name: "Luxembourgish" },

  // Constructed & Regional Languages
  { code: "eo", name: "Esperanto" },
  { code: "la", name: "Latin" },
  { code: "yi", name: "Yiddish (ייִדיש)" },
  { code: "jw", name: "Javanese" },
  { code: "su", name: "Sundanese" },
  { code: "ceb", name: "Cebuano" },
]

interface TranslationHistory {
  id: string
  sourceText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  timestamp: string
  isFavorite?: boolean
}

interface SavedWord {
  id: string
  word: string
  translation: string
  sourceLang: string
  targetLang: string
  timestamp: string
}

const MAX_CHARACTERS = 5000

export default function TranslationForm() {
  const [sourceText, setSourceText] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("hi")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState({ source: false, target: false })
  const [copied, setCopied] = useState({ source: false, target: false })
  const [saveMessage, setSaveMessage] = useState("")
  const [history, setHistory] = useState<TranslationHistory[]>([])
  const [savedWords, setSavedWords] = useState<SavedWord[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isSavedWordsOpen, setIsSavedWordsOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showInputTools, setShowInputTools] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 })
  const [selectedWordForSave, setSelectedWordForSave] = useState<{ word: string; translation: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Load data from localStorage on component mount
    const initializeData = async () => {
      setIsLoading(true)
      try {
        await loadHistory()
        await loadSavedWords()
      } catch (error) {
        console.error("Failed to initialize data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  // Auto-translate and speak as user types (debounced)
  const debouncedAutoTranslate = useCallback(
    debounce((text: string, sourceLang: string, targetLang: string) => {
      if (text.trim().length > 0 && sourceLang !== targetLang) {
        handleAutoTranslate(text, sourceLang, targetLang)
      } else {
        setTranslatedText("")
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 800),
    [],
  )

  // Get suggestions for current word being typed
  const debouncedWordSuggestions = useCallback(
    debounce((text: string, sourceLang: string, targetLang: string, cursorPosition: number) => {
      if (text.trim().length > 0 && sourceLang !== targetLang) {
        handleWordSuggestions(text, sourceLang, targetLang, cursorPosition)
      }
    }, 500),
    [],
  )

  useEffect(() => {
    if (sourceText.trim()) {
      debouncedAutoTranslate(sourceText, sourceLang, targetLang)
    } else {
      setTranslatedText("")
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [sourceText, sourceLang, targetLang, debouncedAutoTranslate])

  const loadHistory = async () => {
    try {
      const historyData = await getTranslationHistory()
      setHistory(historyData)
    } catch (err) {
      console.error("Failed to load history:", err)
    }
  }

  const loadSavedWords = async () => {
    try {
      const wordsData = await getSavedWords()
      setSavedWords(wordsData)
    } catch (err) {
      console.error("Failed to load saved words:", err)
    }
  }

  const handleWordSuggestions = async (
    text: string,
    sourceLang: string,
    targetLang: string,
    cursorPosition: number,
  ) => {
    // Get the current word being typed
    const words = text.split(/\s+/)
    const currentWordIndex = getCurrentWordIndex(text, cursorPosition)
    const currentWord = words[currentWordIndex]

    if (currentWord && currentWord.length > 2) {
      setIsLoadingSuggestions(true)
      try {
        const wordSuggestions = await getAISuggestions(currentWord, targetLang)
        setSuggestions(wordSuggestions)

        // Calculate position for suggestions popup
        if (textareaRef.current) {
          const textarea = textareaRef.current
          const rect = textarea.getBoundingClientRect()
          const textBeforeCursor = text.substring(0, cursorPosition)
          const lines = textBeforeCursor.split("\n")
          const currentLine = lines.length - 1
          const currentColumn = lines[currentLine].length

          setSuggestionPosition({
            top: rect.top + currentLine * 20 + 30,
            left: rect.left + currentColumn * 8 + 10,
          })
        }

        setShowSuggestions(wordSuggestions.length > 0)
      } catch (err) {
        console.error("Failed to load word suggestions:", err)
      } finally {
        setIsLoadingSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const getCurrentWordIndex = (text: string, cursorPosition: number): number => {
    const textBeforeCursor = text.substring(0, cursorPosition)
    const words = textBeforeCursor.split(/\s+/)
    return Math.max(0, words.length - 1)
  }

  const handleAutoTranslate = async (text: string, sourceLang: string, targetLang: string) => {
    setIsTranslating(true)
    setError("")

    try {
      const result = await translateText(text, sourceLang, targetLang)
      setTranslatedText(result)
      // Remove auto-speech - words should only speak when user clicks speaker
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Translation failed. Please try again later."
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    if (sourceLang === targetLang) {
      setError("Please select two different languages")
      return
    }

    setIsTranslating(true)
    setError("")

    try {
      const result = await translateText(sourceText, sourceLang, targetLang)
      setTranslatedText(result)
      // Remove auto-speech - words should only speak when user clicks speaker
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Translation failed. Please try again later."
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSave = async () => {
    if (!sourceText.trim() || !translatedText.trim()) return

    try {
      await saveTranslation({
        sourceText,
        translatedText,
        sourceLang,
        targetLang,
      })

      // Save the complete sentence/phrase to saved words instead of individual words
      await saveWord({
        word: sourceText.trim(),
        translation: translatedText.trim(),
        sourceLang,
        targetLang,
      })

      setSaveMessage("Translation saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
      await loadHistory()
      await loadSavedWords() // Refresh saved words to show new entries
    } catch (err) {
      setSaveMessage("Failed to save translation")
      setTimeout(() => setSaveMessage(""), 3000)
      console.error("Failed to save translation:", err)
    }
  }

  const handleSaveWord = async (word: string, translation: string) => {
    try {
      await saveWord({
        word,
        translation,
        sourceLang,
        targetLang,
      })
      setSaveMessage("Word saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
      await loadSavedWords() // Make sure to await the reload
      setSelectedWordForSave(null)
    } catch (err) {
      setSaveMessage("Failed to save word")
      setTimeout(() => setSaveMessage(""), 3000)
      console.error("Failed to save word:", err)
    }
  }

  const handleDeleteSavedWord = async (id: string) => {
    try {
      await deleteSavedWord(id)
      await loadSavedWords()
    } catch (err) {
      console.error("Failed to delete saved word:", err)
    }
  }

  const handleDeleteTranslation = async (id: string) => {
    try {
      await deleteTranslation(id)
      await loadHistory()
    } catch (err) {
      console.error("Failed to delete translation:", err)
    }
  }

  const handleToggleFavorite = async (id: string) => {
    try {
      const translation = history.find((h) => h.id === id)
      if (translation) {
        await saveTranslation({
          ...translation,
          isFavorite: !translation.isFavorite,
        })
        await loadHistory()
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err)
    }
  }

  const loadFromHistory = (item: TranslationHistory) => {
    setSourceText(item.sourceText)
    setTranslatedText(item.translatedText)
    setSourceLang(item.sourceLang)
    setTargetLang(item.targetLang)
    setIsHistoryOpen(false)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const insertSavedWord = (word: SavedWord) => {
    setSourceText(word.word)
    setTranslatedText(word.translation)
    setIsSavedWordsOpen(false)
  }

  const clearAll = () => {
    setSourceText("")
    setTranslatedText("")
    setSuggestions([])
    setShowSuggestions(false)
    setError("")
  }

  const applySuggestion = (suggestion: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const cursorPosition = textarea.selectionStart
      const text = sourceText
      const words = text.split(/\s+/)
      const currentWordIndex = getCurrentWordIndex(text, cursorPosition)
      const originalWord = words[currentWordIndex] // Get the original word being replaced

      // Replace current word with suggestion
      words[currentWordIndex] = suggestion
      const newText = words.join(" ")

      setSourceText(newText)
      // Set the original word and its translation (suggestion) for saving
      setSelectedWordForSave({ word: originalWord, translation: suggestion })
    }
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const cursorPosition = e.target.selectionStart

    if (text.length <= MAX_CHARACTERS) {
      setSourceText(text)
      setError("")

      // Trigger word suggestions for current word
      debouncedWordSuggestions(text, sourceLang, targetLang, cursorPosition)
    }
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = getVoiceLanguage(sourceLang)

      setIsRecording(true)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSourceText((prev) => prev + (prev ? " " : "") + transcript)
        setIsRecording(false)
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
    } else {
      alert("Speech recognition is not supported in your browser")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const text = await file.text()
      if (text.length > MAX_CHARACTERS) {
        setError(`File content exceeds ${MAX_CHARACTERS} character limit`)
        setTimeout(() => setError(""), 5000)
      } else {
        setSourceText(text)
        setError("")
      }
    } catch (err) {
      setError("Failed to read file")
      setTimeout(() => setError(""), 5000)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Simulate OCR processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted text - in real implementation, you'd use OCR service like Tesseract.js
      const mockExtractedText = "Hello, this is sample text extracted from the image using OCR technology."

      if (mockExtractedText.length > MAX_CHARACTERS) {
        setError(`Extracted text exceeds ${MAX_CHARACTERS} character limit`)
        setTimeout(() => setError(""), 5000)
      } else {
        setSourceText(mockExtractedText)
        setError("")
        setSaveMessage("Text extracted from image successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch (err) {
      setError("Failed to extract text from image")
      setTimeout(() => setError(""), 5000)
    } finally {
      setIsUploading(false)
      if (imageInputRef.current) {
        imageInputRef.current.value = ""
      }
    }
  }

  const exportHistory = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Source Language,Target Language,Source Text,Translation,Date,Favorite\n" +
      history
        .map(
          (item) =>
            `"${getLanguageName(item.sourceLang)}","${getLanguageName(item.targetLang)}","${item.sourceText.replace(/"/g, '""')}","${item.translatedText.replace(/"/g, '""')}","${new Date(item.timestamp).toLocaleString()}","${item.isFavorite ? "Yes" : "No"}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "ved_translation_history.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const speakText = (text: string, language: string, type: "source" | "target", showIndicator = true) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()

      if (showIndicator) {
        setIsSpeaking((prev) => ({ ...prev, [type]: true }))
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = getVoiceLanguage(language)
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onend = () => {
        if (showIndicator) {
          setIsSpeaking((prev) => ({ ...prev, [type]: false }))
        }
      }

      utterance.onerror = () => {
        if (showIndicator) {
          setIsSpeaking((prev) => ({ ...prev, [type]: false }))
        }
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const getVoiceLanguage = (langCode: string): string => {
    const voiceMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      bn: "bn-IN",
      ta: "ta-IN",
      te: "te-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      kn: "kn-IN",
      ml: "ml-IN",
      pa: "pa-IN",
      ur: "ur-PK",
      or: "or-IN",
      as: "as-IN",
      ne: "ne-NP",
      si: "si-LK",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-PT",
      ru: "ru-RU",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      ar: "ar-SA",
      th: "th-TH",
      vi: "vi-VN",
      tr: "tr-TR",
      pl: "pl-PL",
      nl: "nl-NL",
      sv: "sv-SE",
      da: "da-DK",
      no: "no-NO",
      fi: "fi-FI",
      el: "el-GR",
      he: "he-IL",
      fa: "fa-IR",
      id: "id-ID",
      ms: "ms-MY",
      tl: "tl-PH",
      sw: "sw-KE",
      hu: "hu-HU",
      cs: "cs-CZ",
      sk: "sk-SK",
      ro: "ro-RO",
      bg: "bg-BG",
      hr: "hr-HR",
      sl: "sl-SI",
      et: "et-EE",
      lv: "lv-LV",
      lt: "lt-LT",
      uk: "uk-UA",
      ca: "ca-ES",
      eu: "eu-ES",
      gl: "gl-ES",
      cy: "cy-GB",
      ga: "ga-IE",
      is: "is-IS",
      mt: "mt-MT",
      af: "af-ZA",
      sq: "sq-AL",
      az: "az-AZ",
      be: "be-BY",
      ka: "ka-GE",
      mk: "mk-MK",
      mn: "mn-MN",
      my: "my-MM",
      am: "am-ET",
      yo: "yo-NG",
      zu: "zu-ZA",
      xh: "xh-ZA",
      ig: "ig-NG",
      ha: "ha-NG",
      sn: "sn-ZW",
      ny: "ny-MW",
      st: "st-ZA",
      mg: "mg-MG",
      sm: "sm-WS",
      haw: "haw-US",
      mi: "mi-NZ",
      gd: "gd-GB",
      fy: "fy-NL",
      co: "co-FR",
      lb: "lb-LU",
      yi: "yi",
      jw: "jw-ID",
      su: "su-ID",
      ceb: "ceb-PH",
      eo: "eo",
      la: "la",
    }
    return voiceMap[langCode] || langCode
  }

  const copyToClipboard = async (text: string, type: "source" | "target") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied((prev) => ({ ...prev, [type]: true }))
      setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const swapLanguages = () => {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)

    if (translatedText) {
      setSourceText(translatedText)
      setTranslatedText("")
      setSuggestions([])
      setShowSuggestions(false)
    }

    setError("")
  }

  const handleSourceLangChange = (value: string) => {
    setSourceLang(value)
    if (value === targetLang) {
      const differentLang = languages.find((lang) => lang.code !== value)
      if (differentLang) {
        setTargetLang(differentLang.code)
      }
    }
    setError("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleTargetLangChange = (value: string) => {
    setTargetLang(value)
    if (value === sourceLang) {
      const differentLang = languages.find((lang) => lang.code !== value)
      if (differentLang) {
        setSourceLang(differentLang.code)
      }
    }
    setError("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  const getLanguageName = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || code
  }

  const charactersRemaining = MAX_CHARACTERS - sourceText.length
  const isNearLimit = charactersRemaining < 500

  const favoriteTranslations = history.filter((item) => item.isFavorite)

  // Show loading state while initializing data
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-slate-600 dark:text-slate-400">Loading your data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 relative">
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
              <Select value={sourceLang} onValueChange={handleSourceLangChange}>
                <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={swapLanguages}
                className="rounded-full h-12 w-12 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110"
                aria-label="Swap languages"
              >
                <ArrowRightLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
              <Select value={targetLang} onValueChange={handleTargetLangChange}>
                <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter text</label>
                <div className="flex items-center space-x-1">
                  {sourceText && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(sourceText, sourceLang, "source")}
                        disabled={isSpeaking.source}
                        className="h-8 px-2 transition-all duration-200 hover:scale-105"
                      >
                        <Volume2 className={`h-4 w-4 ${isSpeaking.source ? "animate-pulse text-orange-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sourceText, "source")}
                        className="h-8 px-2 transition-all duration-200 hover:scale-105"
                      >
                        {copied.source ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </>
                  )}
                  <Popover open={showInputTools} onOpenChange={setShowInputTools}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 transition-all duration-200 hover:scale-105"
                      >
                        <Keyboard className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleVoiceInput}
                          disabled={isRecording}
                          className="w-full justify-start transition-all duration-200 hover:scale-105"
                        >
                          <Mic className={`h-4 w-4 mr-2 ${isRecording ? "animate-pulse text-red-500" : ""}`} />
                          {isRecording ? "Recording..." : "Voice Input"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full justify-start transition-all duration-200 hover:scale-105"
                          disabled={isUploading}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {isUploading ? "Uploading..." : "Upload Document"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => imageInputRef.current?.click()}
                          className="w-full justify-start transition-all duration-200 hover:scale-105"
                          disabled={isUploading}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {isUploading ? "Processing..." : "Upload Image (OCR)"}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Textarea
                ref={textareaRef}
                placeholder="Type here to translate... (Get AI suggestions as you type)"
                value={sourceText}
                onChange={handleSourceTextChange}
                rows={6}
                className={`resize-none bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-base transition-all duration-300 ${
                  isNearLimit ? "border-orange-300 dark:border-orange-600" : ""
                }`}
              />
              <div className="flex justify-between items-center text-xs">
                <span className={`${isNearLimit ? "text-orange-600 dark:text-orange-400" : "text-slate-500"}`}>
                  {sourceText.length}/{MAX_CHARACTERS} characters
                  {isNearLimit && ` (${charactersRemaining} remaining)`}
                </span>
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs transition-all duration-200 hover:scale-105"
                  disabled={!sourceText && !translatedText}
                >
                  Clear All
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Translation</label>
                {translatedText && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(translatedText, targetLang, "target")}
                      disabled={isSpeaking.target}
                      className="h-8 px-2 transition-all duration-200 hover:scale-105"
                    >
                      <Volume2 className={`h-4 w-4 ${isSpeaking.target ? "animate-pulse text-orange-500" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(translatedText, "target")}
                      className="h-8 px-2 transition-all duration-200 hover:scale-105"
                    >
                      {copied.target ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      className="h-8 px-2 transition-all duration-200 hover:scale-105"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <Textarea
                placeholder={
                  isTranslating
                    ? "Translating..."
                    : translatedText
                      ? ""
                      : "Translation will appear here (click speaker to hear)"
                }
                value={translatedText}
                readOnly
                rows={6}
                className="resize-none bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-base transition-all duration-300 cursor-default"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">{translatedText.length} characters</span>
                {translatedText && (
                  <Button
                    onClick={() => setTranslatedText("")}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs transition-all duration-200 hover:scale-105"
                  >
                    Clear Translation
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating || sourceLang === targetLang}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              size="lg"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </Button>

            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-3 border-slate-300 dark:border-slate-600 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <History className="mr-2 h-4 w-4" />
                  History ({history.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>Translation History</DialogTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportHistory}
                        className="transition-all duration-200 hover:scale-105 bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                {/* Favorites Section */}
                {favoriteTranslations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      Favorites ({favoriteTranslations.length})
                    </h3>
                    <div className="space-y-2">
                      {favoriteTranslations.map((item) => (
                        <Card
                          key={item.id}
                          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border-yellow-200 dark:border-yellow-800 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                          onClick={() => loadFromHistory(item)}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-xs text-slate-500">
                                {getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleFavorite(item.id)
                                  }}
                                  className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110"
                                >
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteTranslation(item.id)
                                  }}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{item.sourceText}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">{item.translatedText}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Translations */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">All Translations</h3>
                  <div className="space-y-3">
                    {history.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">No translations saved yet</p>
                    ) : (
                      history.map((item) => (
                        <Card
                          key={item.id}
                          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                          onClick={() => loadFromHistory(item)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-xs text-slate-500">
                                {getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="text-xs text-slate-400">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleFavorite(item.id)
                                  }}
                                  className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110"
                                >
                                  <Star
                                    className={`h-3 w-3 ${item.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-slate-400"}`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteTranslation(item.id)
                                  }}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">{item.sourceText}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">{item.translatedText}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isSavedWordsOpen} onOpenChange={setIsSavedWordsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-3 border-slate-300 dark:border-slate-600 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Saved Words ({savedWords.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Saved Words & Phrases</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {savedWords.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No saved words yet</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Save translations to build your personal phrase collection
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedWords.map((word) => (
                        <Card
                          key={word.id}
                          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                          onClick={() => insertSavedWord(word)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-xs text-slate-500">
                                {getLanguageName(word.sourceLang)} → {getLanguageName(word.targetLang)}
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="text-xs text-slate-400">
                                  {new Date(word.timestamp).toLocaleDateString()}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteSavedWord(word.id)
                                  }}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">{word.word}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">{word.translation}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Inline AI Suggestions Popup */}
        {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
          <div
            className="fixed z-50 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 rounded-lg shadow-lg p-3 min-w-[200px] animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              top: suggestionPosition.top,
              left: suggestionPosition.left,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <Lightbulb className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">AI Suggestions</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="h-5 w-5 p-0 transition-all duration-200 hover:scale-110"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {isLoadingSuggestions ? (
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between space-x-2">
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="flex-1 text-left p-2 text-xs bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600 transition-all duration-200 hover:scale-[1.02]"
                    >
                      {suggestion}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Get the current word being typed to save with its suggestion
                        const textarea = textareaRef.current
                        if (textarea) {
                          const cursorPosition = textarea.selectionStart
                          const words = sourceText.split(/\s+/)
                          const currentWordIndex = getCurrentWordIndex(sourceText, cursorPosition)
                          const currentWord = words[currentWordIndex]
                          handleSaveWord(currentWord, suggestion)
                        }
                      }}
                      className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110 flex-shrink-0"
                      title="Save this word"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save Word Confirmation */}
        {selectedWordForSave && (
          <Card className="border-green-200 dark:border-green-800 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Plus className="h-4 w-4 text-green-500" />
                <span>Save Word Pair?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500">
                    {getLanguageName(sourceLang)} → {getLanguageName(targetLang)}
                  </div>
                  <div className="font-medium text-sm">{selectedWordForSave.word}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{selectedWordForSave.translation}</div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveWord(selectedWordForSave.word, selectedWordForSave.translation)}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWordForSave(null)}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`p-3 rounded-lg text-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ${
              saveMessage.includes("success")
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              {saveMessage.includes("success") ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{saveMessage}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }) as T
}
