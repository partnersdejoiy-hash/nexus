import { useNexusStore, MasterClockPhase, FormMode } from '@/stores/useNexusStore';
import { audioEngine } from '@/engine/AudioEngine';

export class MasterClock {
  private timerId: NodeJS.Timeout | null = null;
  private animFrameId: number | null = null;

  /**
   * Executes Cinematic Presentation sequence for opening a card
   */
  public triggerCardPresentation(moduleId: string, onComplete?: () => void) {
    const store = useNexusStore.getState();
    
    // Step 1: TARGETING
    store.setClockPhase('TARGETING');
    store.setCenteredModule(moduleId);
    audioEngine.playGestureChime('select');

    // Step 2: APPROACH (after 400ms)
    this.timerId = setTimeout(() => {
      store.setClockPhase('APPROACH');
      store.setActiveModule(moduleId);

      // Step 3: SETTLE (after 800ms)
      this.timerId = setTimeout(() => {
        store.setClockPhase('SETTLE');

        // Settle completes, back to IDLE
        this.timerId = setTimeout(() => {
          store.setClockPhase('IDLE');
          if (onComplete) onComplete();
        }, 1200);
      }, 800);
    }, 400);
  }

  /**
   * Cancels active presentation sequence upon user gesture
   */
  public cancelPresentation() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    useNexusStore.getState().setClockPhase('IDLE');
  }

  /**
   * Triggers Human Form transformation sequence
   */
  public triggerHumanFormTransform(targetMode: FormMode, onComplete?: () => void) {
    const store = useNexusStore.getState();
    if (store.formMode === targetMode && store.clockPhase !== 'IDLE') return;

    if (targetMode === 'HUMAN') {
      audioEngine.playGestureChime('transform');
      store.setClockPhase('TRANSFORMING_HUMAN');
      
      const startTime = performance.now();
      const duration = 2800; // 2.8 seconds total transition

      const stepTransform = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / duration);
        store.setTransformProgress(progress);

        if (progress < 1.0) {
          this.animFrameId = requestAnimationFrame(stepTransform);
        } else {
          store.setFormMode('HUMAN');
          store.setClockPhase('HUMAN_ACTIVE');
          store.addLog('info', 'KERNEL', 'NEXUS digital humanoid form fully assembled');
          if (onComplete) onComplete();
        }
      };

      this.animFrameId = requestAnimationFrame(stepTransform);
    } else {
      // Return to spatial mode (runs backward at 1.7x speed per Phase 7 spec!)
      audioEngine.playGestureChime('transform');
      store.setClockPhase('RETURNING');
      
      const startTime = performance.now();
      const duration = 2800 / 1.7; // ~1.64 seconds

      const stepReturn = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.max(0.0, 1.0 - (elapsed / duration));
        store.setTransformProgress(progress);

        if (progress > 0.0) {
          this.animFrameId = requestAnimationFrame(stepReturn);
        } else {
          store.setFormMode('SPATIAL');
          store.setClockPhase('IDLE');
          store.addLog('info', 'KERNEL', 'NEXUS spatial orbit ring returned');
          if (onComplete) onComplete();
        }
      };

      this.animFrameId = requestAnimationFrame(stepReturn);
    }
  }
}

export const masterClock = new MasterClock();
