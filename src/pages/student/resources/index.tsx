import { Download } from 'lucide-react';
import { Button } from 'antd';
import { FaFilePdf } from 'react-icons/fa';
import { useGetStudentResourcesQuery } from "../../../redux/apiSlices/students/resources.slice";
import { imageUrl } from '../../../redux/api/baseApi';

export default function StudentResources() {

    const { data, isLoading } = useGetStudentResourcesQuery(undefined);

    const resources = data?.data?.resources || [];


    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <section className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="mt-1">
                        <FaFilePdf className="w-8 h-8 text-[#1E1E1E]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E1E1E] leading-tight font-heading">Resources</h1>
                        <p className="text-[#888888] mt-1 text-[15px]">
                            Helpful materials and references for effective mentoring
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {resources?.map((resource: any) => (
                    <div
                        key={resource._id}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#3BB77E]/30 transition-all duration-300"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-[#EBF9F1] flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-[#3BB77E]">
                                    {resource.type}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-[17px] font-semibold text-[#333333] group-hover:text-[#3BB77E] transition-colors">
                                    {resource.title}
                                </h3>

                                <p className="text-[#888888] text-sm mt-1">
                                 {resource.description} {resource.description}
                                </p>

                                <div className="flex items-center gap-2 mt-2 text-xs text-[#BCBCBC]">
                                    {/* <span>
                                        {new Date(resource.dueDate).toLocaleDateString()}
                                    </span> */}
                              <span>
                                Due:{" "}
                                {new Date(resource.dueDate || resource.createdAt).toLocaleString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                                </span>
                                </div>
                            </div>
                        </div>

            <Button
                icon={<Download className="w-5 h-5" />}
                className="flex items-center justify-center border-gray-100 text-[#60A5FA] hover:text-[#3B82F6] hover:border-[#3B82F6] !rounded-full !h-12 !w-12 p-0 shadow-sm"
                onClick={() =>
                    window.open(`${imageUrl}/${resource.pdf}`, "_blank")
                }
            />
                    </div>
                ))}
            </div>
        </section>
    );
}
