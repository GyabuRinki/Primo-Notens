import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, ClipboardCheck, Sparkles } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: "Advanced Note-Taking",
      description: "Rich text editor with organization by subjects and tags. Create comprehensive study notes with formatting and structure.",
      link: "/notes",
    },
    {
      icon: Brain,
      title: "Anki-Style Flashcards",
      description: "Spaced repetition system to maximize retention. Review cards at optimal intervals for long-term memory.",
      link: "/flashcards",
    },
    {
      icon: ClipboardCheck,
      title: "Mock Test Maker",
      description: "Create comprehensive practice tests with multiple question types. Track your progress and identify weak areas.",
      link: "/tests",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Your Complete Study Companion</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
            Master Your Studies with <span className="text-primary">PrimoNotes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Combine powerful note-taking, spaced repetition flashcards, and comprehensive mock tests in one beautiful, focused environment.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/notes">
              <Button size="lg" data-testid="button-get-started">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center text-foreground mb-12">
            Three Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 hover-elevate active-elevate-2 transition-all">
                <div className="p-3 rounded-md bg-primary/10 inline-block mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Link href={feature.link}>
                  <Button variant="ghost" className="p-0" data-testid={`link-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    Explore →
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
            Start Your Learning Journey
          </h2>
          <p className="text-muted-foreground mb-8">
            All your study tools in one place. No account needed, everything stored locally on your device.
          </p>
          <Link href="/notes">
            <Button size="lg" data-testid="button-start-learning">
              Start Learning Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
