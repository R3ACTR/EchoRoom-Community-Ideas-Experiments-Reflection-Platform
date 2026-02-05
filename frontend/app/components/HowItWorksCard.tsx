export default function HowItWorksCard (){
    return(
        <section className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-semibold mb-10">
            How EchoRoom Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Idea",
                emoji: "💡",
                color: "indigo",
                text: "Share a thought, proposal, or question with the community."
              },
              {
                title: "Experiment",
                emoji: "🧪",
                color: "emerald",
                text: "Try the idea through a small, time-bound experiment."
              },
              {
                title: "Outcome",
                emoji: "📊",
                color: "amber",
                text: "Capture what actually happened during the experiment."
              },
              {
                title: "Reflection",
                emoji: "🧠",
                color: "rose",
                text: "Reflect on learnings and share insights openly."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border p-6 bg-gradient-to-br from-white to-gray-50"
              >
                <div className={`text-3xl mb-3`}>
                  {item.emoji}
                </div>
                <h4 className={`font-semibold text-lg mb-2 text-${item.color}-600`}>
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    );
}