/**
 * An Observer in the Observer Pattern.
 */
export interface Observer {
    /**
     * Update this `Observer`. Called when updates are made to a `Subject`
     * this `Observer` is listening to.
     */
    update(): void;
}