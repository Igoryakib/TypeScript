import {onClickButtons, createDefaultPage} from './ts/functions/functions';
import { Buttons } from './ts/interfaces';


export async function render(): Promise<void> {
    // TODO render your app here
    createDefaultPage();
    onClickButtons(Buttons.popularBtn);
    onClickButtons(Buttons.topRatedBtn);
    onClickButtons(Buttons.upComingBtn);
    onClickButtons(Buttons.submitBtn);
}
