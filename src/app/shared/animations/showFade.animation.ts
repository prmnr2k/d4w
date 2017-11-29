import { trigger, state, style, transition, animate } from '@angular/animations';

export const ShowHideTrigger = trigger('ShowHideTrigger',[
    state(
        'start',
        style({
            opacity: 1,
            transform:'translateY(0)'
        })
    ),
    transition(
        '* => start',
        [
            style({
                opacity: 0,
                transform:'translateY(80px)'
            }),
            animate(
                '500ms ease-out',
                style({
                    opacity: 1,
                    transform:'translateY(0)'
                })
            )
        ]
    ),

])