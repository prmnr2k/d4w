import { trigger, state, style, transition, animate } from '@angular/animations';

export const ShowHideTrigger = trigger('ShowHideTrigger',[
    state(
        'start',
        style({
            opacity: 0
        })
    ),
    state(
        'end',
        style({
            opacity: 1
        })
    ),
    transition(
        'start => end',
        animate(1000)
    )


])