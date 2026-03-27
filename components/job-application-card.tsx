import { Column, JobApplication } from "@/lib/models/models.types"
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { updateJobApplication } from "@/lib/actions/job-applications";

interface JobApplicationCardProps {
    job: JobApplication;
    columns: Column[]
}

export default function JobApplicationCard({ job, columns }: JobApplicationCardProps) {

    async function handleMove(newColumnId: string){
        try{
            const result = await updateJobApplication(job._id, {
                columnId: newColumnId
            })
        }catch(err){
            console.error("Failed to move job Application", err)
        }
    }

    return (
        <>
            <Card className="cursor-pointer transition-shadow hover:shadow-m hover:shadow-gray-400">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
                            {job.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{job.description}</p>}
                            {job.tags && job.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {job.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {job.jobUrl && (<a target="_blank" href={job.jobUrl} onClick={e => e.stopPropagation}>
                                <ExternalLink className="text-accent-foreground"/>
                            </a>)}

                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Edit2 />
                                    </DropdownMenuItem>
                                    {columns.length > 1 && (
                                        <>
                                            {columns.filter((c) => c._id !== job.columnId).map((column, key) => (
                                                <DropdownMenuItem key={key} onClick={() => handleMove(column._id)}>
                                                    Move to  {column.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </>
                                    )}

                                    <DropdownMenuItem>
                                        <Trash2 />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
