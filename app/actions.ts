"use server"

// Language mapping for better API compatibility
const languageMapping: Record<string, string> = {
  en: "en",
  hi: "hi",
  bn: "bn",
  ta: "ta",
  te: "te",
  mr: "mr",
  gu: "gu",
  kn: "kn",
  ml: "ml",
  pa: "pa",
  ur: "ur",
  or: "or",
  as: "as",
  ne: "ne",
  si: "si",
  my: "my",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "pt",
  ru: "ru",
  zh: "zh-CN",
  ja: "ja",
  ko: "ko",
  ar: "ar",
  th: "th",
  vi: "vi",
  tr: "tr",
  pl: "pl",
  nl: "nl",
  sv: "sv",
  da: "da",
  no: "no",
  fi: "fi",
  el: "el",
  he: "he",
  fa: "fa",
  id: "id",
  ms: "ms",
  tl: "tl",
  sw: "sw",
  am: "am",
  yo: "yo",
  ig: "ig",
  ha: "ha",
  zu: "zu",
  af: "af",
  sq: "sq",
  az: "az",
  be: "be",
  bg: "bg",
  ca: "ca",
  hr: "hr",
  cs: "cs",
  et: "et",
  ka: "ka",
  hu: "hu",
  is: "is",
  ga: "ga",
  lv: "lv",
  lt: "lt",
  mk: "mk",
  mt: "mt",
  ro: "ro",
  sk: "sk",
  sl: "sl",
  uk: "uk",
  cy: "cy",
  eu: "eu",
  gl: "gl",
  lb: "lb",
  mn: "mn",
  ps: "ps",
  sd: "sd",
  ug: "ug",
  uz: "uz",
  xh: "xh",
  yi: "yi",
  la: "la",
  eo: "eo",
  jw: "jw",
  su: "su",
  ceb: "ceb",
  haw: "haw",
  mg: "mg",
  sm: "sm",
  sn: "sn",
  st: "st",
  ny: "ny",
  co: "co",
  fy: "fy",
  gd: "gd",
  mi: "mi",
}

interface TranslationRequest {
  sourceText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  isFavorite?: boolean
}

interface TranslationHistory {
  id: string
  sourceText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  timestamp: string
  isFavorite?: boolean
}

interface SavedWordRequest {
  word: string
  translation: string
  sourceLang: string
  targetLang: string
}

interface SavedWord {
  id: string
  word: string
  translation: string
  sourceLang: string
  targetLang: string
  timestamp: string
}

// Helper functions for localStorage operations
const getFromLocalStorage = (key: string, defaultValue: any = []) => {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

const setToLocalStorage = (key: string, value: any) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
  }
}

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    // Validate that source and target languages are different
    if (sourceLang === targetLang) {
      throw new Error("Please select two different languages")
    }

    // Map language codes
    const mappedSourceLang = languageMapping[sourceLang] || sourceLang
    const mappedTargetLang = languageMapping[targetLang] || targetLang

    // Try Google Translate API (free tier via translate.googleapis.com)
    try {
      const googleResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${mappedSourceLang}&tl=${mappedTargetLang}&dt=t&q=${encodeURIComponent(text)}`,
      )

      if (googleResponse.ok) {
        const data = await googleResponse.json()
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          return data[0][0][0]
        }
      }
    } catch (error) {
      console.log("Google Translate failed, trying backup API")
    }

    // Fallback to MyMemory API with better error handling
    const encodedText = encodeURIComponent(text)
    const langPair = `${mappedSourceLang}|${mappedTargetLang}`
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Translation service temporarily unavailable (${response.status})`)
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      const translatedText = data.responseData.translatedText

      // Check if the translation is actually different from input
      if (translatedText.toLowerCase() === text.toLowerCase()) {
        throw new Error("Unable to translate between these languages")
      }

      return translatedText
    } else if (data.responseStatus === 403) {
      throw new Error("Language pair not supported or quota exceeded")
    } else {
      throw new Error(data.responseDetails || "Translation failed")
    }
  } catch (error) {
    console.error("Translation error:", error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error("Translation service is currently unavailable")
  }
}

