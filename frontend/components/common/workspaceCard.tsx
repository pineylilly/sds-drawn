import Link from "next/link";

export interface WorkspaceCardProps {
  id: string;
  imageUrl: string;
  displayText: string;
  description: string;
}

export default function WorkspaceCard({ data }: { data: WorkspaceCardProps }) {
  return (
    <div className="grid-rows-2">
      <div className="flex flex-col items-center">
        <Link href="/">
          <button className="bg-transparent border-2 hover:border-blue-500 rounded">
            <img
              src={
                data.imageUrl ||
                "https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png"
              }
              alt="Workspace image"
              className="min-w-28 w-28 md:w-32 lg:w-36 min=h=36 h-36 md:h-44 lg:h-48"
            />
          </button>
        </Link>
      </div>
      <div className="flex flex-col justiyfy-center items-center">
        <h2 className="text-xs">{data.displayText}</h2>
        <h2 className="text-xs">{data.description}</h2>
      </div>
    </div>
  );
}
