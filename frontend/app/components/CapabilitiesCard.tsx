export default function CapabilitiesCard(){
    return (
        <section className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold mb-6">
          What You’ll Be Able to Do
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {[
            "Submit ideas to the community",
            "Run and track experiments",
            "Document outcomes and reflections",
            "Learn from shared experiences"
          ].map((text) => (
            <div
              key={text}
              className="flex items-start gap-3 bg-white rounded-lg p-4 border"
            >
              <span className="text-emerald-500 mt-1">✔</span>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          🚧 These features will be built collaboratively during Open Source Quest (OSQ).
        </p>
      </section>
    );
}