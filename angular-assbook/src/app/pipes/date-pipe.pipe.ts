import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe',
  standalone: true
})
export class DatePipePipe implements PipeTransform {

transform(postDate: string | undefined): string {
    if (postDate=== undefined)
      return "";
    const datePost = Date.parse (postDate!);
    const formatDate = new Intl.DateTimeFormat('en-US', {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    } );
    return formatDate.format(datePost);

  }

}
