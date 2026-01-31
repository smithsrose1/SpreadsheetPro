import { CellModel } from "./cell.model";

export class CommentModel {
    private author: string;
    private text: string;
    private date: Date;
    private cell: CellModel;

    private resolved: boolean;
    private replies: CommentModel[] = []

    constructor(text: string, author: string) {
        this.text = text;
        this.author = author;
        this.date = new Date();
        this.resolved = false;
        //this.cell = cell;
    }

    public resolve(): void {
        this.resolved = true;
    }


    // Add a reply to the comment
    public addReply(text: string, author: string): void {
        const reply = new CommentModel(text, author);
        this.replies.push(reply);
    }

    // potentially change for UI 
    public edit(edits: string): void {
        this.text = edits;
    }

    public getAuthor(): string {
        return this.author;
    }

    public getText(): string {
        return this.text;
    }

    public getDate(): Date {
        return this.date;
    }

    public getResolved(): boolean {
        return this.resolved;
    }


}
