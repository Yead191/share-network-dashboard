import { Modal, Spin, Tag, Button } from "antd";
import { useGetResourceByIdQuery } from "../../../redux/apiSlices/coordinator/resources";
import { imageUrl } from "../../../redux/api/baseApi";

interface Props {
  resourceId: string | null;
  onClose: () => void;
}

const CoordinatorDetailsModal: React.FC<Props> = ({
  resourceId,
  onClose,
}) => {
  const { data, isLoading } = useGetResourceByIdQuery(
    resourceId as string,
    {
      skip: !resourceId,
    }
  );

  const resource = data?.data;

  return (
    // <Modal
    //   open={!!resourceId}
    //   onCancel={onClose}
    //   footer={null}
    //   centered
    //   width={600}
    //   title="Resource Details"
    // >
    //   {isLoading ? (
    //     <div className="flex justify-center p-8">
    //       <Spin />
    //     </div>
    //   ) : resource ? (
    //     <div className="space-y-4">
    //       <p><strong>Title:</strong> {resource.title}</p>
    //       <p><strong>Type:</strong> {resource.type}</p>

    //       <p>
    //         <strong>Target:</strong>{" "}
    //         <Tag color="blue">
    //           {resource.targeteAudience}
    //         </Tag>
    //       </p>

    //       <p>
    //         <strong>Group:</strong>{" "}
    //         <Tag color="purple">
    //           {resource.targertGroup?.name}
    //         </Tag>
    //       </p>

    //       <p>
    //         <strong>Status:</strong>{" "}
    //         <Tag color={resource.markAsAssigned ? "green" : "red"}>
    //           {resource.markAsAssigned
    //             ? "Assigned"
    //             : "Not Assigned"}
    //         </Tag>
    //       </p>

    //       <p>
    //         <strong>Upload Date:</strong>{" "}
    //         {new Date(resource.createdAt).toLocaleString()}
    //       </p>

    //       <Button
    //         type="primary"
    //         onClick={() =>
    //           window.open(resource.contentUrl, "_blank")
    //         }
    //       >
    //         View Resource
    //       </Button>
    //       <Button
    //         type="primary"
    //         onClick={() =>
    //           window.open(`${imageUrl}${resource.pdf}`, "_blank")
    //         }
    //       >
    //         Download PDF
    //       </Button>
          
    //     </div>
    //   ) : null}
    // </Modal>
    <Modal
  open={!!resourceId}
  onCancel={onClose}
  footer={null}
  centered
  width={600}
  title="Resource Details"
>
  {isLoading ? (
    <div className="flex justify-center p-8">
      <Spin size="large" />
    </div>
  ) : resource ? (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Title:</span>
        <span className="text-gray-800">{resource.title}</span>
      </div>

      {/* Type */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Type:</span>
        <span className="text-gray-800">{resource.type}</span>
      </div>

      {/* Target Audience */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Target:</span>
        <Tag color="blue">{resource.targeteAudience}</Tag>
      </div>

      {/* Group */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Group:</span>
        <Tag color="purple">{resource.targertGroup?.name || "N/A"}</Tag>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Status:</span>
        <Tag color={resource.markAsAssigned ? "green" : "red"}>
          {resource.markAsAssigned ? "Assigned" : "Not Assigned"}
        </Tag>
      </div>

      {/* Upload Date */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Upload Date:</span>
        <span className="text-gray-800">
          {new Date(resource.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="primary"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => window.open(resource.contentUrl, "_blank")}
        >
          View Resource
        </Button>
        {resource.pdf && (
          <Button
            type="primary"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => window.open(`${imageUrl}${resource.pdf}`, "_blank")}
          >
            Download PDF
          </Button>
        )}
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-500 p-8">
      Resource not found
    </div>
  )}
</Modal>
  );
};

export default CoordinatorDetailsModal;