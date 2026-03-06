import { Modal, Spin, Tag, Button } from "antd";
import { useGetResourceByIdQuery } from "../../../redux/apiSlices/coordinator/resources";

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
          <Spin />
        </div>
      ) : resource ? (
        <div className="space-y-4">
          <p><strong>Title:</strong> {resource.title}</p>
          <p><strong>Type:</strong> {resource.type}</p>

          <p>
            <strong>Target:</strong>{" "}
            <Tag color="blue">
              {resource.targeteAudience}
            </Tag>
          </p>

          <p>
            <strong>Group:</strong>{" "}
            <Tag color="purple">
              {resource.targertGroup?.name}
            </Tag>
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <Tag color={resource.markAsAssigned ? "green" : "red"}>
              {resource.markAsAssigned
                ? "Assigned"
                : "Not Assigned"}
            </Tag>
          </p>

          <p>
            <strong>Upload Date:</strong>{" "}
            {new Date(resource.createdAt).toLocaleString()}
          </p>

          <Button
            type="primary"
            onClick={() =>
              window.open(resource.contentUrl, "_blank")
            }
          >
            Open Resource
          </Button>
          
        </div>
      ) : null}
    </Modal>
  );
};

export default CoordinatorDetailsModal;