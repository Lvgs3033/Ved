import TranslationForm from "@/components/translation-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-green-400 to-teal-500 rounded-full blur-xl animate-bounce delay-500"></div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-3/4 right-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping delay-1000"></div>

        {/* Moving Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/20 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-100/20 to-transparent animate-pulse delay-500"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 dark:from-slate-700/20 dark:to-slate-600/20"></div>
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white font-bold text-lg">वेद</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Ved</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Translation</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl text-slate-600 dark:text-slate-400 mb-2">
                Translate with AI Intelligence & Voice
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Supporting 25+ languages with smart suggestions, speech synthesis, and saved words
              </p>
            </div>

            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <TranslationForm />
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Ved • Powered by Next.js Serverless Functions & AI • Free translation service
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
