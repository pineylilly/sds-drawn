import { CloudIcon, FileSearch, MessageSquareMore, PaletteIcon, PencilIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function FeatureCards() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <PencilIcon className="h-12 w-12 text-indigo-600" />
            <h3 className="text-lg font-bold mt-4">Powerful Drawing Tools</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Use a wide range of brushes, pencils, and other creative tools.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <PaletteIcon className="h-12 w-12 text-purple-600" />
            <h3 className="text-lg font-bold mt-4">Customizable Colors</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Choose from endless color options or create your custom palettes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CloudIcon className="h-12 w-12 text-pink-600" />
            <h3 className="text-lg font-bold mt-4">Save & Share</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Save your drawings and share them with the world instantly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <UsersIcon className="h-12 w-12 text-indigo-600" />
            <h3 className="text-lg font-bold mt-4">Share Collaboration</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Send collaborative invites to your partner by email or link.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileSearch className="h-12 w-12 text-purple-600" />
            <h3 className="text-lg font-bold mt-4">Unlimited Workspaces</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Create as many workspaces as you want and work on multiple projects.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquareMore className="h-12 w-12 text-pink-600" />
            <h3 className="text-lg font-bold mt-4">Chat</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Chat in the same project that can send and receive text messages in real-time.
            </p>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}