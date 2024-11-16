import WorkspaceTemplateList from "@/components/common/workspaceList/workspaceTemplateList";
import { WorkspaceTemplateListProps } from "@/components/common/workspaceList/workspaceTemplateList"; // Import the interface if defined elsewhere
import { DropDown1 } from "@/components/common/dropDown1";

export default async function WorkspaceTemplatePane() {
  //   const data = await fetch(requestUrl);
  const mockData: WorkspaceTemplateListProps = {
    data: [
      {
        id: "1",
        imageUrl: "",
        displayText: "Blank workspace",
        description: "description",
      },
      {
        id: "2",
        imageUrl: "",
        displayText: "Workspace template 1",
        description: "description",
      },
      {
        id: "3",
        imageUrl: "",
        displayText: "Workspace template 2",
        description: "description",
      },
      {
        id: "4",
        imageUrl: "",
        displayText: "Workspace template 3",
        description: "description",
      },
      {
        id: "5",
        imageUrl: "",
        displayText: "Workspace template 4",
        description: "description",
      },
    ],
  };

  return (
    <div className="flex flex-col bg-gray-200 w-screen justify-center items-center pt-4 pb-6">
      <div className="grid grid-rows-auto gap-y-2 w-[400px] md:w-[720px] lg:w-[1000px]">
        <div className="grid grid-cols-2">
          <div className="flex flex-row w-full justify-start items-center">
            <h2 className="font-bold text-s md:text-l lg:text-xl pl-10 md:pl-12 lg:pl-5">
              Create new workspace
            </h2>
          </div>
          <div className="flex flex-row justify-end items-center">
            <DropDown1 />
          </div>
        </div>
        <WorkspaceTemplateList data={mockData.data} />
      </div>
    </div>
  );
}
