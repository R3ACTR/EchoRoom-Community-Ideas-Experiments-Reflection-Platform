export type EchionIntent = {
  keywords: string[];
  response: string;
};

export const echionIntents: EchionIntent[] = [

  // ===============================
  // PLATFORM PURPOSE & PHILOSOPHY
  // ===============================
  {
        keywords: [
            "hi",
            "hello",
            "hey",
            "good morning",
            "good afternoon",
            "good evening"
        ],
        response: `Hey there 👋

        I'm Echion, your EchoRoom assistant.

        You can ask me about:
        • Ideas
        • Experiments
        • Outcomes
        • Reflections
        • How to get started

        What would you like to know?`
},
{
  keywords: ["thanks", "thank you", "ty"],
  response: `You're welcome 😊

If you have more questions about EchoRoom, I’m here to help.`
},
  {
    keywords: [
      "what is echoroom",
      "about echoroom",
      "what does this platform do",
      "explain echoroom",
      "purpose",
      "why echoroom",
      "what is this site",
      "what is this platform"
    ],
    response: `EchoRoom is a collaborative learning platform.

Communities:
• Share ideas
• Test them through experiments
• Record real outcomes
• Reflect on what they learned

It focuses on learning loops — not just discussion or voting.

The goal is not to win ideas.
The goal is to learn from trying them.`
  },

  {
    keywords: [
      "how is this different",
      "difference from other platforms",
      "why not just discuss",
      "why not just vote"
    ],
    response: `Unlike traditional idea platforms, EchoRoom does not stop at discussion.

It encourages:
Idea → Experiment → Outcome → Reflection → Shared Learning

The emphasis is on action and documented learning, not popularity.`
  },

  // ===============================
  // HOMEPAGE CONFUSION
  // ===============================

  {
    keywords: [
      "start exploring",
      "learn more button",
      "what happens if i click",
      "homepage buttons"
    ],
    response: `On the homepage:

• "Start Exploring" takes you to the Ideas page.
• "Learn More" explains the EchoRoom project in detail.

Most users begin by exploring Ideas.`
  },

  // ===============================
  // GETTING STARTED
  // ===============================

  {
    keywords: [
      "how to start",
      "where do i begin",
      "i am new",
      "new here",
      "what should i do first"
    ],
    response: `If you're new:

1. Browse Ideas
2. Create your own Idea
3. Turn it into an Experiment
4. Record the Outcome
5. Write a Reflection

That’s the EchoRoom learning loop.`
  },

  // ===============================
  // IDEAS
  // ===============================

  {
    keywords: [
      "create idea",
      "post idea",
      "add idea",
      "new idea",
      "submit idea",
      "how to create idea"
    ],
    response: `To create an Idea:

1. Go to the Ideas page
2. Click "Create Idea"
3. Add title and description
4. Save as Draft or Publish publicly

Publishing makes it visible to the community.`
  },

  {
    keywords: [
      "draft",
      "save draft",
      "what is draft",
      "difference draft publish",
      "private idea"
    ],
    response: `Draft Ideas are private.

• Draft = saved privately
• Publish = visible to community

You can edit drafts anytime before publishing.`
  },

  {
    keywords: [
      "no ideas",
      "empty ideas",
      "why nothing here"
    ],
    response: `There are no Ideas yet.

You can start the learning loop by creating the first Idea.`
  },

  // ===============================
  // EXPERIMENTS
  // ===============================

  {
    keywords: [
      "experiment",
      "create experiment",
      "run experiment",
      "new experiment"
    ],
    response: `Experiments test Ideas in real conditions.

To create:
1. Go to Experiments page
2. Click "New Experiment"
3. Add hypothesis and duration
4. Optionally link it to an Idea

Experiments move thinking into action.`
  },

  {
    keywords: [
      "link idea",
      "connect idea",
      "attach idea",
      "associate idea"
    ],
    response: `When creating an Experiment, you can link it to an Idea.

This keeps the learning structure connected.`
  },

  {
    keywords: [
      "no experiments",
      "empty experiments"
    ],
    response: `No Experiments yet.

Create one to test an Idea and move forward in the learning loop.`
  },

  // ===============================
  // OUTCOMES
  // ===============================

  {
    keywords: [
      "outcome",
      "results",
      "experiment result",
      "what happened"
    ],
    response: `Outcomes record the result of Experiments.

They classify:
• Success
• Failure
• Mixed result

Outcomes lead into Reflections.`
  },

  {
    keywords: [
      "no outcomes",
      "empty outcomes"
    ],
    response: `Outcomes are created after completing an Experiment.

Finish an Experiment first, then record the outcome.`
  },

  // ===============================
  // REFLECTIONS
  // ===============================

  {
    keywords: [
      "reflection",
      "write reflection",
      "create reflection",
      "lessons learned"
    ],
    response: `Reflections document learning.

To create:
1. Go to Reflections page
2. Link to an Outcome
3. Write insights and improvements

Reflections turn experience into shared knowledge.`
  },

  {
    keywords: [
      "no reflections",
      "empty reflections"
    ],
    response: `Reflections require an Outcome first.

Complete an Experiment and record its Outcome before reflecting.`
  },

  // ===============================
  // FLOW CONFUSION
  // ===============================

  {
    keywords: [
      "flow",
      "process",
      "how does it connect",
      "learning loop",
      "idea experiment outcome reflection"
    ],
    response: `EchoRoom Learning Loop:

Idea → Experiment → Outcome → Reflection → Shared Learning

Each step builds on the previous one.`
  },

  // ===============================
  // PERMISSIONS / VISIBILITY
  // ===============================

  {
    keywords: [
      "public",
      "private",
      "who can see",
      "visibility",
      "is this public"
    ],
    response: `Published Ideas are public.

Draft Ideas remain private.

Experiments and Reflections are connected to Ideas and Outcomes within the learning structure.`
  },

  // ===============================
  // CONTRIBUTOR / PROJECT INFO
  // ===============================

  {
    keywords: [
      "open source",
      "contribute",
      "osq",
      "project info"
    ],
    response: `EchoRoom is part of Open Source Quest (OSQ).

It is designed to support contributors from diverse skill backgrounds and encourage structured collaborative learning.`
  }

];

export const fallbackResponse = `
I’m Echion, your EchoRoom guide.

I can help with:
• Ideas
• Experiments
• Outcomes
• Reflections
• Draft vs Publish
• Learning loop
• Getting started

For unrelated topics, please use a general search tool.
`;