import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, TrendingUp, Award, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main role="main">
        {/* Hero Section */}
        <section className="container mx-auto px-6 lg:px-8 py-24 lg:py-32 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Build Your Developer <span className="text-blue-600">Reputation</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Showcase your GitHub activity and onchain builder score in one powerful profile. 
            Stand out to recruiters and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/onboarding">
              <Button size="lg" aria-label="Start creating your developer profile">
                Create Your Profile
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg" aria-label="Browse developer profiles">
                Explore Profiles
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Github className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">GitHub Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically sync your commits, PRs, repos, and contribution history
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Talent Protocol Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Display your onchain builder score and credentials to prove your expertise
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Activity Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Beautiful visualizations of your coding activity and language proficiency
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">For Recruiters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Public profiles make it easy for employers to discover and vet talent
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="bg-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to showcase your skills?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create your profile in minutes. Connect your wallet and GitHub to get started.
            </p>
            <Link href="/onboarding">
              <Button variant="secondary" size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 GitCaster. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}
