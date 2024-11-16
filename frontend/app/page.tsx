import FeatureCards from "@/components/common/featureCards";
import NavigationBar from "@/components/common/nav/navigationBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="unpadding-page">
      <NavigationBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        {/* Landing Page here */}
        <section className="text-center py-16 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full">
          <h1 className="text-5xl font-bold text-white mb-4">
            Draw. Create. Inspire.
          </h1>
          <p className="text-xl text-white mb-8">
            Unleash your creativity with our powerful drawing tools.
          </p>
          <Link href="/workspaces">
            <Button className="bg-white text-indigo-600 hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </section>

        <section className="py-16 px-6">
          <FeatureCards />
        </section>

        <section className="py-16 px-6 bg-gray-100 w-full text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Ready to Start Drawing?
          </h2>
          <Link href="/workspaces">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
              Start Now
            </Button>
          </Link>
          
        </section>
      </div>
    </div>
  );
}
