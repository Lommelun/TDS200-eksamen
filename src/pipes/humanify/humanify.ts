import { Pipe, PipeTransform } from '@angular/core';
import Moment from 'moment';

@Pipe({
  name: 'humanify',
})
export class HumanifyPipe implements PipeTransform {
  
  // Transforms the input server time to 'human readable' (eg. 1 year ago, 2 days ago, 2 minutes ago..)
  transform(servertime: string) {
    return Moment(servertime, [Moment.defaultFormatUtc, Moment.ISO_8601, Moment.RFC_2822, 'MMMM D, Y H:m:s A zZ', 'MMMM D, Y H:m:s A', 'MMMM D, Y H:m:', 'MMMM D Y']).locale(['nb','no-no']).fromNow();
  }
}
