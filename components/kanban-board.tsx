"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.types"
import { Calendar, CheckCircle2, Mic, MoreHorizontal, MoreVertical, Trash2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import CreatedJobApplicationDialog from "./created-job-application-dialog"
import JobApplicationCard from "./job-application-card"
import useBoard from "@/lib/hooks/useBoard"



interface KanbanBoardProps {
    board: Board
    userId: string,
}

interface ColConfig {
    color: string, icon: React.ReactNode
}

const COLUMN_CONFIG: Array<ColConfig> = [
    {
        color: "bg-cyan-500",
        icon: <Calendar className="h-4 w-4"></Calendar>
    },
    {
        color: "bg-green-500",
        icon: <CheckCircle2 className="h-4 w-4"></CheckCircle2>
    },
    {
        color: "bg-yellow-500",
        icon: <Mic className="h-4 w-4"></Mic>
    },
    {
        color: "bg-red-500",
        icon: <XCircle className="h-4 w-4"></XCircle>
    },

]

function DroppableColumn({ column, config, boardId, sortedColumns }: { column: Column; config: ColConfig; boardId: string, sortedColumns: Column[] }) {

    const sortedJobs = column.jobApplications.sort((a, b) => a.order - b.order)

    return (
        <Card className="min-w-75 shrink-0 shadow-md p-0 pb-5">
            <CardHeader className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}>
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2 ">
                        {config.icon}
                        <CardTitle className="text-white text-base font-semibold">{column.name}</CardTitle>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mr-3">
                            <DropdownMenuItem className="text-destructive" >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </CardHeader>

            <CardContent className="space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg">
                {sortedJobs.map((job, key) => (
                    <SortableJobCard key={key} job={{ ...job, columnId: job.columnId || column._id }} columns={sortedColumns} />
                ))}

                <CreatedJobApplicationDialog columnId={column._id} boardId={boardId}></CreatedJobApplicationDialog>
            </CardContent>

        </Card>
    )

}


function SortableJobCard({ job, columns }: { job: JobApplication, columns: Column[] }) {
    return <div>
        <JobApplicationCard job={job} columns={columns} />
    </div>
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {

    // const columns = board.columns;
    const { columns, moveJob } = useBoard(board)

    const sortedColumns = columns?.sort((a, b) => a.order - b.order) || []; 

    return (
        <div >
            <div className="container mx-auto p-6">
                {sortedColumns.map((col, key) => {
                    const config = COLUMN_CONFIG[key] || {
                        color: "bg-cyan-500",
                        icon: <Calendar className="h-4 w-4"></Calendar>
                    }
                    return <div className="mb-5" key={key}><DroppableColumn column={col} config={config} boardId={board._id} sortedColumns={sortedColumns} /></div>
                })}
            </div>
        </div>
    )
}
