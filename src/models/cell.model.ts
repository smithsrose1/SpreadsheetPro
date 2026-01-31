import { Error } from './error.model';
import { Subject } from '../interface/subject';
import { Observer } from '../interface/observer';
import { Parser } from './parser.model';

export class CellModel implements Subject {
    private savedInput: string;
    private content: string | number | null;
    private comments: Comment[];
    private error: Error;
    private references: Array<[number, number]>;
    private observers: Array<Observer>;


    public constructor(content: "") {
        this.content = content;
    }

    /**
     * Retrieves the current processed content of this cell.
     * @returns the current processed content of this cell.
     */
    public getContent(): string | number | null {
        return this.content;
    }

    public getReferences(): Array<[number, number]> {
        return this.references;
    }

    /**
     * Retrieves the current input of this cell.
     * @returns the input of this cell.
     */
    public getInput(): string | number | null {
        return this.savedInput;
    }

    /**
     * Updates the content of this cell.
     */
    public updateContent(value: string): void {
        this.savedInput = value;
        this.evaluateSavedInput();
    }

    /**
     * Clears the content of this cell.
     */
    public clearContent(): void {
        this.savedInput = "";
        this.content = null;
    }

    /**
     * Re-parses the saved input of this cell if it not empty.
     * Otherwise, returns the saved input back. 
     */
    public evaluateSavedInput(): void {
        if (this.savedInput.length == 0) {
            this.content = this.savedInput;
        } else {
            const parser = new Parser(this.savedInput);
            this.content = parser.parse();
            console.log("current cell content:", this.content)
            this.references = parser.getDependencies();
            
        }
    }
    public returnSavedInput(): string {
        return this.savedInput;
    }

    // public createComment(text: string, author: string): void {
    //     let new_comment = new CommentModel(text, author, this)
    //     this.comments.push(new_comment)
    // }

    public deleteComment(comment: Comment): void {
        let index = this.comments.indexOf(comment)
        this.comments.splice(index)
    }

    public getComments() {
        return this.comments;
    }

    /**
     * Make the given `Observer` listen for updates to this `Cell`.
     * @param observer
     */
    public attach(observer: Observer): void {
        this.observers.push(observer);
    }

    /**
     * Make the given `Observer` stop listening for updates to this `Cell`.
     * @param observer 
     */
    public detach(observer: Observer): void {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    /**
     * Notify all of this `CellModel`'s observers of updates to this `CellModel`.
     */
    public notify(): void {
        for (const observer of this.observers) {
            observer.update();
        }
    }
}