export async function getAISuggestions(text: string, targetLanguage: string): Promise<string[]> {
  try {
    // Enhanced AI suggestions with more contextual alternatives
    const suggestions: string[] = []

    // Language-specific suggestions with better context
    const contextualSuggestions: Record<string, Record<string, string[]>> = {
      en: {
        hello: ["Hi", "Hey", "Greetings", "Good day"],
        thank: ["Thanks", "Much appreciated", "Grateful"],
        please: ["Kindly", "If you would", "Could you"],
        good: ["Great", "Excellent", "Wonderful", "Nice"],
        bad: ["Poor", "Terrible", "Awful", "Not good"],
        big: ["Large", "Huge", "Enormous", "Massive"],
        small: ["Tiny", "Little", "Miniature", "Compact"],
      },
      hi: {
        नमस्ते: ["नमस्कार", "आदाब", "सलाम"],
        धन्यवाद: ["शुक्रिया", "आभार", "कृतज्ञता"],
        कृपया: ["महेरबानी", "दया करके", "अनुरोध"],
        अच्छा: ["बेहतरीन", "शानदार", "उत्तम"],
        बुरा: ["खराब", "गलत", "नकारात्मक"],
      },
      es: {
        hola: ["Buenos días", "Saludos", "Qué tal"],
        gracias: ["Muchas gracias", "Te agradezco", "Mil gracias"],
        por: ["De favor", "Si puedes", "Te ruego"],
        bueno: ["Excelente", "Fantástico", "Genial"],
        malo: ["Terrible", "Pésimo", "Horrible"],
      },
    }

    // Get contextual suggestions based on the word
    const lowerText = text.toLowerCase()
    const contextSuggestions = contextualSuggestions[targetLanguage]

    if (contextSuggestions) {
      for (const [key, alternatives] of Object.entries(contextSuggestions)) {
        if (lowerText.includes(key.toLowerCase())) {
          suggestions.push(...alternatives.slice(0, 2))
          break
        }
      }
    }

    // If no contextual suggestions found, generate generic alternatives
    if (suggestions.length === 0) {
      // Formal/informal variations
      if (targetLanguage === "hi") {
        suggestions.push(`${text} (औपचारिक)`)
        suggestions.push(`${text} (अनौपचारिक)`)
      } else if (targetLanguage === "es") {
        suggestions.push(`${text} (formal)`)
        suggestions.push(`${text} (informal)`)
      } else if (targetLanguage === "fr") {
        suggestions.push(`${text} (formel)`)
        suggestions.push(`${text} (familier)`)
      } else {
        suggestions.push(`${text} (formal)`)
        suggestions.push(`${text} (casual)`)
      }

      // Add alternative phrasing
      suggestions.push(`Alternative: ${text}`)
    }

    // Add common phrases for the target language
    const commonPhrases: Record<string, string[]> = {
      hi: ["कैसे हैं आप?", "क्या हाल है?", "मदद चाहिए?"],
      es: ["¿Cómo estás?", "¿Qué tal?", "¿Necesitas ayuda?"],
      fr: ["Comment allez-vous?", "Ça va?", "Besoin d'aide?"],
      de: ["Wie geht es Ihnen?", "Alles klar?", "Brauchen Sie Hilfe?"],
      en: ["How are you?", "What's up?", "Need help?"],
    }

    // Add one common phrase if we have space
    if (suggestions.length < 3 && commonPhrases[targetLanguage]) {
      const randomPhrase =
        commonPhrases[targetLanguage][Math.floor(Math.random() * commonPhrases[targetLanguage].length)]
      suggestions.push(randomPhrase)
    }

    return suggestions.slice(0, 3) // Return max 3 suggestions
  } catch (error) {
    console.error("AI suggestions error:", error)
    return []
  }
}

export async function saveTranslation(translation: TranslationRequest): Promise<void> {
  try {
    const history = getFromLocalStorage("ved_translation_history", [])

    const existingIndex = history.findIndex(
      (item: TranslationHistory) =>
        item.sourceText === translation.sourceText &&
        item.sourceLang === translation.sourceLang &&
        item.targetLang === translation.targetLang,
    )

    if (existingIndex >= 0) {
      // Update existing translation
      history[existingIndex] = {
        ...history[existingIndex],
        ...translation,
        timestamp: new Date().toISOString(),
      }
    } else {
      // Add new translation
      const newTranslation: TranslationHistory = {
        id: Date.now().toString(),
        ...translation,
        timestamp: new Date().toISOString(),
      }
      history.unshift(newTranslation)
    }

    // Keep only last 100 translations
    if (history.length > 100) {
      history.splice(100)
    }

    setToLocalStorage("ved_translation_history", history)
  } catch (error) {
    console.error("Save translation error:", error)
    throw new Error("Failed to save translation")
  }
}

export async function getTranslationHistory(): Promise<TranslationHistory[]> {
  try {
    const history = getFromLocalStorage("ved_translation_history", [])
    // Sort by timestamp, most recent first
    return history.sort(
      (a: TranslationHistory, b: TranslationHistory) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  } catch (error) {
    console.error("Get history error:", error)
    return []
  }
}

export async function deleteTranslation(id: string): Promise<void> {
  try {
    const history = getFromLocalStorage("ved_translation_history", [])
    const updatedHistory = history.filter((item: TranslationHistory) => item.id !== id)
    setToLocalStorage("ved_translation_history", updatedHistory)
  } catch (error) {
    console.error("Delete translation error:", error)
    throw new Error("Failed to delete translation")
  }
}

export async function saveWord(wordRequest: SavedWordRequest): Promise<void> {
  try {
    const savedWords = getFromLocalStorage("ved_saved_words", [])

    const existingIndex = savedWords.findIndex(
      (item: SavedWord) =>
        item.word === wordRequest.word &&
        item.sourceLang === wordRequest.sourceLang &&
        item.targetLang === wordRequest.targetLang,
    )

    if (existingIndex >= 0) {
      // Update existing word
      savedWords[existingIndex] = {
        ...savedWords[existingIndex],
        ...wordRequest,
        timestamp: new Date().toISOString(),
      }
    } else {
      // Add new word
      const newWord: SavedWord = {
        id: Date.now().toString(),
        ...wordRequest,
        timestamp: new Date().toISOString(),
      }
      savedWords.unshift(newWord)
    }

    // Keep only last 200 words
    if (savedWords.length > 200) {
      savedWords.splice(200)
    }

    setToLocalStorage("ved_saved_words", savedWords)
  } catch (error) {
    console.error("Save word error:", error)
    throw new Error("Failed to save word")
  }
}

export async function getSavedWords(): Promise<SavedWord[]> {
  try {
    const savedWords = getFromLocalStorage("ved_saved_words", [])
    // Sort by timestamp, most recent first
    return savedWords.sort(
      (a: SavedWord, b: SavedWord) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  } catch (error) {
    console.error("Get saved words error:", error)
    return []
  }
}

export async function deleteSavedWord(id: string): Promise<void> {
  try {
    const savedWords = getFromLocalStorage("ved_saved_words", [])
    const updatedWords = savedWords.filter((item: SavedWord) => item.id !== id)
    setToLocalStorage("ved_saved_words", updatedWords)
  } catch (error) {
    console.error("Delete saved word error:", error)
    throw new Error("Failed to delete saved word")
  }
}
