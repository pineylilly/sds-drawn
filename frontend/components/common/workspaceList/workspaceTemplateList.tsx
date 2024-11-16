import WorkspaceCard from "@/components/common/workspaceCard";
import { WorkspaceCardProps } from "@/components/common/workspaceCard";

export interface WorkspaceTemplateListProps {
  data: WorkspaceCardProps[];
}

export default async function WorkspaceTemplateList({
  data,
}: WorkspaceTemplateListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4">
      {data.map((item) => (
        <WorkspaceCard key={item.id} data={item} />
      ))}
    </div>
  );
}
