export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          About EchoRoom
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          EchoRoom is a platform designed to help individuals explore ideas,
          conduct experiments, reflect on their learning, and share insights
          with a community. It provides a structured environment where thoughts
          can grow into meaningful knowledge.
        </p>

        <p className="text-lg text-gray-600 mb-6">
          The platform encourages curiosity-driven learning. Users can document
          their ideas, test hypotheses through experiments, and reflect on their
          outcomes. EchoRoom serves as a personal and collaborative space for
          continuous improvement.
        </p>

        <p className="text-lg text-gray-600 mb-6">
          This project is part of an open learning initiative and will continue
          to evolve with new features, improved tools, and enhanced community
          interaction.
        </p>

        <div className="mt-10 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-2">
            Future Enhancements
          </h2>

          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>User authentication and profiles</li>
            <li>Idea tracking and version history</li>
            <li>Experiment documentation tools</li>
            <li>Community discussions and feedback</li>
            <li>Knowledge sharing and collaboration features</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
