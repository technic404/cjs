import { CjsKeyFrame } from "./CjsKeyFramesUtil";

/**
 * Animation helper utility
 */
export class CjsAnimationExecutor {

    /**
     * Simple translateX animation
     */
    x(offset: number, time: number = 500): string {
        const keyframe = new CjsKeyFrame()
            .setDuration(time)
            .addEntry({ transform: `translateX(${offset}px)` })
            .addEntry({ transform: `translateX(0)` });

        return keyframe.getClass();
    }

    /**
     * Simple translateY animation
     */
    y(offset: number, time: number = 500): string {
        const keyframe = new CjsKeyFrame()
            .setDuration(time)
            .addEntry({ transform: `translateY(${offset}px)` })
            .addEntry({ transform: `translateY(0)` });

        return keyframe.getClass();
    }

    /**
     * Simple scale animation
     */
    scale(start: number, time: number = 500): string {
        const keyframe = new CjsKeyFrame()
            .setDuration(time)
            .addEntry({ transform: `scale(${start})` })
            .addEntry({ transform: `scale(1)` });

        return keyframe.getClass();
    }

    /**
     * Adds temporary class to element and removes it after timeout
     */
    tempClass(
        element: HTMLElement,
        className: string,
        time: number = 500
    ): void {
        if (!element) return;

        element.classList.add(className);

        setTimeout(() => {
            element.classList.remove(className);
        }, time);
    }
}

/**
 * Singleton
 */
export const CjsAnimation = new CjsAnimationExecutor();