import { Observer } from "./observer";

/**
 * A Subject in the Observer Pattern.
 */
export interface Subject {
    /**
     * Subscribe the given `Observer` to updates to this `Subject`.
     * @param observer
     */
    attach(observer: Observer): void;

    /**
     * Unsubscribe the given `Observer` from updates to this `Subject`.
     * @param observer
     */
    detach(observer: Observer): void;

    /**
     * Notify all `Observer`s subscribed to this `Subject` of updates
     * to this `Subject`.
     */
    notify(): void;
}