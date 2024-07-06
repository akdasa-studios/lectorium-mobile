import { Gesture, GestureDetail, createGesture } from "@ionic/vue"

export function useSwipeVerticallyGesture() {
  function create(options: {
    el: Node,
    onStart?: (detail: GestureDetail) => boolean | void,
    onEnd?:   (detail: GestureDetail) => boolean | void,
    onMove?:  (detail: GestureDetail) => boolean | void,
  }): Gesture {
    const gesture = createGesture({
      el: options.el,
      gestureName: 'open-bottom-section',
      gesturePriority: 31,
      direction: 'y',
      onStart: options.onStart,
      onEnd: options.onEnd,
      onMove: options.onMove,
    });
    gesture.enable(true);
    return gesture;
  }

  return { create }
}