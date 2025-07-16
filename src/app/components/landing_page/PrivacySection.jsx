const PrivacySection = () => (
  <section
    id="privacy"
    className="bg-white py-6 px-4 md:py-12 md:px-16 max-w-7xl mx-auto">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Left: Headline, subheadline, features, button */}
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 mt-13 text-gray-900">
          Your Privacy is Our Priority
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl">
          We believe in complete transparency about how your data is used to
          power CardSmart's intelligent features.
        </p>
        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-4">
            <span className="text-sky-600 text-3xl mt-1">🛡️</span>
            <div>
              <span className="font-semibold text-lg text-gray-900">
                Local Processing
              </span>
              <p className="text-gray-700 text-base">
                Most data processing happens directly on your device, not in the
                cloud.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-sky-600 text-3xl mt-1">👤</span>
            <div>
              <span className="font-semibold text-lg text-gray-900">
                Granular Permissions
              </span>
              <p className="text-gray-700 text-base">
                Choose exactly what data you share and when location tracking is
                active.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-sky-600 text-3xl mt-1">🗄️</span>
            <div>
              <span className="font-semibold text-lg text-gray-900">
                Data Ownership
              </span>
              <p className="text-gray-700 text-base">
                Your data belongs to you. Export or delete it anytime with one
                tap.
              </p>
            </div>
          </div>
        </div>
        <button className="mt-2 px-8 py-3 border-2 border-sky-600 text-sky-600 rounded-full text-lg font-semibold bg-white hover:bg-sky-50 transition-all">
          Learn More About Privacy
        </button>
      </div>
      {/* Right: Privacy Settings Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col gap-6">
          <h3 className="text-2xl font-bold mb-2 text-gray-900">
            Privacy Settings
          </h3>
          <div className="flex flex-col gap-5">
            {/* Setting 1 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Location Services
                </div>
                <div className="text-gray-500 text-sm">
                  Allow CardSmart to access your location when using the app
                </div>
              </div>
              <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                <span className="absolute block w-6 h-6 bg-sky-600 border-4 border-white rounded-full shadow left-4 top-0 transition-transform duration-200 transform translate-x-0"></span>
                <span className="block overflow-hidden h-6 rounded-full bg-gray-200"></span>
              </span>
            </div>
            {/* Setting 2 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Usage Analytics
                </div>
                <div className="text-gray-500 text-sm">
                  Track which cards you use to improve suggestions
                </div>
              </div>
              <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                <span className="absolute block w-6 h-6 bg-sky-600 border-4 border-white rounded-full shadow left-4 top-0 transition-transform duration-200 transform translate-x-0"></span>
                <span className="block overflow-hidden h-6 rounded-full bg-gray-200"></span>
              </span>
            </div>
            {/* Setting 3 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Background Processing
                </div>
                <div className="text-gray-500 text-sm">
                  Allow CardSmart to update in the background
                </div>
              </div>
              <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                <span className="absolute block w-6 h-6 bg-gray-300 border-4 border-white rounded-full shadow left-1 top-0 transition-transform duration-200 transform translate-x-0"></span>
                <span className="block overflow-hidden h-6 rounded-full bg-gray-200"></span>
              </span>
            </div>
            {/* Setting 4 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Cloud Backup</div>
                <div className="text-gray-500 text-sm">
                  Securely back up your card data to the cloud
                </div>
              </div>
              <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                <span className="absolute block w-6 h-6 bg-sky-600 border-4 border-white rounded-full shadow left-4 top-0 transition-transform duration-200 transform translate-x-0"></span>
                <span className="block overflow-hidden h-6 rounded-full bg-gray-200"></span>
              </span>
            </div>
            {/* Setting 5 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Anonymous Usage Data
                </div>
                <div className="text-gray-500 text-sm">
                  Share anonymous data to improve the app
                </div>
              </div>
              <span className="relative inline-block w-11 align-middle select-none transition duration-200 ease-in">
                <span className="absolute block w-6 h-6 bg-gray-300 border-4 border-white rounded-full shadow left-1 top-0 transition-transform duration-200 transform translate-x-0"></span>
                <span className="block overflow-hidden h-6 rounded-full bg-gray-200"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PrivacySection;
