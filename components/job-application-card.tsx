"use client"

import { Column, JobApplication } from "@/lib/models/models.types"
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { deleteJobApplication, updateJobApplication } from "@/lib/actions/job-applications";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

interface JobApplicationCardProps {
    job: JobApplication;
    columns: Column[]
}


export default function JobApplicationCard({ job, columns }: JobApplicationCardProps) {

    const [formData, setFormData] = useState({
        company: job.company,
        position: job.position,
        location: job.location || "",
        notes: job.notes || "",
        salary: job.salary || "",
        jobUrl: job.jobUrl || "",
        columnId: job.columnId || "",
        tags: job.tags?.join(", ") || "",
        description: job.description || "",
    })

    const [isEditing, setIsEditing] = useState(false)

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        
        try {
            const result = await updateJobApplication(job._id, {
                ...formData,
                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
            });

            if (!result.error) {
                setIsEditing(false)
            }
        } catch (err) {
            console.error("Failed to move job Application", err)
        }
    }


    const handleDelete = async (id: string) => {
        const result = await deleteJobApplication(id); // Await the server action
        if (result.error) {
            alert(result.error);
        }
        // No need to manually update state if revalidatePath("/dashboard") is working
    };
    

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
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {setIsEditing(true)}}>
                                        <Edit2 className="h-4 w-4"/>
                                        Edit
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

                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(job._id)  }>
                                        <Trash2 />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>


            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-2xl max-h-300 " >
                    <DialogHeader>
                        <DialogTitle>Add Job Application</DialogTitle>
                        <DialogDescription>Track a new job application</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleUpdate}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company *</Label>
                                    <Input id="company" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position *</Label>
                                    <Input id="position" required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Input id="location" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Salary</Label>
                                    <Input id="salary" placeholder="e.g., $100k - $150k" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="jobUrl">Job URL</Label>
                                    <Input id="jobUrl" placeholder="https://..." value={formData.jobUrl} onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input id="tags" placeholder="React, Tailwind, High Pay" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea rows={3} id="description" placeholder="Brief description of the role..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea id="notes" rows={4} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit" >Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
